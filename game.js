// Pengaturan Kanvas dan Context
const canvas = document.getElementById('tetrisCanvas');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('nextPieceCanvas');
const nextCtx = nextCanvas.getContext('2d');

// Konstanta Permainan
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = canvas.width / COLS; // Ukuran setiap blok

// Papan Permainan (Grid)
let grid = createGrid(ROWS, COLS);

// State Permainan
let score = 0;
let level = 1;
let linesCleared = 0;
let isGameOver = false;

// Blok Aktif
let currentPiece;
let nextPiece;
let pieceX;
let pieceY;

// Loop Permainan dan Waktu
let dropCounter = 0;
let dropInterval = 3500; // Mulai dengan 3.5 detik (sangat lambat untuk pemula)
let lastTime = 0;

// Elemen UI
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const finalScoreElement = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');

// Definisi Tetrominoes (Blok-blok Tetris)
// Format: [Nama Bentuk, Warna, Matriks Rotasi]
const TETROMINOES = [
    // I (Cyan/Biru Muda)
    { shape: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], color: '#00FFFF', name: 'I' },
    // J (Biru Tua)
    { shape: [[1, 0, 0], [1, 1, 1], [0, 0, 0]], color: '#0000FF', name: 'J' },
    // L (Oranye)
    { shape: [[0, 0, 1], [1, 1, 1], [0, 0, 0]], color: '#FFA500', name: 'L' },
    // O (Kuning)
    { shape: [[1, 1], [1, 1]], color: '#FFFF00', name: 'O' },
    // S (Hijau)
    { shape: [[0, 1, 1], [1, 1, 0], [0, 0, 0]], color: '#00FF00', name: 'S' },
    // T (Ungu)
    { shape: [[0, 1, 0], [1, 1, 1], [0, 0, 0]], color: '#800080', name: 'T' },
    // Z (Merah)
    { shape: [[1, 1, 0], [0, 1, 1], [0, 0, 0]], color: '#FF0000', name: 'Z' },
];
// Warna blok yang sudah terkunci di grid. Indeks 0 adalah warna kosong/latar belakang.
const COLORS = ['#0d0d1a'].concat(TETROMINOES.map(t => t.color));


// --- FUNGSI UTAMA GAME ---

/**
 * Membuat grid (papan) permainan dengan nilai awal 0 (kosong).
 * @param {number} rows
 * @param {number} cols
 * @returns {number[][]} Grid array
 */
function createGrid(rows, cols) {
    return Array.from({ length: rows }, () => Array(cols).fill(0));
}

/**
 * Mengambil blok acak dari definisi TETROMINOES.
 * Nilai yang dikembalikan (1-7) digunakan sebagai indeks warna.
 * @returns {{shape: number[][], color: string, name: string, value: number}}
 */
function getRandomPiece() {
    const index = Math.floor(Math.random() * TETROMINOES.length);
    const piece = TETROMINOES[index];
    // Tambahkan nilai (1-7) untuk menyimpan warna di grid
    return { 
        shape: piece.shape, 
        color: piece.color, 
        name: piece.name, 
        value: index + 1 
    };
}

/**
 * Memindahkan blok berikutnya ke blok aktif dan menghasilkan blok berikutnya yang baru.
 */
function resetPiece() {
    if (nextPiece) {
        currentPiece = nextPiece;
    } else {
        currentPiece = getRandomPiece();
    }
    nextPiece = getRandomPiece();

    // Atur posisi awal (di tengah atas)
    pieceX = Math.floor(COLS / 2) - Math.floor(currentPiece.shape[0].length / 2);
    pieceY = 0;
    
    // Periksa Game Over: jika blok baru langsung bertabrakan
    if (checkCollision(0, 0, currentPiece.shape)) {
        isGameOver = true;
        showGameOver();
    }

    // Perbarui tampilan blok berikutnya
    drawNextPiece();
}

