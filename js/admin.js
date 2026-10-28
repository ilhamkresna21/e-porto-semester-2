/* ============================================================
   Admin E-Portofolio — editor konten berbasis GitHub
   ------------------------------------------------------------
   Token GitHub disimpan hanya di localStorage browser.
   Tidak ada token yang ditulis ke repository.
   ============================================================ */
"use strict";

const API = "https://api.github.com";
const TOKEN_KEY = "eporto_github_token";
const REPO_KEY = "eporto_github_repo";
const BRANCH_KEY = "eporto_github_branch";
const DEFAULT_REPO = "ilhamkresna21/e-porto-semester-2";
const DEFAULT_BRANCH = "main";

const IMAGE_FIELDS = [
  { key: "hero", label: "Foto Hero (Beranda)" },
  { key: "profile", label: "Foto Profil" },
  { key: "profileSecondary", label: "Foto Tujuan Menjadi Guru" },
  { key: "inspiration", label: "Foto Inspirasi" },
  { key: "reflection", label: "Foto Refleksi" },
  { key: "candi-sukuh", label: "Candi Sukuh" },
  { key: "grojogan-sewu", label: "Grojogan Sewu" },
  { key: "sate-kelinci", label: "Sate Kelinci" },
  { key: "jadah-tempe", label: "Jadah Tempe" },
];

const VIDEO_CATEGORIES = [
  "Praktik Mengajar",
  "Proyek Kepemimpinan",
  "Kegiatan Sekolah",
  "Seminar",
  "Lainnya",
];

let token = "";
let repo = DEFAULT_REPO;
let branch = DEFAULT_BRANCH;
let contentSha = "";
let state = null;
let dirty = false;
let saveBusy = false;
let loginBusy = false;
let selectedCycle = 0;
let openArtifact = 0;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) =>
  Array.from(root.querySelectorAll(selector));

/* ---------- Util ---------- */

function escapeHtml(value) {
  return String(value == null ? "" : value).replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#039;";
      default:
        return char;
    }
  });
}

function slugify(value) {
  return String(value || "foto")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .slice(0, 48) || "foto";
}

function encodePath(path) {
  return String(path)
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
}

function previewUrl(url) {
  if (!url) return "";
  if (url.startsWith("assets/uploads/")) {
    return `https://raw.githubusercontent.com/${repo}/${branch}/${url}`;
  }
  return url;
}

function getByPath(object, path) {
  return String(path)
    .split(".")
    .reduce(
      (value, key) => (value == null ? undefined : value[key]),
      object
    );
}

function setByPath(object, path, value) {
  const keys = String(path).split(".");
  let target = object;
  for (let index = 0; index < keys.length - 1; index += 1) {
    const key = keys[index];
    if (target[key] == null) {
      target[key] = /^\d+$/.test(keys[index + 1]) ? [] : {};
    }
    target = target[key];
  }
  target[keys[keys.length - 1]] = value;
}

function moveItem(array, index, delta) {
  const next = index + delta;
  if (!Array.isArray(array) || next < 0 || next >= array.length) return;
  const [item] = array.splice(index, 1);
  array.splice(next, 0, item);
}

function utf8ToBase64(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode.apply(
      null,
      bytes.subarray(index, index + chunkSize)
    );
  }
  return btoa(binary);
}

