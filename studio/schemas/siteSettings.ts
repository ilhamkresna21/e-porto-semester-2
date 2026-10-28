import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Pengaturan Situs",
  type: "document",
  fields: [
    defineField({
      name: "siteTitle",
      title: "Judul situs",
      type: "string",
      initialValue: "E-Portofolio Ilham Kresnamurti",
    }),
    defineField({
      name: "siteDescription",
      title: "Deskripsi situs",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "heroEyebrow",
      title: "Teks kecil di hero",
      type: "string",
      description: "Misalnya “PPG Calon Guru — Semester 2”.",
    }),
    defineField({
      name: "heroTitle",
      title: "Judul hero",
      type: "string",
    }),
    defineField({
      name: "heroRole",
      title: "Peran",
      type: "string",
      description: "Misalnya “Mahasiswa PPG CAGUR UMS 2026”.",
    }),
    defineField({
      name: "heroDescription",
      title: "Deskripsi hero",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "whatsapp",
      title: "Link WhatsApp",
      type: "url",
      description: "Contoh: https://wa.me/6281234567890",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "instagram",
      title: "Instagram",
      type: "url",
    }),
    defineField({
      name: "tiktok",
      title: "TikTok",
      type: "url",
    }),
    defineField({
      name: "address",
      title: "Alamat",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "footerText",
      title: "Teks footer",
      type: "string",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Pengaturan Situs" }),
  },
});