/**
 * Cek tabrakan antara blok dan grid/dinding.
 * @param {number} offsetX
 * @param {number} offsetY
 * @param {number[][]} shape
 * @returns {boolean} True jika ada tabrakan
 */
function checkCollision(offsetX, offsetY, shape) {
    for (let y = 0; y < shape.length; ++y) {
        for (let x = 0; x < shape[y].length; ++x) {
            if (shape[y][x] !== 0) {
                const newX = pieceX + x + offsetX;
                const newY = pieceY + y + offsetY;

                // Tabrakan dengan dinding samping atau bawah, atau blok lain
                if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && grid[newY][newX] !== 0)) {
                    return true;
                }
            }
        }
    }
    return false;
}

/**
 * Menyalin bentuk blok saat ini ke dalam grid, menguncinya di tempat.
 * @param {number} [hardDropDistance=0] - Jarak hard drop untuk bonus skor
 */
function mergePiece(hardDropDistance = 0) {
    for (let y = 0; y < currentPiece.shape.length; ++y) {
        for (let x = 0; x < currentPiece.shape[y].length; ++x) {
            if (currentPiece.shape[y][x] !== 0) {
                // Simpan nilai (indeks warna) blok
                grid[pieceY + y][pieceX + x] = currentPiece.value;
            }
        }
    }
    // Setelah digabungkan, periksa baris yang selesai
    checkLines(hardDropDistance);
    // Pindahkan ke blok berikutnya
    resetPiece();
}

/**
 * Memeriksa dan menghapus baris yang terisi penuh, lalu menggeser baris di atasnya ke bawah.
 * @param {number} [hardDropDistance=0] - Jarak hard drop untuk bonus skor
 */
function checkLines(hardDropDistance = 0) {
    let lines = 0;
    outer: for (let y = ROWS - 1; y >= 0; --y) {
        for (let x = 0; x < COLS; ++x) {
            if (grid[y][x] === 0) {
                continue outer; // Baris ini tidak penuh
            }
        }

        // Baris Penuh! Hapus baris dan geser semua baris di atasnya ke bawah
        const row = grid.splice(y, 1)[0];
        grid.unshift(Array(COLS).fill(0)); // Tambahkan baris kosong di atas
        y++; // Periksa baris baru di posisi ini
        lines++;
    }

    // Update skor: baik ada line clear atau hanya hard drop bonus
    if (lines > 0 || hardDropDistance > 0) {
        updateScore(lines, hardDropDistance);
    }
}

/**
 * Memutar bentuk blok saat ini.
 * @param {number} dir - 1 untuk searah jarum jam, -1 untuk berlawanan.
 */
function rotatePiece(dir) {
    const shape = currentPiece.shape;
    const newShape = Array.from({ length: shape[0].length }, () => Array(shape.length).fill(0));
    
    for (let y = 0; y < shape.length; ++y) {
        for (let x = 0; x < shape[y].length; ++x) {
            if (dir > 0) { // Searah jarum jam
                newShape[x][shape.length - 1 - y] = shape[y][x];
            } else { // Berlawanan arah jarum jam
                newShape[shape.length - 1 - x][y] = shape[y][x];
            }
        }
    }

    // Uji tabrakan setelah rotasi
    if (!checkCollision(0, 0, newShape)) {
        currentPiece.shape = newShape;
    } else {
        // WALL KICK: Coba pindahkan sedikit jika terjadi tabrakan
        // Sederhananya, coba pindah 1 ke kanan atau kiri
        let kicked = false;
        const kicks = [1, -1, 2, -2]; 
        for (const offset of kicks) {
            if (!checkCollision(offset, 0, newShape)) {
                pieceX += offset;
                currentPiece.shape = newShape;
                kicked = true;
                break;
            }
        }
        // Jika tidak berhasil, rotasi dibatalkan
    }
}

/**
 * Memindahkan blok secara horizontal.
 * @param {number} dir - -1 untuk kiri, 1 untuk kanan.
 */