function base64ToUtf8(value) {
  const binary = atob(String(value || "").replace(/\s/g, ""));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/* ---------- GitHub API ---------- */

async function gh(path, options = {}) {
  if (!token) throw new Error("Token GitHub belum diisi.");

  const response = await fetch(API + path, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (error) {
    data = { message: text };
  }

  if (!response.ok) {
    const message =
      data && data.message
        ? data.message
        : `GitHub API ${response.status} ${response.statusText}`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
}

/* ---------- Status & toast ---------- */

let toastTimer = null;

function toast(message) {
  const element = $("#toast");
  if (!element) return;
  element.textContent = message;
  element.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove("show"), 4000);
}

function setStatus(message, type = "") {
  const element = $("#saveStatus");
  if (!element) return;
  element.textContent = message;
  element.className = "admin-status" + (type ? ` is-${type}` : "");
}

function setLoginStatus(message, type = "") {
  const element = $("#loginStatus");
  if (!element) return;
  element.textContent = message;
  element.className = "admin-status" + (type ? ` is-${type}` : "");
}

function updateSaveButton() {
  const button = $("#saveBtn");
  if (!button) return;
  button.disabled = saveBusy || !dirty;
  button.textContent = saveBusy ? "Menyimpan..." : "Simpan ke GitHub";
}

function markDirty() {
  dirty = true;
  setStatus("Ada perubahan belum disimpan.");
  updateSaveButton();
}

/* ---------- State ---------- */

function newArtifact() {
  return {
    icon: "📄",
    title: "Artefak Baru",
    note: "",
    description: "",
    driveUrl: "",
    images: [],
  };
}

function newVideo() {
  return {
    title: "Video Baru",
    description: "",
    url: "",
    category: "Praktik Mengajar",
    cycle: "",
    poster: null,
  };
}

function normalizeState() {
  state = state || {};
  state.settings = state.settings || {};
  state.images = state.images || {};
  state.cycles = Array.isArray(state.cycles) ? state.cycles : [];
  state.videos = Array.isArray(state.videos) ? state.videos : [];
  state.lk3 = state.lk3 || { title: "LK 3", description: "", items: [] };
  state.lampiran = state.lampiran || {
    title: "Lampiran",
    description: "",
    items: [],
  };
  state.lk3.items = Array.isArray(state.lk3.items) ? state.lk3.items : [];
  state.lampiran.items = Array.isArray(state.lampiran.items)
    ? state.lampiran.items
    : [];

  IMAGE_FIELDS.forEach(({ key }) => {
    const image = state.images[key];
    if (!image) {
      state.images[key] = { url: "", alt: "", caption: "" };
    } else if (typeof image === "string") {
      state.images[key] = { url: image, alt: "", caption: "" };
    }
  });

  state.cycles.forEach((cycle, index) => {
    cycle.number = cycle.number || index + 1;
    cycle.label = cycle.label || `Siklus ${index + 1}`;
    cycle.slug = cycle.slug || `siklus-${index + 1}`;
    cycle.artifacts = Array.isArray(cycle.artifacts) ? cycle.artifacts : [];
    cycle.artifacts.forEach((item) => {
      item.icon = item.icon || "📄";
      item.title = item.title || "Artefak";
      item.images = Array.isArray(item.images) ? item.images : [];
    });
  });

  state.videos.forEach((video) => {
    video.title = video.title || "Video";
  });

  [state.lk3, state.lampiran].forEach((doc) => {
    doc.items.forEach((item) => {
      item.icon = item.icon || "📄";
      item.title = item.title || "Dokumen";
      item.images = Array.isArray(item.images) ? item.images : [];
    });
  });

  selectedCycle = Math.min(
    Math.max(0, selectedCycle),
    Math.max(0, state.cycles.length - 1)
  );
  openArtifact = Math.min(
    Math.max(0, openArtifact),
    Math.max(0, (state.cycles[selectedCycle]?.artifacts || []).length - 1)
  );
}

/* ---------- Load / save ---------- */

async function loadContent() {
  setStatus("Memuat content.json dari GitHub...");
  const data = await gh(
    `/repos/${repo}/contents/content.json?ref=${encodeURIComponent(branch)}`
  );
  if (!data || !data.content) {
    throw new Error("content.json tidak ditemukan atau terlalu besar.");
  }
  contentSha = data.sha;
  state = JSON.parse(base64ToUtf8(data.content));
  normalizeState();
  dirty = false;
  renderAll();
  showEditor();
  setStatus("Konten dimuat. Edit lalu klik Simpan ke GitHub.", "ok");
  updateSaveButton();
}

async function saveContent() {
  if (!state || saveBusy) return;
  if (!dirty) {
    toast("Tidak ada perubahan untuk disimpan.");
    return;
  }

  saveBusy = true;
  updateSaveButton();
  setStatus("Menyimpan ke GitHub...");

  try {
    const payload = {
      message: "Update konten e-portofolio",
      content: utf8ToBase64(JSON.stringify(state, null, 2) + "\n"),
      branch,
    };
    if (contentSha) payload.sha = contentSha;

    const response = await gh(
      `/repos/${repo}/contents/content.json`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );

    contentSha = response.content.sha;
    dirty = false;
    setStatus(
      "Tersimpan. GitHub Pages memperbarui situs dalam 1–2 menit.",
      "ok"
    );
    toast("Konten berhasil disimpan.");
  } catch (error) {
    if (error.status === 409) {
      setStatus(
        "Konten di GitHub sudah berubah. Klik Muat ulang, lalu ulangi perubahan.",
        "error"
      );
    } else {
      setStatus("Gagal menyimpan: " + error.message, "error");
    }
    toast("Gagal menyimpan: " + error.message);
  } finally {
    saveBusy = false;
    updateSaveButton();
  }
}

/* ---------- Rendering ---------- */

function renderAll() {
  renderImages();
  renderCycles();
  renderLk3();
  renderLampiran();
  renderVideos();
  renderSettings();
  updateSaveButton();
}

function renderImages() {
  const host = $("#sectionImages");
  if (!host || !state) return;

  host.innerHTML = `
    <div class="admin-section-head">
      <div>
        <h2>Foto Situs</h2>
        <p>Ganti foto utama, foto profil, dan foto keunikan daerah. Isi teks alternatif agar situs ramah aksesibilitas.</p>
      </div>
    </div>
    <div class="admin-image-grid">
      ${IMAGE_FIELDS.map(({ key, label }) => {
        const image = state.images[key] || {};
        return `
          <div class="admin-image-card">
            <div class="admin-image-card__preview">
              ${
                image.url
                  ? `<img src="${escapeHtml(previewUrl(image.url))}" alt="">`
                  : `<div class="admin-empty">Belum ada foto</div>`
              }
            </div>
            <h3>${escapeHtml(label)}</h3>
            <input class="admin-file" type="file" accept="image/*"
              data-upload-target="images.${key}"
              data-upload-label="${escapeHtml(label)}">
            <div class="admin-field">
              <label>Teks alternatif</label>
              <input data-path="images.${key}.alt" value="${escapeHtml(
                image.alt || ""
              )}">
            </div>
            <div class="admin-field">
              <label>Caption</label>
              <input data-path="images.${key}.caption" value="${escapeHtml(
                image.caption || ""
              )}">
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderCycles() {
  const host = $("#sectionCycles");
  if (!host || !state) return;

  const cycles = state.cycles || [];
  if (!cycles.length) {
    host.innerHTML = `<div class="admin-empty">Belum ada siklus. Konten awal seharusnya berisi 4 siklus.</div>`;
    return;
  }

  if (selectedCycle >= cycles.length) selectedCycle = 0;
  const cycle = cycles[selectedCycle];
  const artifacts = cycle.artifacts || [];
  if (openArtifact >= artifacts.length) {
    openArtifact = Math.max(0, artifacts.length - 1);
  }

  host.innerHTML = `
    <div class="admin-section-head">
      <div>
        <h2>Siklus</h2>
        <p>Kelola deskripsi siklus dan artefak produk. Setiap artefak bisa diisi link Google Drive dan foto pendukung.</p>
      </div>
    </div>

    <div class="admin-subtabs">
      ${cycles
        .map(
          (item, index) => `
            <button type="button" data-action="select-cycle" data-index="${index}"
              class="${index === selectedCycle ? "active" : ""}">
              ${escapeHtml(item.label || `Siklus ${index + 1}`)}
            </button>
          `
        )
        .join("")}
    </div>

    <div class="admin-card" style="margin-bottom:18px">
      <div class="admin-field">
        <label>Label siklus</label>
        <input data-path="cycles.${selectedCycle}.label" value="${escapeHtml(
          cycle.label || ""
        )}">
      </div>
      <div class="admin-field">
        <label>Deskripsi siklus</label>
        <textarea data-path="cycles.${selectedCycle}.description" rows="4">${escapeHtml(
          cycle.description || ""
        )}</textarea>
      </div>
    </div>

    <div class="admin-section-head">
      <div>
        <h3>Artefak Produk</h3>
        <p>Urutan bisa diubah dengan tombol panah. Klik Simpan setelah selesai.</p>
      </div>
      <button type="button" class="btn btn--ghost btn--small" data-action="add-artifact">+ Tambah artefak</button>
    </div>

    <div class="admin-card-list">
      ${
        artifacts.length
          ? artifacts
              .map((item, index) =>
                renderDocItem(
                  item,
                  index,
                  `cycles.${selectedCycle}.artifacts`,
                  "artifact",
                  index === openArtifact
                )
              )
              .join("")
          : `<div class="admin-empty">Belum ada artefak untuk siklus ini.</div>`
      }
    </div>
  `;
}

