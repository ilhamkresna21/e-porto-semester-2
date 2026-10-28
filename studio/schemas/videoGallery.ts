import { defineField, defineType } from "sanity";

export const videoGallery = defineType({
  name: "videoGallery",
  title: "Galeri Video",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Judul bagian",
      type: "string",
      initialValue: "Video Mengajar",
    }),
    defineField({
      name: "description",
      title: "Deskripsi bagian",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "items",
      title: "Daftar video",
      type: "array",
      of: [
        {
          type: "object",
          name: "videoItem",
          fields: [
            defineField({
              name: "title",
              title: "Judul video",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              title: "Deskripsi",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "url",
              title: "Link video",
              type: "url",
              description:
                "Link YouTube atau Google Drive. Untuk Drive, pastikan akses “Anyone with the link”.",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "category",
              title: "Kategori",
              type: "string",
              options: {
                list: [
                  { title: "Praktik Mengajar", value: "Praktik Mengajar" },
                  {
                    title: "Proyek Kepemimpinan",
                    value: "Proyek Kepemimpinan",
                  },
                  { title: "Kegiatan Sekolah", value: "Kegiatan Sekolah" },
                  { title: "Seminar / Presentasi", value: "Seminar" },
                  { title: "Lainnya", value: "Lainnya" },
                ],
              },
            }),
            defineField({
              name: "cycle",
              title: "Terkait siklus",
              type: "string",
              description: "Misalnya “Siklus 1” (opsional).",
            }),
            defineField({
              name: "poster",
              title: "Thumbnail",
              type: "image",
              options: { hotspot: true },
              description:
                "Opsional. Untuk Google Drive, thumbnail otomatis diambil dari file.",
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "category", media: "poster" },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Galeri Video" }),
  },
});
