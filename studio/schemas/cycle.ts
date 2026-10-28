import { defineField, defineType } from "sanity";

const defaultArtifacts = () => [
  {
    _key: "rpp",
    _type: "documentItem",
    icon: "📄",
    title: "Rencana Pelaksanaan Pembelajaran (RPP)",
    note: "Perangkat pembelajaran lengkap",
    description:
      "Rencana Pelaksanaan Pembelajaran berisi identitas sekolah, capaian pembelajaran, tujuan, materi ajar, tahapan kegiatan, penilaian, serta refleksi.",
    images: [],
  },
  {
    _key: "media",
    _type: "documentItem",
    icon: "🖥️",
    title: "Media Pembelajaran",
    note: "Media & sumber belajar digital",
    description:
      "Media dan sumber belajar yang digunakan dalam pembelajaran — slide presentasi, video interaktif, aplikasi simulasi, atau LKPD digital yang mendukung pemahaman murid terhadap materi.",
    images: [],
  },
  {
    _key: "hasil-karya",
    _type: "documentItem",
    icon: "✍️",
    title: "Contoh Hasil Kerja Murid",
    note: "Bukti capaian belajar peserta didik",
    description:
      "Kumpulan contoh hasil karya peserta didik sebagai bukti capaian pembelajaran, lengkap dengan umpan balik dan rubrik penilaian yang digunakan.",
    images: [],
  },
  {
    _key: "dokumentasi",
    _type: "documentItem",
    icon: "📸",
    title: "Foto / Video Pembelajaran",
    note: "Dokumentasi kegiatan di kelas",
    description:
      "Dokumentasi visual pelaksanaan pembelajaran di kelas: suasana kegiatan, interaksi guru–murid, serta aktivitas diskusi dan praktik peserta didik.",
    images: [],
  },
  {
    _key: "analisis",
    _type: "documentItem",
    icon: "📊",
    title: "Analisis Artefak Produk",
    note: "Analisis produk pembelajaran",
    description:
      "Analisis terhadap dokumen dan hasil pembelajaran: kekuatan, kelemahan, serta aspek yang perlu diperbaiki pada siklus berikutnya berdasarkan data dan observasi kelas.",
    images: [],
  },
  {
    _key: "refleksi",
    _type: "documentItem",
    icon: "🔍",
    title: "Refleksi Artefak Produk",
    note: "Refleksi proses pembelajaran",
    description:
      "Refleksi menyeluruh atas perencanaan, pelaksanaan, dan evaluasi pembelajaran pada siklus ini — menjadi dasar perbaikan mutu pembelajaran secara berkelanjutan.",
    images: [],
  },
];

export const cycle = defineType({
  name: "cycle",
  title: "Siklus",
  type: "document",
  fields: [
    defineField({
      name: "number",
      title: "Nomor siklus",
      type: "number",
      validation: (Rule) => Rule.required().integer().min(1).max(4),
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: "Teks tombol tab, misalnya “Siklus 1”.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "label", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Deskripsi siklus",
      type: "text",
      rows: 5,
      description: "Pengantar singkat yang tampil di atas daftar artefak.",
    }),
    defineField({
      name: "coverImage",
      title: "Foto cover",
      type: "imageWithMeta",
    }),
    defineField({
      name: "order",
      title: "Urutan",
      type: "number",
      initialValue: 1,
      validation: (Rule) => Rule.required().integer().min(1),
    }),
    defineField({
      name: "artifacts",
      title: "Artefak Produk",
      type: "array",
      of: [{ type: "documentItem" }],
      initialValue: defaultArtifacts,
      description:
        "Dokumen dan foto untuk siklus ini. Urutan bisa diubah dengan menarik kartu.",
    }),
  ],
  orderings: [
    {
      title: "Urutan siklus",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "label",
      subtitle: "description",
      media: "coverImage.image",
    },
  },
});