function movePiece(dir) {
    if (!checkCollision(dir, 0, currentPiece.shape)) {
        pieceX += dir;
    }
}

/**
 * Memindahkan blok ke bawah (soft drop).
 */
function dropPiece() {
    if (!checkCollision(0, 1, currentPiece.shape)) {
        pieceY++;
        return true;
    } else {
        // Tidak bisa jatuh lagi, gabungkan
        mergePiece();
        return false;
    }
}

/**
 * Menjatuhkan blok secara instan ke bawah (hard drop).
 */
function hardDrop() {
    if (isGameOver) return;
    let distance = 0;
    // Hitung jarak jatuh
    while (!checkCollision(0, distance + 1, currentPiece.shape)) {
        distance++;
    }
    // Pindahkan blok ke posisi akhir
    pieceY += distance;
    // Gabungkan dengan passing hard drop distance untuk bonus skor
    mergePiece(distance);
}

/**
 * Menggambar satu blok di koordinat tertentu dengan warna yang ditentukan.
 * @param {number} x
 * @param {number} y
 * @param {string} color
 * @param {CanvasRenderingContext2D} context
 * @param {number} size
 */
function drawBlock(x, y, color, context, size) {
    context.fillStyle = color;
    // Gambar persegi utama (dengan sedikit padding/border di dalam)
    context.fillRect(x * size + 1, y * size + 1, size - 2, size - 2); 
    
    // Tambahkan sedikit efek highlight dan shadow untuk tampilan 3D
    context.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    context.lineWidth = 1;
    context.strokeRect(x * size + 1, y * size + 1, size - 2, size - 2);

    context.fillStyle = 'rgba(255, 255, 255, 0.2)'; // Highlight
    context.fillRect(x * size + 1, y * size + 1, size - 2, size * 0.2);

    context.fillStyle = 'rgba(0, 0, 0, 0.2)'; // Shadow
    context.fillRect(x * size + 1, y * size + size - 2 - size * 0.2, size - 2, size * 0.2);
}

/**
 * Menggambar seluruh grid permainan dan blok yang terkunci.
 */
function drawGrid() {
    for (let y = 0; y < ROWS; ++y) {
        for (let x = 0; x < COLS; ++x) {
            if (grid[y][x] !== 0) {
                // Gunakan nilai di grid sebagai indeks untuk mengambil warna
                const colorIndex = grid[y][x];
                drawBlock(x, y, COLORS[colorIndex], ctx, BLOCK_SIZE);
            }
        }
    }
}

/**
 * Menggambar blok aktif saat ini.
 */
function drawPiece() {
    if (!currentPiece) return;
    const shape = currentPiece.shape;
    for (let y = 0; y < shape.length; ++y) {
        for (let x = 0; x < shape[y].length; ++x) {
            if (shape[y][x] !== 0) {
                drawBlock(pieceX + x, pieceY + y, currentPiece.color, ctx, BLOCK_SIZE);
            }
        }
    }
}

/**
 * Menggambar blok berikutnya di kanvas kecil.
 */
function drawNextPiece() {
    if (!nextPiece) return;
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    const size = nextCanvas.width / 4; // Ukuran blok di kanvas kecil
    const shape = nextPiece.shape;

    // Hitung offset agar blok berada di tengah
    const shapeWidth = shape[0].length;
    const shapeHeight = shape.length;
    const offsetX = Math.floor((4 - shapeWidth) / 2);
    const offsetY = Math.floor((4 - shapeHeight) / 2);

    for (let y = 0; y < shape.length; ++y) {
        for (let x = 0; x < shape[y].length; ++x) {
            if (shape[y][x] !== 0) {
                drawBlock(offsetX + x, offsetY + y, nextPiece.color, nextCtx, size);
            }
        }
    }
}

/**
 * Fungsi utama loop permainan.
 * @param {number} [time=0] - Waktu yang dilewatkan oleh requestAnimationFrame.
 */