function renderDocItem(item, index, base, prefix, open) {
  const basePath = `${base}.${index}`;
  return `
    <details class="admin-item" ${open ? "open" : ""}>
      <summary>
        ${escapeHtml(item.icon || "📄")} ${escapeHtml(item.title || "Dokumen")}
        <span class="admin-item__meta">
          <button type="button" class="admin-icon-btn" data-action="move-${prefix}-up" data-index="${index}" title="Naik">↑</button>
          <button type="button" class="admin-icon-btn" data-action="move-${prefix}-down" data-index="${index}" title="Turun">↓</button>
          <button type="button" class="admin-icon-btn is-danger" data-action="remove-${prefix}" data-index="${index}">Hapus</button>
        </span>
      </summary>
      <div class="admin-item__body">
        <div class="admin-field-row">
          <div class="admin-field">
            <label>Ikon</label>
            <input data-path="${basePath}.icon" value="${escapeHtml(
              item.icon || "📄"
            )}" maxlength="4">
          </div>
          <div class="admin-field">
            <label>Judul</label>
            <input data-path="${basePath}.title" value="${escapeHtml(
              item.title || ""
            )}">
          </div>
        </div>
        <div class="admin-field">
          <label>Catatan singkat</label>
          <input data-path="${basePath}.note" value="${escapeHtml(
            item.note || ""
          )}">
        </div>
        <div class="admin-field">
          <label>Deskripsi</label>
          <textarea data-path="${basePath}.description" rows="3">${escapeHtml(
            item.description || ""
          )}</textarea>
        </div>
        <div class="admin-field">
          <label>Link Google Drive</label>
          <input data-path="${basePath}.driveUrl" value="${escapeHtml(
            item.driveUrl || ""
          )}" placeholder="https://drive.google.com/file/d/.../view">
          <span class="admin-field-hint">Set akses file ke “Anyone with the link”.</span>
        </div>
        ${renderPhotoList(
          item.images,
          `${basePath}.images`,
          "Foto pendukung"
        )}
      </div>
    </details>
  `;
}

