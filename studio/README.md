# Panduan Admin — E-Portofolio Ilham

Studio ini dipakai untuk mengubah isi situs tanpa mengedit kode.

## 1. Masuk

1. Buka URL Studio: `https://e-porto-ilham.sanity.studio`
2. Klik **Sign in with GitHub** (atau provider lain yang dipakai saat membuat project).
3. Pilih project **E-Portofolio Ilham**.

Saat menjalankan lokal:

```bash
npm install
copy .env.example .env
# isi SANITY_STUDIO_PROJECT_ID
npm run dev
```

## 2. Bagian yang bisa diedit

### Pengaturan Situs
Judul, deskripsi, teks hero, kontak (WhatsApp, email, Instagram, TikTok), alamat,
dan teks footer. Klik **Publish** setelah selesai.

### Foto Situs
- **Foto Hero** — gambar besar di beranda.
- **Foto Profil** — foto di bagian “Tentang Saya”.
- **Foto Tujuan Menjadi Guru** — kartu tujuan.
- **Foto Inspirasi** — kartu inspirasi.
- **Foto Refleksi** — header bagian refleksi.
- **Foto Keunikan Daerah** — empat foto: Candi Sukuh, Grojogan Sewu, Sate Kelinci,
  Jadah Tempe. Pilih kunci yang sesuai.

Untuk setiap foto:
1. Klik field foto → **Upload**.
2. Isi **Teks alternatif** (wajib).
3. Isi **Caption** bila perlu.
4. Atur titik fokus bila foto perlu di-crop.
5. Klik **Publish**.

### Siklus 1–4
Setiap siklus punya:
- Nomor, label, slug, urutan.
- Deskripsi siklus.
- Foto cover (opsional).
- **Artefak Produk**: RPP, media, hasil karya murid, dokumentasi, analisis,
  refleksi.

Untuk menautkan dokumen:
1. Buka siklus → klik salah satu artefak.
2. Tempel link Google Drive di **Link Google Drive**.
3. Unggah **Foto pendukung** bila ada.
4. Klik **Publish**.

Urutan artefak bisa diubah dengan menarik kartu. Untuk menambah artefak baru,
klik **Add item** di bagian bawah daftar.

### LK 3
Berisi laporan LK 3 dan dokumen pendukung. Caranya sama seperti artefak:
tempel link Drive, unggah foto, lalu **Publish**.

### Lampiran
Dokumen penilaian, administrasi, dan kegiatan. Sama seperti LK 3.

### Galeri Video
1. Klik **Add item**.
2. Isi judul, deskripsi, dan link video.
3. Pilih kategori (opsional).
4. Isi “Terkait siklus” bila video berhubungan dengan siklus tertentu.
5. Unggah thumbnail bila ingin tampilan khusus. Jika tidak, YouTube/Drive
   akan memakai thumbnail otomatis.
6. Klik **Publish**.

## 3. Aturan link Google Drive

- File harus bisa diakses **Anyone with the link**.
- Link file: `https://drive.google.com/file/d/ID_FILE/view`
- Link folder: `https://drive.google.com/drive/folders/ID_FOLDER`
- Link video: sama seperti file; video akan diputar di modal situs.
- Jika link folder, situs menampilkan tombol “Buka Dokumen di Google Drive”.

## 4. Tips foto

- Format JPG/PNG/WebP.
- Lebar 1200–1600 px, ukuran di bawah 2 MB.
- Jangan gunakan foto yang terlalu gelap atau terpotong.
- Isi teks alternatif agar situs ramah aksesibilitas.

## 5. Publikasi

Sanity menyimpan dua versi: **draft** dan **published**. Perubahan hanya tampil di
situs setelah klik **Publish**. Jika lupa, buka dokumen dan klik **Publish** lagi.

## 6. Backup

Lakukan export dataset secara berkala:
**Sanity Dashboard → project → Datasets → Export**.

Jangan menghapus atau mengganti ID dokumen berikut:
`siteSettings`, `siteImages`, `lk3`, `lampiran`, `videoGallery`.