function gameLoop(time = 0) {
    if (isGameOver) return;

    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        dropPiece();
        dropCounter = 0; // Reset counter setelah drop otomatis
    }

    // Bersihkan kanvas
    ctx.fillStyle = '#0d0d1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Gambar semua elemen
    drawGrid();
    drawPiece();

    // Panggil loop lagi
    requestAnimationFrame(gameLoop);
}

/**
 * Memperbarui skor dan level.
 * @param {number} lines - Jumlah baris yang dihapus.
 * @param {number} [dropDistance=0] - Jarak hard drop.
 */
function updateScore(lines, dropDistance = 0) {
    linesCleared += lines;

    // Aturan skor standar Tetris
    const scoreTable = [0, 40, 100, 300, 1200];
    score += scoreTable[lines] * level;

    // Skor untuk hard drop
    score += dropDistance * 2;

    scoreElement.textContent = score;

    // Perbarui level berdasarkan skor (setiap 50 poin = 1 level)
    // Level 1: 0-49 poin, Level 2: 50-99 poin, Level 3: 100-149 poin, dst.
    const newLevel = Math.floor(score / 50) + 1;
    if (newLevel > level) {
        level = newLevel;
        levelElement.textContent = level;
        // Kecepatan jatuh bertambah secara bertahap
        // Mulai dari 3500ms, berkurang ~12% setiap level (lebih lambat)
        dropInterval = 3500 * Math.pow(0.88, level - 1);
    }
}

/**
 * Menampilkan overlay Game Over.
 */
function showGameOver() {
    finalScoreElement.textContent = score;
    gameOverOverlay.classList.remove('hidden');
}

/**
 * Memulai atau memulai ulang permainan.
 */
function startGame() {
    // Reset state
    grid = createGrid(ROWS, COLS);
    score = 0;
    level = 1;
    linesCleared = 0;
    isGameOver = false;
    dropInterval = 3500; // Mulai dengan 3.5 detik (sangat lambat untuk pemula)
    dropCounter = 0;

    scoreElement.textContent = score;
    levelElement.textContent = level;
    gameOverOverlay.classList.add('hidden');

    // Set blok awal
    nextPiece = getRandomPiece();
    resetPiece();

    // Mulai loop permainan
    lastTime = 0;
    requestAnimationFrame(gameLoop);
}


// --- INPUT DAN EVENT LISTENER ---

// Kontrol Keyboard (WASD + Spacebar)
document.addEventListener('keydown', (e) => {
    if (isGameOver) return;

    switch (e.key.toLowerCase()) {
        case 'a': // Kiri
            movePiece(-1);
            break;
        case 'd': // Kanan
            movePiece(1);
            break;
        case 's': // Soft Drop (turun)
            dropPiece();
            dropCounter = 0; // Reset counter agar kecepatan drop terasa instan
            break;
        case 'w': // Putar
            rotatePiece(1);
            break;
        case ' ': // Spasi - Hard Drop
            e.preventDefault(); // Mencegah scrolling
            hardDrop();
            break;
    }
});

// Kontrol Tombol (Mobile/Sentuh)
document.getElementById('btnLeft').addEventListener('click', () => {
    if (!isGameOver) movePiece(-1);
});
document.getElementById('btnRight').addEventListener('click', () => {
    if (!isGameOver) movePiece(1);
});
document.getElementById('btnDown').addEventListener('click', () => {
    if (!isGameOver) dropPiece();
});
document.getElementById('btnRotate').addEventListener('click', () => {
    if (!isGameOver) rotatePiece(1);
});
document.getElementById('btnHardDrop').addEventListener('click', () => {
    if (!isGameOver) hardDrop();
});

// Tombol Mulai Ulang
restartButton.addEventListener('click', startGame);

// --- INISIALISASI ---

// Mengatur inisialisasi pada saat window telah dimuat
window.onload = function() {
    startGame();
};

