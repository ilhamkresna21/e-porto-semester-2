# Portofolio PPG — Ilham Kresnamurti, S.Kom.

Remake situs Google Sites menjadi **HTML + CSS + JavaScript vanilla** dengan tampilan modern & simple.
Semua konten asli (teks profil, keunikan daerah, inspirasi, artefak, model guru, refleksi) dipindahkan
lengkap ke situs ini.

## Struktur

```
├── index.html          # Satu halaman (single page) berisi semua section
├── css/style.css       # Tema modern: ringan, responsif, dark mode
├── js/script.js        # Menu, tabs, scroll-spy, animasi, tema gelap
├── assets/img/         # Tempat foto-foto Anda
│   ├── placeholder-*.svg
│   ├── hero.jpg        ← letakkan foto asli di sini (opsional)
│   ├── profil-1.jpg    ←
│   ├── candi-sukuh.jpg ← dst.
├── server.js           # Server mini untuk pratinjau lokal (bukan bagian situs)
└── README.md
```

## Cara menjalankan

Cara termudah: buka `index.html` langsung di browser (double-click).

Atau pakai server lokal (fitur tabs & semuanya tetap jalan):

```
node server.js
# lalu buka http://localhost:8123
```

## Menambahkan foto asli

Gambar dari CDN Google Sites tidak bisa diunduh, jadi saat ini dipakai placeholder SVG.
Untuk menggantinya, letakkan file foto di `assets/img/` dengan nama sesuai yang dipanggil di `index.html`:

| Nama file         | Untuk bagian                          |
|-------------------|---------------------------------------|
| `hero.jpg`        | Foto besar di halaman beranda         |
| `profil-1.jpg`    | Foto profil "Tentang Saya"            |
| `profil-2.jpg`    | Foto kartu "Tujuan Menjadi Guru"      |
| `inspirasi.jpg`   | Foto kartu "Inspirasi Menjadi Guru"   |
| `refleksi.jpg`    | Header section Refleksi               |
| `candi-sukuh.jpg` | Candi Sukuh                           |
| `grojogan-sewu.jpg` | Air Terjun Grojogan Sewu            |
| `sate-kelinci.jpg`  | Sate Kelinci Tawangmangu            |
| `jadah-tempe.jpg`   | Jadah Tempe                         |

Jika file tidak ada, gambar otomatis menampilkan placeholder SVG (tanpa error).

## Catatan konten

- Kartu **Artefak Produk (Siklus 1–3)** dan **Lampiran** tertaut ke halaman Google Sites asli
  (dokumen RPP, media, hasil kerja murid, dll. tetap dibuka dari sana). Ubah tautannya di
  `js/script.js` (variabel `SITES_BASE` dan `ARTEFAK_ITEMS`) atau di `index.html` bila sudah
  dipindahkan ke Google Drive sendiri.
- Tautan kontak sudah diperbaiki (email `ilhammurti163@gmail.com`, WhatsApp `wa.me/62895415845020`,
  Instagram `@krsnailh`, TikTok `@movitt11`) — tautan rusak dari versi Google Sites sudah dibetulkan.

## Fitur

- Navigasi sticky + scroll-spy (menu aktif otomatis mengikuti section)
- Menu hamburger untuk HP
- Tab Siklus 1/2/3 pada Artefak Produk
- Accordion untuk 3 Refleksi
- Tema gelap/terang (tersimpan di browser)
- Animasi muncul saat scroll (menghormati prefers-reduced-motion)
- 100% responsif (desktop, tablet, HP)
- Tanpa framework — murni HTML/CSS/JS

## Cara online-kan (mis. GitHub Pages)

1. Buat repository baru di GitHub, unggah seluruh isi folder ini.
2. Buka **Settings → Pages → Branch: main → / (root) → Save**.
3. Situs langsung dapat diakses di `https://<username>.github.io/<nama-repo>/`.
