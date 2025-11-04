# 🎮 Tetris Rahmat Edition

Sebuah implementasi game Tetris klasik yang dibuat dengan HTML5, CSS3, dan JavaScript murni. Game ini menampilkan kontrol WASD modern, sistem scoring standar Tetris, dan desain responsif yang bekerja di desktop maupun mobile.

## 🌐 Demo Live

**[🎮 Mainkan Sekarang!](https://rahmatdial-prjct.github.io/tetrisrahmat/)**

## ✨ Fitur

### 🎯 Gameplay
- **7 Tetromino Klasik** - Semua bentuk standar Tetris (I, O, T, S, Z, J, L) dengan warna autentik
- **Sistem Rotasi** - Rotasi piece dengan wall-kick system
- **Line Clearing** - Deteksi dan penghapusan baris otomatis
- **Collision Detection** - Deteksi tabrakan dengan dinding, lantai, dan piece lain
- **Game Over Detection** - Deteksi game over saat piece baru tidak bisa spawn

### 🎮 Kontrol
#### Keyboard (Desktop)
- **W** - Putar blok (Rotate)
- **A** - Geser kiri (Move Left)
- **S** - Turun cepat / Soft Drop (Move Down)
- **D** - Geser kanan (Move Right)
- **Spasi** - Hard Drop (jatuhkan langsung ke bawah)

#### Touch Controls (Mobile)
- Tombol arah untuk menggerakkan piece
- Tombol "Putar" untuk rotasi
- Tombol "Drop" untuk hard drop

### 📊 Sistem Scoring
- **1 Line** - 40 × Level
- **2 Lines** - 100 × Level
- **3 Lines** - 300 × Level
- **4 Lines (Tetris)** - 1200 × Level
- **Hard Drop Bonus** - 2 poin per baris

### 📈 Level Progression
- Sistem berbasis skor: setiap **50 poin** naik 1 level
- Kecepatan jatuh meningkat 12% setiap level
- Level 1 dimulai dengan kecepatan 3.5 detik (beginner-friendly)

### 🎨 Desain
- **Dark Theme** - Tema gelap modern dengan aksen ungu/pink
- **Responsive Design** - Bekerja sempurna di desktop dan mobile
- **3D Block Effects** - Efek highlight dan shadow pada blok
- **Smooth Animations** - Transisi dan animasi yang halus
- **Next Piece Preview** - Preview piece berikutnya

## 🚀 Teknologi

- **HTML5** - Struktur dan Canvas API untuk rendering
- **CSS3** - Styling dengan Tailwind CSS
- **JavaScript (Vanilla)** - Game logic tanpa framework
- **Google Fonts** - Inter font family

## 📁 Struktur File

```
tetrisrahmat/
├── index.html      # Struktur HTML utama
├── styles.css      # Custom CSS styling
├── game.js         # Game logic dan mechanics
└── README.md       # Dokumentasi ini
```

## 🎯 Cara Bermain

1. **Tujuan**: Susun blok-blok Tetromino untuk membentuk baris horizontal yang lengkap
2. **Line Clear**: Baris yang terisi penuh akan hilang dan memberikan poin
3. **Game Over**: Game berakhir ketika blok baru tidak bisa muncul di bagian atas
4. **Strategi**: 
   - Usahakan membuat Tetris (4 baris sekaligus) untuk poin maksimal
   - Jangan biarkan tumpukan terlalu tinggi
   - Gunakan hard drop (Spasi) untuk placement cepat dan bonus poin

## 💻 Instalasi Lokal

### Clone Repository
```bash
git clone https://github.com/rahmatdial-prjct/tetrisrahmat.git
cd tetrisrahmat
```

### Jalankan Lokal
Buka file `index.html` di browser, atau gunakan local server:

```bash
# Menggunakan Python 3
python -m http.server 8000

# Menggunakan PHP
php -S localhost:8000

# Menggunakan Node.js (http-server)
npx http-server
```

Kemudian buka `http://localhost:8000` di browser.

## 🛠️ Development

### Modifikasi Kecepatan Game
Edit variabel `dropInterval` di `game.js`:
```javascript
let dropInterval = 3500; // Dalam milidetik (3.5 detik)
```

### Modifikasi Level Progression
Edit formula di fungsi `updateScore()`:
```javascript
const newLevel = Math.floor(score / 50) + 1; // Setiap 50 poin = 1 level
```

### Modifikasi Scoring
Edit `scoreTable` di fungsi `updateScore()`:
```javascript
const scoreTable = [0, 40, 100, 300, 1200]; // [0 lines, 1 line, 2 lines, 3 lines, 4 lines]
```

## 🐛 Bug Fixes & Improvements

### Recent Fixes
- ✅ Fixed rapid block falling issue - blocks now fall at correct speed
- ✅ Fixed scoring bug - score only increases on line clears and hard drops
- ✅ Improved hard drop performance - instant placement without visual glitches
- ✅ Adjusted initial game speed for beginner-friendly experience

## 📝 Changelog

### Version 1.0.0 (2025-11-04)
- ✨ Initial release
- 🎮 Complete Tetris gameplay with all standard mechanics
- 🎨 Modern dark theme with responsive design
- ⌨️ WASD + Spacebar controls
- 📱 Mobile touch controls
- 📊 Standard Tetris scoring system
- 📈 Score-based level progression

## 🤝 Contributing

Kontribusi sangat diterima! Jika Anda ingin berkontribusi:

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan Anda (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Project ini bersifat open source dan tersedia untuk digunakan secara bebas.

## 👤 Author

**Rahmat**
- GitHub: [@rahmatdial-prjct](https://github.com/rahmatdial-prjct)
- Repository: [tetrisrahmat](https://github.com/rahmatdial-prjct/tetrisrahmat)

## 🙏 Acknowledgments

- Terinspirasi dari game Tetris klasik oleh Alexey Pajitnov
- Menggunakan Tailwind CSS untuk styling
- Font dari Google Fonts (Inter)

---

**Selamat Bermain! 🎮✨**

Jika Anda menyukai project ini, jangan lupa berikan ⭐ di GitHub!

