import { defineField, defineType } from "sanity";

export const siteImages = defineType({
  name: "siteImages",
  title: "Foto Situs",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      title: "Foto Hero (Beranda)",
      type: "imageWithMeta",
    }),
    defineField({
      name: "profile",
      title: "Foto Profil",
      type: "imageWithMeta",
    }),
    defineField({
      name: "profileSecondary",
      title: "Foto Tujuan Menjadi Guru",
      type: "imageWithMeta",
    }),
    defineField({
      name: "inspiration",
      title: "Foto Inspirasi",
      type: "imageWithMeta",
    }),
    defineField({
      name: "reflection",
      title: "Foto Refleksi",
      type: "imageWithMeta",
    }),
    defineField({
      name: "region",
      title: "Foto Keunikan Daerah",
      type: "array",
      description:
        "Empat foto: Candi Sukuh, Grojogan Sewu, Sate Kelinci, dan Jadah Tempe.",
      of: [
        {
          type: "object",
          name: "regionImage",
          fields: [
            defineField({
              name: "key",
              title: "Kunci",
              type: "string",
              options: {
                list: [
                  { title: "Candi Sukuh", value: "candi-sukuh" },
                  { title: "Grojogan Sewu", value: "grojogan-sewu" },
                  { title: "Sate Kelinci", value: "sate-kelinci" },
                  { title: "Jadah Tempe", value: "jadah-tempe" },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "image",
              title: "Foto",
              type: "image",
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "alt",
              title: "Teks alternatif",
              type: "string",
              validation: (Rule) => Rule.required().min(3),
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
          preview: {
            select: { title: "key", subtitle: "alt", media: "image" },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Foto Situs" }),
  },
});
