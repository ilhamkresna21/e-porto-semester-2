import { defineField, defineType } from "sanity";

export const imageWithMeta = defineType({
  name: "imageWithMeta",
  title: "Foto",
  type: "object",
  fields: [
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
      description:
        "Deskripsi singkat isi foto untuk pembaca layar dan mesin pencari.",
      validation: (Rule) => Rule.required().min(3),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Keterangan kecil di bawah foto (opsional).",
    }),
  ],
  preview: {
    select: {
      title: "alt",
      subtitle: "caption",
      media: "image",
    },
  },
});
