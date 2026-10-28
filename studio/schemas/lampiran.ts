import { defineField, defineType } from "sanity";

export const lampiran = defineType({
  name: "lampiran",
  title: "Lampiran",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Judul",
      type: "string",
      initialValue: "Lampiran",
    }),
    defineField({
      name: "description",
      title: "Deskripsi",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "items",
      title: "Dokumen Lampiran",
      type: "array",
      of: [{ type: "documentItem" }],
      description:
        "Dokumen pendukung lain, misalnya sertifikat, surat tugas, atau administrasi PPG.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Lampiran" }),
  },
});
