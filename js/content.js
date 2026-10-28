/* ============================================================
   Pengambil konten dari Sanity
   ------------------------------------------------------------
   Kalau window.EPORTO_CONFIG.sanityProjectId masih kosong,
   fungsi loadContent() mengembalikan null dan situs memakai
   data cadangan yang ada di js/script.js.
   ============================================================ */
(function () {
  "use strict";

  const config = window.EPORTO_CONFIG || {};
  const projectId = String(config.sanityProjectId || "").trim();
  const dataset = config.sanityDataset || "production";
  const apiVersion = config.sanityApiVersion || "2025-02-19";

  const QUERY = `{
    "settings": *[_type == "siteSettings"][0],
    "images": *[_type == "siteImages"][0]{
      hero{..., "url": image.asset->url},
      profile{..., "url": image.asset->url},
      profileSecondary{..., "url": image.asset->url},
      inspiration{..., "url": image.asset->url},
      reflection{..., "url": image.asset->url},
      region[]{
        key,
        "url": image.asset->url,
        alt,
        caption
      }
    },
    "cycles": *[_type == "cycle"] | order(order asc, number asc){
      _id,
      number,
      label,
      "slug": slug.current,
      description,
      "cover": coverImage{..., "url": image.asset->url},
      artifacts[]{
        icon,
        title,
        note,
        description,
        driveUrl,
        images[]{"url": image.asset->url, alt, caption}
      }
    },
    "videos": *[_type == "videoGallery"][0].items[]{
      title,
      description,
      url,
      category,
      cycle,
      "poster": poster{..., "url": image.asset->url}
    },
    "lk3": *[_type == "lk3"][0]{
      title,
      description,
      items[]{
        icon,
        title,
        note,
        description,
        driveUrl,
        images[]{"url": image.asset->url, alt, caption}
      }
    },
    "lampiran": *[_type == "lampiran"][0]{
      title,
      description,
      items[]{
        icon,
        title,
        note,
        description,
        driveUrl,
        images[]{"url": image.asset->url, alt, caption}
      }
    }
  }`;

  function driveIdFromUrl(url) {
    if (!url) return "";
    const value = String(url);
    const match =
      value.match(/\/file\/d\/([\w-]{10,})/) ||
      value.match(/[?&]id=([\w-]{10,})/) ||
      value.match(/\/d\/([\w-]{10,})/);
    return match ? match[1] : "";
  }

  function normalizeImage(image) {
    if (!image) return null;
    if (typeof image === "string") {
      return image ? { url: image, alt: "", caption: "" } : null;
    }
    return {
      url: image.url || "",
      alt: image.alt || "",
      caption: image.caption || "",
    };
  }

  function normalizeImages(images) {
    return (images || [])
      .map(normalizeImage)
      .filter((image) => image && image.url);
  }

  function normalizeDocumentItem(item) {
    if (!item) return null;
    const driveUrl = item.driveUrl || "";
    return {
      icon: item.icon || "📄",
      title: item.title || "Dokumen",
      note: item.note || "",
      desc: item.description || item.desc || "",
      driveUrl,
      driveId: driveIdFromUrl(driveUrl),
      images: normalizeImages(item.images),
    };
  }

  function normalizeCycle(cycle, index) {
    const number = Number(cycle.number) || index + 1;
    const key = cycle.slug || `siklus-${number}`;
    return {
      key,
      number,
      label: cycle.label || `Siklus ${number}`,
      desc: cycle.description || "",
      cover: normalizeImage(cycle.cover),
      artifacts: (cycle.artifacts || [])
        .map(normalizeDocumentItem)
        .filter(Boolean),
    };
  }

  function normalizeData(result) {
    if (!result) return null;

    const images = {};
    const rawImages = result.images || {};
    ["hero", "profile", "profileSecondary", "inspiration", "reflection"].forEach(
      (key) => {
        const image = normalizeImage(rawImages[key]);
        if (image && image.url) images[key] = image;
      }
    );

    (rawImages.region || []).forEach((region) => {
      const image = normalizeImage(region);
      if (image && image.url && region.key) {
        images[region.key] = { ...image, alt: region.alt || image.alt };
      }
    });

    const cycles = {};
    (result.cycles || []).forEach((cycle, index) => {
      const normalized = normalizeCycle(cycle, index);
      cycles[normalized.key] = normalized;
    });

    const videos = (result.videos || [])
      .map((video) => ({
        title: video.title || "Video Mengajar",
        desc: video.description || "",
        url: video.url || "",
        category: video.category || "",
        cycle: video.cycle || "",
        poster: normalizeImage(video.poster),
      }))
      .filter((video) => video.url);

    return {
      settings: result.settings || null,
      images,
      cycles,
      videos,
      lk3: result.lk3
        ? {
            title: result.lk3.title || "Lembar Kerja 3",
            description: result.lk3.description || "",
            items: (result.lk3.items || [])
              .map(normalizeDocumentItem)
              .filter(Boolean),
          }
        : null,
      lampiran: result.lampiran
        ? {
            title: result.lampiran.title || "Lampiran",
            description: result.lampiran.description || "",
            items: (result.lampiran.items || [])
              .map(normalizeDocumentItem)
              .filter(Boolean),
          }
        : null,
    };
  }

  async function loadContent() {
    if (!projectId) return null;

    const endpoint =
      `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}` +
      `?query=${encodeURIComponent(QUERY)}`;

    const response = await fetch(endpoint, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Sanity API ${response.status} ${response.statusText}`);
    }

    const payload = await response.json();
    return normalizeData(payload.result);
  }

  window.EPORTO_CONTENT = {
    loadContent,
    normalizeData,
    driveIdFromUrl,
  };
})();
