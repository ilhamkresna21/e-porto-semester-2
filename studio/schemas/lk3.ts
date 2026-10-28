import { defineField, defineType } from "sanity";

export const lk3 = defineType({
  name: "lk3",
  title: "LK 3",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Judul",
      type: "string",
      initialValue: "Lembar Kerja 3",
    }),
    defineField({
      name: "description",
      title: "Deskripsi",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "items",
      title: "Dokumen LK 3",
      type: "array",
      of: [{ type: "documentItem" }],
      description:
        "Laporan LK 3 dan dokumen pendukungnya. Urutan bisa diubah dengan menarik kartu.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "LK 3" }),
  },
});