function renderPhotoList(images, path, label) {
  const list = (images || [])
    .map(
      (image, index) => `
        <div class="admin-photo">
          <img src="${escapeHtml(previewUrl(image.url || ""))}" alt="">
          <div class="admin-field">
            <label>Teks alternatif</label>
            <input data-path="${path}.${index}.alt" value="${escapeHtml(
              image.alt || ""
            )}">
          </div>
          <div class="admin-field">
            <label>Caption</label>
            <input data-path="${path}.${index}.caption" value="${escapeHtml(
              image.caption || ""
            )}">
          </div>
          <button type="button" class="admin-icon-btn is-danger"
            data-action="remove-photo" data-path="${path}" data-index="${index}">
            Hapus foto
          </button>
        </div>
      `
    )
    .join("");

  return `
    <div class="admin-field">
      <label>${escapeHtml(label)}</label>
      <input class="admin-file" type="file" accept="image/*" multiple
        data-upload-target="${path}" data-upload-multiple="true"
        data-upload-label="${escapeHtml(label)}">
      ${
        list
          ? `<div class="admin-photo-list">${list}</div>`
          : `<p class="admin-field-hint">Belum ada foto.</p>`
      }
    </div>
  `;
}

function renderLk3() {
  renderDocSection({
    host: $("#sectionLk3"),
    doc: state.lk3,
    base: "lk3",
    prefix: "lk3-item",
    title: "LK 3",
    description: "Laporan LK 3 dan dokumen pendukungnya.",
    addLabel: "+ Tambah dokumen",
  });
}

function renderLampiran() {
  renderDocSection({
    host: $("#sectionLampiran"),
    doc: state.lampiran,
    base: "lampiran",
    prefix: "lampiran-item",
    title: "Lampiran",
    description: "Dokumen penilaian, administrasi, dan kegiatan pendukung.",
    addLabel: "+ Tambah dokumen",
  });
}

function renderDocSection({ host, doc, base, prefix, title, description, addLabel }) {
  if (!host || !state) return;
  const data = doc || { title, description: "", items: [] };
  const items = data.items || [];

  host.innerHTML = `
    <div class="admin-section-head">
      <div>
        <h2>${escapeHtml(title)}</h2>
        <p>${escapeHtml(description)}</p>
      </div>
      <button type="button" class="btn btn--ghost btn--small" data-action="add-${prefix}">${escapeHtml(
        addLabel
      )}</button>
    </div>
    <div class="admin-card" style="margin-bottom:18px">
      <div class="admin-field">
        <label>Judul bagian</label>
        <input data-path="${base}.title" value="${escapeHtml(
          data.title || title
        )}">
      </div>
      <div class="admin-field">
        <label>Deskripsi bagian</label>
        <textarea data-path="${base}.description" rows="3">${escapeHtml(
          data.description || ""
        )}</textarea>
      </div>
    </div>
    <div class="admin-card-list">
      ${
        items.length
          ? items
              .map((item, index) =>
                renderDocItem(item, index, `${base}.items`, prefix, index === 0)
              )
              .join("")
          : `<div class="admin-empty">Belum ada dokumen.</div>`
      }
    </div>
  `;
}

