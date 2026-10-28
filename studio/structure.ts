import type { StructureBuilder } from "sanity/structure";

const singleton = (S: StructureBuilder, type: string, title: string) =>
  S.listItem()
    .title(title)
    .child(S.document().schemaType(type).documentId(type));

export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Konten E-Portofolio")
    .items([
      singleton(S, "siteSettings", "Pengaturan Situs"),
      singleton(S, "siteImages", "Foto Situs"),
      S.divider(),
      S.listItem()
        .title("Siklus 1–4")
        .child(S.documentTypeList("cycle").title("Siklus")),
      singleton(S, "lk3", "LK 3"),
      singleton(S, "lampiran", "Lampiran"),
      singleton(S, "videoGallery", "Galeri Video"),
    ]);
