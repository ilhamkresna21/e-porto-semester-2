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

## Menambahkan video mengajar

Buka `js/script.js`, cari daftar `VIDEOS`, lalu tambahkan link Anda:

```js
const VIDEOS = [
  { title: "Praktik Mengajar Siklus 1", desc: "Materi Algoritma & Flowchart",
    url: "https://youtu.be/XXXXXXXXXXX" },
  { title: "Praktik Mengajar Siklus 2", desc: "Materi HTML",
    url: "https://drive.google.com/file/d/FILE_ID/view" },
];
```

- **YouTube** — dukung `youtu.be/...`, `watch?v=...`, dan `shorts/...` (thumbnail diambil otomatis).
- **Google Drive** — dukung `/file/d/...` dan `?id=...`. **Penting:** set video ke akses *Anyone with the link* agar bisa ditonton dari situs.
- Video tampil sebagai kartu thumbnail, diklik → player muncul di modal (tanpa pindah halaman).
- Selama daftar `VIDEOS` masih kosong, section menampilkan pesan "Belum ada video yang ditautkan".

## Menautkan dokumen artefak (RPP, media, dll.)

Buka `js/script.js`, cari daftar `ARTEFAK_ITEMS`. Setiap item punya:

```js
{
  icon: "📄",
  title: "Rencana Pelaksanaan Pembelajaran (RPP)",
  slug: "rencana-pelaksanaan-pembelajaran-rpp",
  note: "Perangkat pembelajaran lengkap",
  desc: "Deskripsi singkat yang tampil di modal.",
  driveId: "",                 // ← isi ID file Google Drive
  images: [],                  // ← opsional: ["assets/img/rpp-1.jpg", ...]
}
```

- **Cara mendapatkan ID Drive:** dari link `https://drive.google.com/file/d/1AbC...XYZ/view`,
  ID-nya adalah bagian `1AbC...XYZ`.
- Set file Drive ke akses **"Anyone with the link"** agar bisa ditampilkan.
- Selama `driveId` masih kosong, modal menampilkan placeholder "belum ditautkan"
  plus deskripsi & tautan sumber asli di Google Sites.
- `images` untuk galeri foto pendukung (letakkan fotonya di `assets/img/`).

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

- Kartu **Artefak Produk (Siklus 1–3)** kini membuka **modal dokumen di dalam situs**
  (deskripsi + embed PDF Google Drive + galeri foto), bukan lagi tautan keluar.
  Tombol "Buka sumber asli" di modal tetap mengarah ke halaman Google Sites sebagai cadangan.
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