function renderVideos() {
  const host = $("#sectionVideos");
  if (!host || !state) return;
  const videos = state.videos || [];

  host.innerHTML = `
    <div class="admin-section-head">
      <div>
        <h2>Galeri Video</h2>
        <p>Tambahkan link YouTube atau Google Drive. Untuk Drive, set akses “Anyone with the link”.</p>
      </div>
      <button type="button" class="btn btn--ghost btn--small" data-action="add-video">+ Tambah video</button>
    </div>
    <div class="admin-card-list">
      ${
        videos.length
          ? videos
              .map((video, index) => renderVideo(video, index))
              .join("")
          : `<div class="admin-empty">Belum ada video.</div>`
      }
    </div>
  `;
}

function renderVideo(video, index) {
  const basePath = `videos.${index}`;
  const poster = video.poster && video.poster.url ? video.poster : null;

  return `
    <details class="admin-item" ${index === 0 ? "open" : ""}>
      <summary>
        🎬 ${escapeHtml(video.title || "Video")}
        <span class="admin-item__meta">
          <button type="button" class="admin-icon-btn" data-action="move-video-up" data-index="${index}" title="Naik">↑</button>
          <button type="button" class="admin-icon-btn" data-action="move-video-down" data-index="${index}" title="Turun">↓</button>
          <button type="button" class="admin-icon-btn is-danger" data-action="remove-video" data-index="${index}">Hapus</button>
        </span>
      </summary>
      <div class="admin-item__body">
        <div class="admin-field">
          <label>Judul video</label>
          <input data-path="${basePath}.title" value="${escapeHtml(
            video.title || ""
          )}">
        </div>
        <div class="admin-field">
          <label>Deskripsi</label>
          <textarea data-path="${basePath}.description" rows="3">${escapeHtml(
            video.description || ""
          )}</textarea>
        </div>
        <div class="admin-field">
          <label>Link video</label>
          <input data-path="${basePath}.url" value="${escapeHtml(
            video.url || ""
          )}" placeholder="https://youtu.be/... atau https://drive.google.com/file/d/.../view">
        </div>
        <div class="admin-field-row">
          <div class="admin-field">
            <label>Kategori</label>
            <select data-path="${basePath}.category">
              ${VIDEO_CATEGORIES.map(
                (category) =>
                  `<option value="${escapeHtml(category)}" ${
                    video.category === category ? "selected" : ""
                  }>${escapeHtml(category)}</option>`
              ).join("")}
            </select>
          </div>
          <div class="admin-field">
            <label>Terkait siklus</label>
            <input data-path="${basePath}.cycle" value="${escapeHtml(
              video.cycle || ""
            )}" placeholder="Siklus 1 (opsional)">
          </div>
        </div>
        <div class="admin-field">
          <label>Thumbnail (opsional)</label>
          ${
            poster
              ? `<div class="admin-photo" style="max-width:220px">
                  <img src="${escapeHtml(previewUrl(poster.url))}" alt="">
                  <button type="button" class="admin-icon-btn is-danger" data-action="remove-poster" data-index="${index}">Hapus thumbnail</button>
                </div>`
              : ""
          }
          <input class="admin-file" type="file" accept="image/*"
            data-upload-target="${basePath}.poster"
            data-upload-label="Thumbnail video">
          <span class="admin-field-hint">Jika kosong, thumbnail diambil otomatis dari YouTube/Drive.</span>
        </div>
      </div>
    </details>
  `;
}

