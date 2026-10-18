/* ============================================================
   Portofolio PPG — Ilham Kresnamurti, S.Kom.
   Vanilla JavaScript
   ============================================================ */

"use strict";

/* ---------- Data Artefak Produk (per siklus) ---------- */
const SITES_BASE =
  "https://sites.google.com/ppg.belajar.id/ilham-kresnamurti-s-kom/artefak-produk";

const ARTEFAK_ITEMS = [
  {
    icon: "📄",
    title: "Rencana Pelaksanaan Pembelajaran (RPP)",
    slug: "rencana-pelaksanaan-pembelajaran-rpp",
    note: "Perangkat pembelajaran lengkap",
  },
  {
    icon: "🖥️",
    title: "Media Pembelajaran",
    slug: "media-pembelajaran",
    note: "Media & sumber belajar digital",
  },
  {
    icon: "✍️",
    title: "Contoh Hasil Kerja Murid",
    slug: "contoh-hasil-kerja-murid",
    note: "Bukti capaian belajar peserta didik",
  },
  {
    icon: "📸",
    title: "Foto / Video Pembelajaran",
    slug: "fotovideo-pembelajaran",
    note: "Dokumentasi kegiatan di kelas",
  },
  {
    icon: "📊",
    title: "Analisis Artefak Produk",
    slug: "analisis-artefak-produk",
    note: "Analisis produk pembelajaran",
  },
  {
    icon: "🔍",
    title: "Refleksi Artefak Produk",
    slug: "refleksi-artefak-produk",
    note: "Refleksi proses pembelajaran",
  },
];

const SIKLUS_DATA = {
  "siklus-1": {
    label: "Siklus 1",
    desc:
      "Pada Siklus 1 ini terdapat beberapa artefak produk sebagai bagian dari dokumentasi proses pembelajaran: RPP, media pembelajaran, contoh hasil kerja murid, foto/video kegiatan pembelajaran, analisis produk, serta refleksi terhadap proses pembelajaran. Setiap bagian disusun untuk memberikan gambaran yang utuh mengenai perencanaan, pelaksanaan, hingga evaluasi pembelajaran yang telah dilakukan.",
  },
  "siklus-2": {
    label: "Siklus 2",
    desc:
      "Bagian Siklus 2 memuat dan mengulas berbagai artefak produk sebagai bentuk rekam jejak proses pembelajaran. Ragam instrumen yang ditampilkan meliputi RPP, media instruksional, lembar kerja hasil murid, rekaman visual kegiatan, analisis produk, dan refleksi pembelajaran. Melalui penyajian komparatif ini, diharapkan pembaca dapat melihat benang merah yang kuat antara desain kurikulum dengan realitas pembelajaran serta kompetensi yang berhasil diraih murid.",
  },
  "siklus-3": {
    label: "Siklus 3",
    desc:
      "Siklus 3 menjadi penutup dari rangkaian penyusunan artefak produk pembelajaran. Dokumen pada siklus ini menampilkan hasil perbaikan dari siklus sebelumnya, mulai dari RPP, media pembelajaran, hasil kerja murid, dokumentasi kegiatan, analisis, hingga refleksi akhir — sebagai bukti peningkatan mutu pembelajaran secara berkelanjutan.",
  },
};

/* ---------- Render panel tabs artefak ---------- */
function renderArtefak() {
  const host = document.getElementById("tabsPanels");
  if (!host) return;

  Object.entries(SIKLUS_DATA).forEach(([key, data], index) => {
    const panel = document.createElement("div");
    panel.className = "tabs__panel" + (index === 0 ? " active" : "");
    panel.id = key;
    panel.setAttribute("role", "tabpanel");

    const desc = document.createElement("p");
    desc.className = "tabs__desc";
    desc.textContent = data.desc;
    panel.appendChild(desc);

    const grid = document.createElement("div");
    grid.className = "artefak-grid";

    ARTEFAK_ITEMS.forEach((item) => {
      const a = document.createElement("a");
      a.className = "artefak-item";
      a.href = `${SITES_BASE}/${key}/${item.slug}`;
      a.target = "_blank";
      a.rel = "noopener";
      a.innerHTML =
        `<span class="artefak-item__icon">${item.icon}</span>` +
        `<h4>${item.title}</h4>` +
        `<span>${item.note} — buka ↗</span>`;
      grid.appendChild(a);
    });

    panel.appendChild(grid);
    host.appendChild(panel);
  });
}

/* ---------- Tab switching ---------- */
function initTabs() {
  const buttons = document.querySelectorAll(".tabs__btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      document.querySelectorAll(".tabs__panel").forEach((p) => {
        p.classList.toggle("active", p.id === btn.dataset.tab);
      });
    });
  });
}

/* ---------- Navbar: shadow saat scroll ---------- */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ---------- Mobile menu ---------- */
function initMobileMenu() {
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");

  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });

  menu.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------- Scroll-spy: highlight menu aktif ---------- */
function initScrollSpy() {
  const links = [...document.querySelectorAll(".nav-link")];
  const sections = links
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) =>
          l.classList.toggle(
            "active",
            l.getAttribute("href") === "#" + entry.target.id
          )
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((s) => observer.observe(s));
}

/* ---------- Reveal on scroll ---------- */
function initReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  items.forEach((el) => observer.observe(el));
}

/* ---------- Tema gelap / terang ---------- */
function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  const saved = localStorage.getItem("theme");

  if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    root.setAttribute("data-theme", "dark");
  }

  toggle.addEventListener("click", () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    if (isDark) {
      root.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    } else {
      root.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
  });
}

/* ---------- Tombol kembali ke atas ---------- */
function initToTop() {
  const btn = document.getElementById("toTop");
  window.addEventListener(
    "scroll",
    () => btn.classList.toggle("show", window.scrollY > 500),
    { passive: true }
  );
  btn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
}

/* ---------- Tahun di footer ---------- */
function initYear() {
  document.getElementById("year").textContent = new Date().getFullYear();
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderArtefak();
  initTabs();
  initNavbar();
  initMobileMenu();
  initScrollSpy();
  initReveal();
  initTheme();
  initToTop();
  initYear();
});
