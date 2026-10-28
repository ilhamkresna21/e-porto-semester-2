# E-Portofolio PPG Semester 2 — Ilham Kresnamurti, S.Kom.

Situs e-portofolio untuk Program Pendidikan Profesi Guru (PPG) Calon Guru Semester 2.
Frontend statis (HTML/CSS/JavaScript) dengan admin berbasis **Sanity Studio** untuk
mengubah foto dan menautkan dokumen/video Google Drive tanpa menyentuh kode.

## Arsitektur

```
┌─────────────────────────┐        ┌──────────────────────────┐
│  Situs statis           │        │  Sanity Studio (admin)   │
│  index.html + css/js    │◀───────│  edit foto, Drive, video  │
│  (Vercel / GitHub Pages)│  API   │  https://….sanity.studio │
└─────────────────────────┘        └──────────────────────────┘
```

- **Frontend** — `index.html`, `css/style.css`, `js/`.
- **Admin** — folder `studio/`, schema Sanity untuk foto, siklus, LK 3, lampiran, dan video.
- **Fallback** — selama CMS belum diisi atau gagal dimuat, situs memakai data cadangan di
  `js/script.js`. Situs tetap bisa dibuka tanpa Sanity.

## Struktur folder

```
├── index.html
├── css/style.css
├── js/
│   ├── config.js          # projectId Sanity (diisi setelah project dibuat)
│   ├── content.js         # query & normalisasi konten Sanity
│   └── script.js          # data cadangan + render UI
├── assets/img/            # foto fallback
├── studio/                # Sanity Studio (admin)
│   ├── schemas/           # model konten
│   ├── seed.mjs           # generator konten awal
│   ├── seed.ndjson        # konten awal siap impor
│   └── sanity.config.ts
├── server.js              # server lokal sederhana
└── README.md
```

## Menjalankan situs secara lokal

```bash
node server.js
# buka http://localhost:8123
```

Tanpa Sanity pun situs tetap tampil memakai data cadangan.

## Menjalankan admin (Sanity Studio)

```bash
cd studio
copy .env.example .env
# isi SANITY_STUDIO_PROJECT_ID di .env
npm install
npm run dev
# buka http://localhost:3333
```

Login memakai akun Sanity (bisa lewat GitHub). Setelah project dibuat, isi juga
`js/config.js`:

```js
window.EPORTO_CONFIG = {
  sanityProjectId: "project_id_anda",
  sanityDataset: "production",
  sanityApiVersion: "2025-02-19",
};
```

## Cara mengelola konten

Buka Studio, lalu pilih bagian berikut:

| Bagian | Isi |
|---|---|
| **Pengaturan Situs** | Judul, deskripsi, kontak, teks footer. |
| **Foto Situs** | Foto hero, profil, tujuan guru, inspirasi, refleksi, dan 4 foto daerah. |
| **Siklus 1–4** | Deskripsi siklus dan 6 artefak produk (RPP, media, hasil karya, dokumentasi, analisis, refleksi). |
| **LK 3** | Laporan LK 3 dan dokumen pendukung. |
| **Lampiran** | Dokumen penilaian, administrasi, dan kegiatan. |
| **Galeri Video** | Link YouTube/Google Drive, kategori, thumbnail opsional. |

Setiap kali selesai mengubah konten, klik **Publish**. Perubahan langsung tampil di situs
setelah halaman dimuat ulang.

### Menautkan Google Drive

1. Unggah file ke Google Drive.
2. Klik **Share** → ubah akses menjadi **Anyone with the link**.
3. Salin link, lalu tempel ke kolom **Link Google Drive** pada item terkait.
4. Untuk dokumen, link `/file/d/…/view` akan di-embed. Untuk folder, tombol
   “Buka Dokumen di Google Drive” akan ditampilkan.
5. Untuk video, link `/file/d/…/view` atau `?id=…` akan diputar di modal situs.

> **Penting:** file harus publik (“Anyone with the link”), bukan “Restricted”, agar
> bisa tampil di situs.

### Mengunggah foto

- Gunakan JPG/PNG/WebP.
- Ukuran ideal: lebar 1200–1600 px, di bawah 2 MB per foto.
- Isi **Teks alternatif** dengan deskripsi singkat foto.
- Foto bisa di-crop/fokuskan lewat titik fokus (hotspot) di Studio.
- Urutan foto dalam satu item bisa diubah dengan drag-and-drop.

## Impor konten awal (sekali saja)

```bash
cd studio
node seed.mjs
npx sanity dataset import seed.ndjson production
```

Seed berisi 4 siklus, LK 3, lampiran, pengaturan situs, dan galeri video kosong.
Foto belum disertakan — unggah lewat Studio.

## Deploy

### Opsi A — Vercel

1. Hubungkan repository ini ke Vercel.
2. Framework preset: **Other**; build command kosong; output directory: root.
3. Tambahkan environment variable bila diperlukan (frontend hanya membaca `js/config.js`).
4. Deploy.

### Opsi B — GitHub Pages

1. Buka **Settings → Pages**.
2. Pilih branch `main`, folder `/ (root)`.
3. Simpan. Situs tersedia di `https://<username>.github.io/<repo>/`.

> GitHub Pages gratis untuk repository publik. Jika repository privat, gunakan Vercel
> atau GitHub Pro.

### Deploy Sanity Studio

```bash
cd studio
npm run deploy
# Studio tersedia di https://e-porto-ilham.sanity.studio
```

Jangan lupa menambahkan domain situs ke **CORS origins** di pengaturan project Sanity
(`https://*.vercel.app`, domain produksi, dan `http://localhost:8123`).

## Catatan

- Repository lama `tugas-ppg` tetap dibiarkan sebagai cadangan.
- Data Sanity tersimpan di Sanity Cloud, bukan di GitHub. Lakukan **Export** dataset
  secara berkala dari dashboard Sanity.
- Jangan mengubah ID dokumen singleton (`siteSettings`, `siteImages`, `lk3`,
  `lampiran`, `videoGallery`) agar query frontend tetap menemukannya.