function renderSettings() {
  const host = $("#sectionSettings");
  if (!host || !state) return;
  const settings = state.settings || {};

  const field = (key, label, type = "text", hint = "") => `
    <div class="admin-field">
      <label>${escapeHtml(label)}</label>
      ${
        type === "textarea"
          ? `<textarea data-path="settings.${key}" rows="3">${escapeHtml(
              settings[key] || ""
            )}</textarea>`
          : `<input data-path="settings.${key}" value="${escapeHtml(
              settings[key] || ""
            )}">`
      }
      ${hint ? `<span class="admin-field-hint">${escapeHtml(hint)}</span>` : ""}
    </div>
  `;

  host.innerHTML = `
    <div class="admin-section-head">
      <div>
        <h2>Pengaturan Situs</h2>
        <p>Judul, deskripsi, dan tautan kontak. Perubahan ini belum dipakai otomatis oleh semua bagian situs; fokus utama admin adalah foto dan dokumen.</p>
      </div>
    </div>
    <div class="admin-card">
      ${field("siteTitle", "Judul situs")}
      ${field("siteDescription", "Deskripsi situs", "textarea")}
      ${field("heroEyebrow", "Teks kecil di hero")}
      ${field("heroTitle", "Judul hero")}
      ${field("heroRole", "Peran")}
      ${field("heroDescription", "Deskripsi hero", "textarea")}
      <div class="admin-field-row">
        ${field("whatsapp", "Link WhatsApp", "text", "Contoh: https://wa.me/6281234567890")}
        ${field("email", "Email")}
      </div>
      <div class="admin-field-row">
        ${field("instagram", "Instagram")}
        ${field("tiktok", "TikTok")}
      </div>
      ${field("address", "Alamat", "textarea")}
      ${field("footerText", "Teks footer")}
    </div>
  `;
}

/* ---------- Upload foto ---------- */

async function loadBitmap(file) {
  if (window.createImageBitmap) {
    try {
      return await createImageBitmap(file);
    } catch (error) {
      /* lanjut ke fallback */
    }
  }

  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Gambar tidak bisa dibaca."));
    };
    image.src = url;
  });
}

async function resizeImage(file) {
  const bitmap = await loadBitmap(file);
  const maxWidth = 1600;
  const maxHeight = 2000;
  const scale = Math.min(
    1,
    maxWidth / bitmap.width,
    maxHeight / bitmap.height
  );
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Browser tidak mendukung pemrosesan gambar.");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(bitmap, 0, 0, width, height);
  if (typeof bitmap.close === "function") bitmap.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Gagal mengompres gambar.")),
      "image/jpeg",
      0.82
    );
  });
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
    reader.onerror = () => reject(new Error("Gagal membaca gambar."));
    reader.readAsDataURL(blob);
  });
}

async function uploadImage(file, label) {
  if (!file.type.startsWith("image/")) {
    throw new Error("File harus berupa gambar.");
  }
  if (file.type === "image/svg+xml") {
    throw new Error("Gunakan foto JPG/PNG/WebP, bukan SVG.");
  }
  if (file.size > 15 * 1024 * 1024) {
    throw new Error("Ukuran foto maksimal 15 MB.");
  }

  const blob = await resizeImage(file);
  const base64 = await blobToBase64(blob);
  const suffix = Math.random().toString(36).slice(2, 7);
  const path = `assets/uploads/${Date.now()}-${slugify(
    label || file.name
  )}-${suffix}.jpg`;

  await gh(`/repos/${repo}/contents/${encodePath(path)}`, {
    method: "PUT",
    body: JSON.stringify({
      message: `Upload foto: ${label || file.name}`,
      content: base64,
      branch,
    }),
  });

  return path;
}

async function handleUpload(input) {
  const files = Array.from(input.files || []);
  if (!files.length) return;

  const targetPath = input.dataset.uploadTarget;
  const label = input.dataset.uploadLabel || "Foto";
  const multiple = input.dataset.uploadMultiple === "true";
  if (!targetPath || !state) return;

  const artifactMatch = targetPath.match(/^cycles\.\d+\.artifacts\.(\d+)\.images$/);
  if (artifactMatch) openArtifact = Number(artifactMatch[1]);

  input.disabled = true;
  toast(files.length > 1 ? `Mengunggah ${files.length} foto...` : "Mengunggah foto...");

  try {
    for (const file of files) {
      const url = await uploadImage(file, label);
      if (multiple) {
        const images = getByPath(state, targetPath) || [];
        images.push({ url, alt: label, caption: "" });
        setByPath(state, targetPath, images);
      } else {
        const current = getByPath(state, targetPath) || {};
        setByPath(state, targetPath, {
          ...current,
          url,
          alt: current.alt || label,
          caption: current.caption || "",
        });
      }
    }

    markDirty();
    renderAll();
    toast("Foto terunggah. Klik Simpan ke GitHub untuk menerbitkan.");
  } catch (error) {
    toast("Gagal upload: " + error.message);
  } finally {
    input.disabled = false;
    input.value = "";
  }
}

/* ---------- Event handler ---------- */

function handleInput(event) {
  const target = event.target;
  if (
    !(
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement
    )
  ) {
    return;
  }
  const path = target.dataset.path;
  if (!path || !state) return;
  const value = target.type === "checkbox" ? target.checked : target.value;
  setByPath(state, path, value);
  markDirty();
}

function handleChange(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;

  if (target.type === "file" && target.dataset.uploadTarget) {
    handleUpload(target);
    return;
  }

  if (target.matches("select[data-path]") && target.dataset.path) {
    setByPath(state, target.dataset.path, target.value);
    markDirty();
  }
}

function handleActionClick(event) {
  const button = event.target.closest("[data-action]");
  if (!button || !state) return;

  const action = button.dataset.action;
  const index = Number(button.dataset.index);

  if (action === "select-cycle") {
    selectedCycle = index;
    openArtifact = 0;
    renderCycles();
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  const cycle = state.cycles[selectedCycle];
  const artifacts = cycle ? cycle.artifacts : [];

  switch (action) {
    case "add-artifact": {
      if (!cycle) return;
      cycle.artifacts.push(newArtifact());
      openArtifact = cycle.artifacts.length - 1;
      markDirty();
      renderCycles();
      break;
    }
    case "remove-artifact": {
      if (!artifacts[index]) return;
      if (!confirm(`Hapus artefak “${artifacts[index].title}”?`)) return;
      artifacts.splice(index, 1);
      openArtifact = Math.max(0, Math.min(openArtifact, artifacts.length - 1));
      markDirty();
      renderCycles();
      break;
    }
    case "move-artifact-up": {
      moveItem(artifacts, index, -1);
      openArtifact = Math.max(0, index - 1);
      markDirty();
      renderCycles();
      break;
    }
    case "move-artifact-down": {
      moveItem(artifacts, index, 1);
      openArtifact = Math.min(artifacts.length - 1, index + 1);
      markDirty();
      renderCycles();
      break;
    }
    case "add-lk3-item": {
      state.lk3.items.push(newArtifact());
      markDirty();
      renderLk3();
      break;
    }
    case "remove-lk3-item": {
      if (!state.lk3.items[index]) return;
      if (!confirm(`Hapus dokumen “${state.lk3.items[index].title}”?`)) return;
      state.lk3.items.splice(index, 1);
      markDirty();
      renderLk3();
      break;
    }
    case "move-lk3-item-up": {
      moveItem(state.lk3.items, index, -1);
      markDirty();
      renderLk3();
      break;
    }
    case "move-lk3-item-down": {
      moveItem(state.lk3.items, index, 1);
      markDirty();
      renderLk3();
      break;
    }
    case "add-lampiran-item": {
      state.lampiran.items.push(newArtifact());
      markDirty();
      renderLampiran();
      break;
    }
    case "remove-lampiran-item": {
      if (!state.lampiran.items[index]) return;
      if (!confirm(`Hapus dokumen “${state.lampiran.items[index].title}”?`)) return;
      state.lampiran.items.splice(index, 1);
      markDirty();
      renderLampiran();
      break;
    }
    case "move-lampiran-item-up": {
      moveItem(state.lampiran.items, index, -1);
      markDirty();
      renderLampiran();
      break;
    }
    case "move-lampiran-item-down": {
      moveItem(state.lampiran.items, index, 1);
      markDirty();
      renderLampiran();
      break;
    }
    case "add-video": {
      state.videos.push(newVideo());
      markDirty();
      renderVideos();
      break;
    }
    case "remove-video": {
      if (!state.videos[index]) return;
      if (!confirm(`Hapus video “${state.videos[index].title}”?`)) return;
      state.videos.splice(index, 1);
      markDirty();
      renderVideos();
      break;
    }
    case "move-video-up": {
      moveItem(state.videos, index, -1);
      markDirty();
      renderVideos();
      break;
    }
    case "move-video-down": {
      moveItem(state.videos, index, 1);
      markDirty();
      renderVideos();
      break;
    }
    case "remove-photo": {
      const path = button.dataset.path;
      const images = getByPath(state, path);
      if (!Array.isArray(images) || !images[index]) return;
      images.splice(index, 1);
      markDirty();
      renderAll();
      break;
    }
    case "remove-poster": {
      if (!state.videos[index]) return;
      state.videos[index].poster = null;
      markDirty();
      renderVideos();
      break;
    }
    default:
      break;
  }
}

/* ---------- Login / logout ---------- */

function showEditor() {
  $("#loginView").hidden = true;
  $("#editorView").hidden = false;
  $("#logoutBtn").hidden = false;
}

async function login() {
  if (loginBusy) return;

  const input = $("#tokenInput").value.trim();
  repo = $("#repoInput").value.trim() || DEFAULT_REPO;
  branch = $("#branchInput").value.trim() || DEFAULT_BRANCH;

  if (!input) {
    setLoginStatus("Token GitHub belum diisi.", "error");
    return;
  }

  loginBusy = true;
  const button = $("#loginBtn");
  button.disabled = true;
  button.textContent = "Memeriksa token...";
  setLoginStatus("Memeriksa token dan akses repository...");

  try {
    token = input;
    const user = await gh("/user");
    const repoInfo = await gh(`/repos/${repo}`);
    if (
      repoInfo.permissions &&
      repoInfo.permissions.push !== true
    ) {
      throw new Error("Token tidak punya izin menulis ke repository ini.");
    }

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REPO_KEY, repo);
    localStorage.setItem(BRANCH_KEY, branch);

    setLoginStatus(`Masuk sebagai ${user.login}. Memuat konten...`, "ok");
    await loadContent();
    setLoginStatus("");
  } catch (error) {
    token = "";
    setLoginStatus("Gagal masuk: " + error.message, "error");
  } finally {
    loginBusy = false;
    button.disabled = false;
    button.textContent = "Masuk & Muat Konten";
  }
}

async function autoLogin() {
  try {
    const repoInfo = await gh(`/repos/${repo}`);
    if (repoInfo.permissions && repoInfo.permissions.push !== true) {
      throw new Error("Token tidak punya izin menulis ke repository ini.");
    }
    await loadContent();
    setLoginStatus("");
  } catch (error) {
    token = "";
    if (error.status === 401 || error.status === 403) {
      localStorage.removeItem(TOKEN_KEY);
    }
    setLoginStatus(
      "Sesi tidak valid atau token tidak punya akses. Masukkan token baru.",
      "error"
    );
  }
}

function logout() {
  if (dirty && !confirm("Perubahan belum disimpan akan hilang. Hapus token?")) {
    return;
  }
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REPO_KEY);
  localStorage.removeItem(BRANCH_KEY);
  window.location.reload();
}

/* ---------- Tab & inisialisasi ---------- */

function showSection(section) {
  $$("#adminTabs button").forEach((button) => {
    button.classList.toggle("active", button.dataset.section === section);
  });
  $$(".admin-section").forEach((node) => {
    node.classList.toggle("active", node.dataset.section === section);
  });
}

function init() {
  const loginButton = $("#loginBtn");
  const tokenInput = $("#tokenInput");
  const saveButton = $("#saveBtn");
  const reloadButton = $("#reloadBtn");
  const logoutButton = $("#logoutBtn");
  const tabs = $("#adminTabs");

  if (!loginButton || !tokenInput) return;

  loginButton.addEventListener("click", login);
  tokenInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") login();
  });
  saveButton.addEventListener("click", saveContent);
  logoutButton.addEventListener("click", logout);
  reloadButton.addEventListener("click", async () => {
    if (dirty && !confirm("Perubahan belum disimpan akan hilang. Muat ulang?")) {
      return;
    }
    try {
      await loadContent();
    } catch (error) {
      setStatus("Gagal memuat ulang: " + error.message, "error");
    }
  });

  tabs.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-section]");
    if (!button) return;
    showSection(button.dataset.section);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.addEventListener("input", handleInput);
  document.addEventListener("change", handleChange);
  document.addEventListener("click", handleActionClick);

  window.addEventListener("beforeunload", (event) => {
    if (!dirty) return;
    event.preventDefault();
    event.returnValue = "";
  });

  const savedRepo = localStorage.getItem(REPO_KEY);
  const savedBranch = localStorage.getItem(BRANCH_KEY);
  if (savedRepo) $("#repoInput").value = savedRepo;
  if (savedBranch) $("#branchInput").value = savedBranch;

  const savedToken = localStorage.getItem(TOKEN_KEY);
  if (savedToken) {
    token = savedToken;
    repo = savedRepo || DEFAULT_REPO;
    branch = savedBranch || DEFAULT_BRANCH;
    tokenInput.value = savedToken;
    setLoginStatus("Token tersimpan ditemukan. Memuat konten...");
    autoLogin();
  }
}

document.addEventListener("DOMContentLoaded", init);
