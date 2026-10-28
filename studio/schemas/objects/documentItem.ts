import { defineField, defineType } from "sanity";

export const documentItem = defineType({
  name: "documentItem",
  title: "Dokumen",
  type: "object",
  fields: [
    defineField({
      name: "icon",
      title: "Ikon",
      type: "string",
      initialValue: "📄",
      description: "Emoji ikon, misalnya 📄 🖥️ ✍️ 📸 📊 🔍.",
    }),
    defineField({
      name: "title",
      title: "Judul",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "note",
      title: "Catatan singkat",
      type: "string",
      description:
        "Tampil di bawah judul, misalnya “Perangkat pembelajaran lengkap”.",
    }),
    defineField({
      name: "description",
      title: "Deskripsi",
      type: "text",
      rows: 4,
      description: "Penjelasan dokumen yang tampil di dalam modal.",
    }),
    defineField({
      name: "driveUrl",
      title: "Link Google Drive",
      type: "url",
      description:
        "Tempel link file atau folder Google Drive. Pastikan aksesnya “Anyone with the link”.",
    }),
    defineField({
      name: "images",
      title: "Foto pendukung",
      type: "array",
      of: [{ type: "imageWithMeta" }],
      description: "Foto kegiatan atau cuplikan dokumen (opsional).",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "note",
      media: "images.0.image",
    },
  },
});
