# E-Portofolio PPG Semester 2 — Ilham Kresnamurti, S.Kom.

Situs e-portofolio untuk Program Pendidikan Profesi Guru (PPG) Calon Guru
Semester 2. Frontend statis (HTML/CSS/JavaScript) dengan halaman admin berbasis
GitHub untuk mengubah foto dan menautkan dokumen/video Google Drive.

## Arsitektur

```
┌──────────────────────────────┐
│  Situs statis (GitHub Pages) │
│  index.html + css/js         │
│  membaca content.json        │
└──────────────┬───────────────┘
               │
┌──────────────▼───────────────┐
│  Admin (/admin.html)         │
│  login token GitHub          │
│  edit foto, Drive, video     │
│  simpan → commit content.json│
└──────────────────────────────┘
```

- **Frontend** — `index.html`, `css/style.css`, `js/`.
- **Admin** — `admin.html`, `css/admin.css`, `js/admin.js`.
- **Konten** — `content.json` di root repository.
- **Foto upload** — disimpan di `assets/uploads/` lewat GitHub API.
- **Fallback** — jika `content.json` gagal dimuat, situs memakai data cadangan
  di `js/script.js`.

## Struktur folder

```
├── index.html              # halaman utama
├── admin.html              # halaman admin (login token GitHub)
├── content.json            # konten yang diedit lewat admin
├── css/
│   ├── style.css
│   └── admin.css
├── js/
│   ├── config.js           # konfigurasi Sanity (opsional)
│   ├── content.js          # memuat content.json / Sanity
│   ├── script.js           # render situs + data cadangan
│   └── admin.js            # editor admin GitHub
├── assets/
│   ├── img/                # foto fallback
│   └── uploads/            # foto hasil upload admin
├── studio/                 # Sanity Studio (opsional, belum aktif)
├── server.js               # server lokal
└── README.md
```

## Menjalankan situs secara lokal

```bash
npm run dev
# atau: node server.js
# buka http://localhost:8123
```

Situs akan memuat `content.json`. Tanpa admin pun situs tetap tampil.

## Masuk ke admin

1. Buka `http://localhost:8123/admin.html` (lokal) atau
   `https://ilhamkresna21.github.io/e-porto-semester-2/admin.html` (online).
2. Buat **fine-grained personal access token** di GitHub:
   - Buka <https://github.com/settings/tokens?type=beta>.
   - **Generate new token** → nama `E-Portofolio Admin`.
   - Expiration: 90 hari.
   - Repository access: **Only select repositories** → `e-porto-semester-2`.
   - Permissions → **Contents: Read and write**.
   - Generate, salin token.
3. Tempel token di halaman admin, klik **Masuk & Muat Konten**.
4. Token disimpan hanya di `localStorage` browser. Klik **Hapus token** setelah
   selesai, terutama di komputer bersama.

> **Jangan pernah** menaruh token di dalam repository atau mengirimkannya ke
> orang lain. Admin hanya mengirim token ke `api.github.com`.

## Mengelola konten

| Tab | Isi |
|---|---|
| **Foto Situs** | Foto hero, profil, tujuan guru, inspirasi, refleksi, dan 4 foto daerah. |
| **Siklus** | Label, deskripsi, dan 6 artefak produk per siklus (RPP, media, hasil karya, dokumentasi, analisis, refleksi). |
| **LK 3** | Laporan LK 3 dan dokumen pendukung. |
| **Lampiran** | Dokumen penilaian, administrasi, dan kegiatan. |
| **Video** | Link YouTube/Google Drive, kategori, thumbnail opsional. |
| **Pengaturan** | Judul, deskripsi, dan tautan kontak. |

Setelah selesai mengedit, klik **Simpan ke GitHub**. Admin akan membuat commit
ke `content.json`; GitHub Pages memperbarui situs dalam 1–2 menit.

### Menautkan Google Drive

1. Unggah file ke Google Drive.
2. Klik **Share** → **Anyone with the link**.
3. Salin link:
   - File: `https://drive.google.com/file/d/ID_FILE/view`
   - Folder: `https://drive.google.com/drive/folders/ID_FOLDER`
4. Tempel di kolom **Link Google Drive** pada artefak/LK 3/lampiran.
5. Untuk video, tempel link file Drive atau YouTube di tab **Video**.

Dokumen file akan di-embed di modal. Link folder akan menampilkan tombol
“Buka Dokumen di Google Drive”.

### Mengunggah foto

- Format JPG/PNG/WebP. Foto otomatis dikompres ke lebar maksimal 1600 px.
- Isi **Teks alternatif** untuk aksesibilitas.
- Foto disimpan di `assets/uploads/` dan ikut ter-commit ke GitHub.
- Urutan foto dalam satu item bisa diubah dengan menghapus/mengunggah ulang
  (untuk saat ini belum ada drag-and-drop).

## Deploy ke GitHub Pages

1. Pastikan repository **publik** (GitHub Pages gratis untuk repo publik).
2. Buka **Settings → Pages**.
3. Source: **Deploy from a branch** → branch `main` → folder `/ (root)` → **Save**.
4. Situs tersedia di:
   `https://ilhamkresna21.github.io/e-porto-semester-2/`

Admin ada di:
`https://ilhamkresna21.github.io/e-porto-semester-2/admin.html`

> Jika repository tetap privat, gunakan Vercel atau GitHub Pro.

## Sanity Studio (opsional)

Folder `studio/` berisi schema Sanity untuk admin alternatif. Saat ini fitur
utama memakai admin GitHub, jadi Sanity **belum diaktifkan**. Untuk
mengaktifkannya:

1. Buat project Sanity.
2. Isi `studio/.env` dan `js/config.js`.
3. Impor `studio/seed.ndjson`.
4. Jalankan `npm run dev` di `studio/`.

Selama `js/config.js` masih kosong, situs memakai `content.json`.

## Catatan

- Data konten tersimpan di `content.json` dan riwayat perubahannya ada di commit
  GitHub.
- Foto upload tersimpan di `assets/uploads/`.
- Jangan menghapus `content.json` atau mengubah strukturnya secara manual tanpa
  memahami formatnya.
- Repository lama `tugas-ppg` tetap dibiarkan sebagai cadangan.
