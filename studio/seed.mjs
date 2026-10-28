/*
 * Membuat seed.ndjson untuk mengisi konten awal Sanity.
 * Jalankan dari folder studio:
 *   node seed.mjs
 * Lalu impor:
 *   npx sanity dataset import seed.ndjson production
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const artifact = (key, icon, title, note, description) => ({
  _key: key,
  _type: "documentItem",
  icon,
  title,
  note,
  description,
  driveUrl: "",
  images: [],
});

const defaultArtifacts = () => [
  artifact(
    "rpp",
    "📄",
    "Rencana Pelaksanaan Pembelajaran (RPP)",
    "Perangkat pembelajaran lengkap",
    "Rencana Pelaksanaan Pembelajaran berisi identitas sekolah, capaian pembelajaran, tujuan pembelajaran, materi ajar, tahapan kegiatan (pendahuluan, inti, penutup), penilaian, serta refleksi pembelajaran."
  ),
  artifact(
    "media",
    "🖥️",
    "Media Pembelajaran",
    "Media & sumber belajar digital",
    "Media dan sumber belajar yang digunakan dalam pembelajaran — slide presentasi, video interaktif, aplikasi simulasi, atau LKPD digital yang mendukung pemahaman murid terhadap materi."
  ),
  artifact(
    "hasil-karya",
    "✍️",
    "Contoh Hasil Kerja Murid",
    "Bukti capaian belajar peserta didik",
    "Kumpulan contoh hasil karya peserta didik sebagai bukti capaian pembelajaran, lengkap dengan umpan balik dan rubrik penilaian yang digunakan."
  ),
  artifact(
    "dokumentasi",
    "📸",
    "Foto / Video Pembelajaran",
    "Dokumentasi kegiatan di kelas",
    "Dokumentasi visual pelaksanaan pembelajaran di kelas: suasana kegiatan, interaksi guru–murid, serta aktivitas diskusi dan praktik peserta didik."
  ),
  artifact(
    "analisis",
    "📊",
    "Analisis Artefak Produk",
    "Analisis produk pembelajaran",
    "Analisis terhadap dokumen dan hasil pembelajaran: kekuatan, kelemahan, serta aspek yang perlu diperbaiki pada siklus berikutnya berdasarkan data dan observasi kelas."
  ),
  artifact(
    "refleksi",
    "🔍",
    "Refleksi Artefak Produk",
    "Refleksi proses pembelajaran",
    "Refleksi menyeluruh atas perencanaan, pelaksanaan, dan evaluasi pembelajaran pada siklus ini — menjadi dasar perbaikan mutu pembelajaran secara berkelanjutan."
  ),
];

const cycleDescriptions = {
  1: "Pada Siklus 1 ini terdapat beberapa artefak produk sebagai bagian dari dokumentasi proses pembelajaran: RPP, media pembelajaran, contoh hasil kerja murid, foto/video kegiatan pembelajaran, analisis produk, serta refleksi terhadap proses pembelajaran. Setiap bagian disusun untuk memberikan gambaran yang utuh mengenai perencanaan, pelaksanaan, hingga evaluasi pembelajaran yang telah dilakukan.",
  2: "Bagian Siklus 2 memuat dan mengulas berbagai artefak produk sebagai bentuk rekam jejak proses pembelajaran. Ragam instrumen yang ditampilkan meliputi RPP, media instruksional, lembar kerja hasil murid, rekaman visual kegiatan, analisis produk, dan refleksi pembelajaran. Melalui penyajian komparatif ini, diharapkan pembaca dapat melihat benang merah yang kuat antara desain kurikulum dengan realitas pembelajaran serta kompetensi yang berhasil diraih murid.",
  3: "Siklus 3 menjadi penutup dari rangkaian penyusunan artefak produk pembelajaran. Dokumen pada siklus ini menampilkan hasil perbaikan dari siklus sebelumnya, mulai dari RPP, media pembelajaran, hasil kerja murid, dokumentasi kegiatan, analisis, hingga refleksi akhir — sebagai bukti peningkatan mutu pembelajaran secara berkelanjutan.",
  4: "Siklus 4 merupakan kelanjutan dari siklus-siklus sebelumnya sebagai wujud perbaikan dan pemantapan mutu pembelajaran. Artefak pada siklus ini memuat RPP hasil peninjauan, media pembelajaran yang telah disempurnakan, contoh hasil kerja murid terbaru, dokumentasi kegiatan, analisis produk, serta refleksi akhir — menegaskan komitmen saya dalam menerapkan pembelajaran yang berpusat pada murid secara berkesinambungan.",
};

const docs = [
  {
    _id: "siteSettings",
    _type: "siteSettings",
    siteTitle: "E-Portofolio Ilham Kresnamurti",
    siteDescription:
      "E-Portofolio PPG Calon Guru Semester 2 — Ilham Kresnamurti, S.Kom., PPG CAGUR UMS 2026.",
    heroEyebrow: "PPG Calon Guru — Semester 2",
    heroTitle: "Ilham Kresnamurti, S.Kom.",
    heroRole: "Mahasiswa PPG CAGUR UMS 2026",
    heroDescription:
      "Ruang dokumentasi perjalanan saya sebagai calon guru: perangkat pembelajaran, praktik mengajar, refleksi, dan karya murid.",
    whatsapp: "https://wa.me/62895415845020",
    email: "ilhammurti163@gmail.com",
    instagram: "https://www.instagram.com/krsnailh",
    tiktok: "https://www.tiktok.com/@movitt11",
    address: "Surakarta, Jawa Tengah",
    footerText:
      "E-Portofolio PPG Calon Guru Semester 2 — Ilham Kresnamurti, S.Kom.",
  },
  {
    _id: "siteImages",
    _type: "siteImages",
    region: [],
  },
  ...[1, 2, 3, 4].map((number) => ({
    _id: `cycle-${number}`,
    _type: "cycle",
    number,
    label: `Siklus ${number}`,
    slug: { _type: "slug", current: `siklus-${number}` },
    description: cycleDescriptions[number],
    order: number,
    artifacts: defaultArtifacts(),
  })),
  {
    _id: "lk3",
    _type: "lk3",
    title: "Lembar Kerja 3",
    description:
      "Laporan kegiatan non-mengajar beserta dokumen pendukungnya.",
    items: [
      artifact(
        "lk3-laporan",
        "📄",
        "Laporan Lembar Kerja 3 (Non-Mengajar)",
        "Dokumen utama",
        "Laporan lengkap kegiatan non-mengajar: identitas peserta didik, latar belakang, tujuan, tahapan pelaksanaan kegiatan non-mengajar, hasil yang dicapai, hingga evaluasi dan tindak lanjut."
      ),
      artifact(
        "lk3-pendukung",
        "📎",
        "Dokumen Pendukung",
        "Lampiran laporan",
        "Dokumen pendukung laporan kegiatan non-mengajar — lembar observasi, jadwal kegiatan, hasil karya, atau berkas pendukung lainnya."
      ),
    ],
  },
  {
    _id: "lampiran",
    _type: "lampiran",
    title: "Lampiran",
    description:
      "Dokumen pendukung administrasi dan penilaian selama program PPG.",
    items: [
      artifact(
        "lampiran-perangkat",
        "📋",
        "Penilaian Penyusunan Perangkat Pembelajaran",
        "Lampiran",
        "Dokumen penilaian hasil penyusunan perangkat pembelajaran — skor, catatan pemeriksa, serta umpan balik untuk penyempurnaan RPP dan media pembelajaran."
      ),
      artifact(
        "lampiran-praktik",
        "🎤",
        "Penilaian Praktik Mengajar",
        "Lampiran",
        "Hasil penilaian praktik mengajar selama program PPG — rubrik penilaian, skor tiap aspek, serta catatan pembimbing mengenai kinerja di ruang kelas."
      ),
      artifact(
        "lampiran-foto",
        "📸",
        "Foto / Video Kegiatan",
        "Lampiran",
        "Dokumentasi visual kegiatan pembelajaran dan praktik lapangan: suasana kelas, interaksi guru–murid, serta rangkaian kegiatan PPG."
      ),
    ],
  },
  {
    _id: "videoGallery",
    _type: "videoGallery",
    title: "Video Mengajar",
    description:
      "Rekaman praktik mengajar dan kegiatan pendukung selama program PPG.",
    items: [],
  },
];

const output = resolve("seed.ndjson");
writeFileSync(output, docs.map((doc) => JSON.stringify(doc)).join("\n") + "\n", "utf8");
console.log(`Menulis ${docs.length} dokumen ke ${output}`);
