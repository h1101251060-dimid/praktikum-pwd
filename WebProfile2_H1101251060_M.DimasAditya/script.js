"use strict";

/* SCRIPT.JS — Website Profil Muhammad Dimas Aditya */

document.addEventListener("DOMContentLoaded", function () {

  /* GAYA TAMBAHAN */

  function sisipkanGayaTambahan() {
    const gaya = document.createElement("style");
    gaya.setAttribute("data-sumber", "script.js");
    gaya.textContent = `
      /* Body dark-mode: background tidak inline di HTML asli, jadi aman
         diatur lewat class biasa (tidak butuh !important). Warna TEKS body
         tetap diatur langsung oleh JS karena itu inline di HTML asli. */
      body.mode-gelap {
        background-color: #12131a;
      }

      .js-tombol {
        cursor: pointer;
        border: none;
        border-radius: 5px;
        padding: 8px 16px;
        font-weight: bold;
        font-family: Arial, sans-serif;
      }
      .js-tombol-gelap {
        background-color: #ffffff33;
        color: white;
        margin-top: 10px;
      }

      .js-konter-karakter {
        display: block;
        margin-top: 4px;
        font-size: 0.8em;
        color: #666666;
      }
      body.mode-gelap .js-konter-karakter {
        color: #9a9ab0;
      }
      .js-konter-karakter.js-peringatan {
        color: #cc3300 !important;
        font-weight: bold;
      }

      .js-pesan-error {
        display: block;
        color: #cc3300;
        font-size: 0.85em;
        margin-top: 4px;
      }

      .js-pesan-sukses {
        background-color: #e6f4ea;
        color: #1e7e34;
        border: 1px solid #b6dfc0;
        padding: 10px 14px;
        border-radius: 6px;
        margin-bottom: 12px;
        font-size: 0.95em;
      }
      body.mode-gelap .js-pesan-sukses {
        background-color: #163420;
        color: #7be39a;
        border-color: #2e6b45;
      }

      /* Highlight menu navigasi aktif -- dibuat "pil" solid agar jelas
         terlihat, dan pakai !important supaya bisa menang melawan
         style="color: darkslateblue" inline pada tag <a> asli. */
      .js-nav-aktif {
        background-color: darkslateblue !important;
        color: #ffffff !important;
        padding: 3px 10px !important;
        border-radius: 999px !important;
        text-decoration: none !important;
        transition: background-color 0.2s ease;
      }
      body.mode-gelap .js-nav-aktif {
        background-color: #6f74c9 !important;
      }

      .js-jam-footer {
        display: block;
        margin-top: 4px;
        font-size: 0.85em;
        color: #999999;
      }

      /* Toast sambutan on-page */
      .js-toast-sambutan {
        position: fixed;
        top: 16px;
        right: 16px;
        max-width: 320px;
        background-color: darkslateblue;
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 4px 14px rgba(0,0,0,0.25);
        font-family: Arial, sans-serif;
        font-size: 0.9em;
        z-index: 9999;
        opacity: 0;
        transform: translateY(-8px);
        transition: opacity 0.35s ease, transform 0.35s ease;
      }
      .js-toast-sambutan.js-toast-tampil {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(gaya);
  }

  /* SAMBUTAN */

  function sapaSelamatDatang() {
    const namaPemilik = "Muhammad Dimas Aditya";
    const tahunSekarang = new Date().getFullYear();

    // Tetap dicatat di Console untuk keperluan debugging/pembelajaran
    console.log(`Selamat datang di website profil ${namaPemilik}!`);
    console.log(`Skrip JavaScript berhasil dimuat pada tahun ${tahunSekarang}.`);
    console.log("Demo typeof ->", typeof namaPemilik, typeof tahunSekarang, typeof true);

    // Toast visual di pojok layar
    const toast = document.createElement("div");
    toast.className = "js-toast-sambutan";
    toast.textContent = `👋 Halo! Selamat datang di web profile ${namaPemilik}.`;
    document.body.appendChild(toast);

    // requestAnimationFrame agar transisi CSS sempat terpicu dengan mulus
    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add("js-toast-tampil"));
    });

    setTimeout(() => {
      toast.classList.remove("js-toast-tampil");
      setTimeout(() => toast.remove(), 400); // tunggu transisi fade-out selesai
    }, 4000);
  }

  /* TOGGLE MODE GELAP */

  // Peta konfigurasi: selector -> { properti: nilaiUntukModeGelap }
  const KONFIGURASI_MODE_GELAP = [
    { selector: "body", gaya: { color: "#e6e6e6" } },
    { selector: "nav", gaya: { backgroundColor: "#20212c" } },
    { selector: "nav a", gaya: { color: "#b3b8ff" } },
    { selector: "main h2", gaya: { color: "#b3b8ff", borderBottomColor: "#6f74c9" } },
    { selector: "main h3", gaya: { color: "#b3b8ff" } },
    { selector: "blockquote", gaya: { backgroundColor: "#1e1f29", color: "#cfcfcf", borderLeftColor: "#6f74c9" } },
    { selector: "aside", gaya: { backgroundColor: "#1e1f29", borderColor: "#3a3b4a" } },
    { selector: "aside a", gaya: { color: "#9fa8ff" } },
    { selector: "form", gaya: { backgroundColor: "#1e1f29" } },
    { selector: "form label", gaya: { color: "#e6e6e6" } },
    { selector: "input, select, textarea", gaya: { backgroundColor: "#2a2b38", color: "#e6e6e6", borderColor: "#4a4b5a" } },
    { selector: "input[type='reset']", gaya: { backgroundColor: "#4a4b5a", color: "#e6e6e6" } },
    { selector: "footer", gaya: { color: "#a9a9c2" } },
  ];

  function setupModeGelap() {
    const header = document.querySelector("header");
    if (!header) return;

    const tombolGelap = document.createElement("button");
    tombolGelap.type = "button";
    tombolGelap.className = "js-tombol js-tombol-gelap";
    header.appendChild(tombolGelap);

    // Menyimpan nilai style asli tiap elemen, per-properti, hanya sekali.
    const nilaiAsli = new WeakMap(); // elemen -> { properti: nilaiAsli }

    function catatNilaiAsliJikaBelum(elemen, properti) {
      if (!nilaiAsli.has(elemen)) {
        nilaiAsli.set(elemen, {});
      }
      const catatan = nilaiAsli.get(elemen);
      if (!(properti in catatan)) {
        // elemen.style[properti] otomatis membaca nilai inline yang ada,
        // walau ditulis lewat shorthand seperti "border: 1px solid #999"
        catatan[properti] = elemen.style[properti] || "";
      }
    }

    function terapkanModeGelap(aktif) {
      KONFIGURASI_MODE_GELAP.forEach(function ({ selector, gaya }) {
        document.querySelectorAll(selector).forEach(function (elemen) {
          Object.keys(gaya).forEach(function (properti) {
            catatNilaiAsliJikaBelum(elemen, properti);
            elemen.style[properti] = aktif
              ? gaya[properti]
              : nilaiAsli.get(elemen)[properti];
          });
        });
      });
      document.body.classList.toggle("mode-gelap", aktif);
    }

    const perbaruiTeksTombol = (modeAktif) => {
      tombolGelap.textContent = modeAktif ? "☀️ Mode Terang" : "🌙 Mode Gelap";
    };

    const preferensiTersimpan = localStorage.getItem("modeGelapProfil") === "true";
    terapkanModeGelap(preferensiTersimpan);
    perbaruiTeksTombol(preferensiTersimpan);

    tombolGelap.addEventListener("click", function () {
      const modeBaru = !document.body.classList.contains("mode-gelap");
      terapkanModeGelap(modeBaru);
      perbaruiTeksTombol(modeBaru);
      localStorage.setItem("modeGelapProfil", modeBaru);
    });
  }

  /* NAVIGASI */

  function setupNavigasiAktif() {
    const tautanNav = document.querySelectorAll("nav a[href^='#']");
    if (tautanNav.length === 0) return;

    for (let i = 0; i < tautanNav.length; i++) {
      const tautan = tautanNav[i];
      tautan.addEventListener("click", function (event) {
        const idTujuan = tautan.getAttribute("href");
        const elemenTujuan = document.querySelector(idTujuan);
        if (!elemenTujuan) return;
        event.preventDefault();
        elemenTujuan.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    const idSection = ["tentang", "pendidikan", "organisasi", "kontak"];
    const opsiObserver = { root: null, threshold: 0.4 };

    const observer = new IntersectionObserver(function (daftarEntri) {
      daftarEntri.forEach(function (entri) {
        const tautanTerkait = document.querySelector(`nav a[href="#${entri.target.id}"]`);
        if (!tautanTerkait) return;
        if (entri.isIntersecting) {
          tautanNav.forEach((t) => t.classList.remove("js-nav-aktif"));
          tautanTerkait.classList.add("js-nav-aktif");
        }
      });
    }, opsiObserver);

    idSection.forEach(function (id) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }

  /* PENGHITUNG KARAKTER REAL-TIME UNTUK TEXTAREA PESAN */

  function setupKonterKarakter() {
    const kolomPesan = document.getElementById("pesan");
    if (!kolomPesan) return;

    const BATAS_MAKS = 300;

    const labelKonter = document.createElement("small");
    labelKonter.className = "js-konter-karakter";
    labelKonter.textContent = `0 / ${BATAS_MAKS} karakter`;
    kolomPesan.insertAdjacentElement("afterend", labelKonter);

    kolomPesan.addEventListener("input", function () {
      const panjangSekarang = kolomPesan.value.length;
      labelKonter.textContent = `${panjangSekarang} / ${BATAS_MAKS} karakter`;

      if (panjangSekarang > BATAS_MAKS) {
        labelKonter.classList.add("js-peringatan");
        labelKonter.textContent += " — terlalu panjang!";
      } else if (panjangSekarang > BATAS_MAKS * 0.9) {
        labelKonter.classList.add("js-peringatan");
      } else {
        labelKonter.classList.remove("js-peringatan");
      }
    });
  }

  /* VALIDASI & PENANGANAN SUBMIT FORMULIR KONTAK */

  function setupValidasiForm() {
    const formKontak = document.querySelector("#kontak form");
    const kolomNama = document.getElementById("nama");
    const kolomEmail = document.getElementById("email");
    const kolomSubjek = document.getElementById("subjek");
    const kolomPesan = document.getElementById("pesan");

    if (!formKontak || !kolomNama || !kolomEmail || !kolomSubjek || !kolomPesan) return;

    const polaEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function pastikanElemenError(inputElemen) {
      let elemenError = inputElemen.nextElementSibling;
      if (!elemenError || !elemenError.classList.contains("js-pesan-error")) {
        elemenError = document.createElement("small");
        elemenError.className = "js-pesan-error";
        inputElemen.insertAdjacentElement("afterend", elemenError);
      }
      return elemenError;
    }

    function tampilkanError(inputElemen, pesan) {
      const elemenError = pastikanElemenError(inputElemen);
      elemenError.textContent = pesan;
      return false;
    }

    function bersihkanError(inputElemen) {
      const elemenError = pastikanElemenError(inputElemen);
      elemenError.textContent = "";
    }

    function validasiNama() {
      const nilai = kolomNama.value.trim();
      if (nilai === "") return tampilkanError(kolomNama, "Nama tidak boleh kosong.");
      if (nilai.length < 3) return tampilkanError(kolomNama, "Nama minimal 3 karakter.");
      bersihkanError(kolomNama);
      return true;
    }

    function validasiEmail() {
      const nilai = kolomEmail.value.trim();
      if (nilai === "") return tampilkanError(kolomEmail, "Email tidak boleh kosong.");
      if (!polaEmail.test(nilai)) return tampilkanError(kolomEmail, "Format email tidak valid.");
      bersihkanError(kolomEmail);
      return true;
    }

    function validasiPesan() {
      const nilai = kolomPesan.value.trim();
      if (nilai === "") return tampilkanError(kolomPesan, "Pesan tidak boleh kosong.");
      if (nilai.length < 10) return tampilkanError(kolomPesan, "Pesan minimal 10 karakter.");
      bersihkanError(kolomPesan);
      return true;
    }

    kolomNama.addEventListener("input", validasiNama);
    kolomEmail.addEventListener("input", validasiEmail);
    kolomPesan.addEventListener("input", validasiPesan);

    function labelSubjek(nilaiSubjek) {
      switch (nilaiSubjek) {
        case "kolaborasi": return "Kolaborasi";
        case "pertanyaan": return "Pertanyaan";
        case "lainnya": return "Lainnya";
        default: return "Umum";
      }
    }

    function tampilkanPesanSukses(namaPengirim, subjekTerpilih) {
      const pesanLama = formKontak.querySelector(".js-pesan-sukses");
      if (pesanLama) pesanLama.remove();

      const kotakSukses = document.createElement("div");
      kotakSukses.className = "js-pesan-sukses";
      kotakSukses.textContent =
        `Terima kasih, ${namaPengirim}! Pesan dengan subjek "${labelSubjek(subjekTerpilih)}" ` +
        `berhasil dikirim (simulasi, karena form ini belum terhubung ke server).`;

      formKontak.prepend(kotakSukses);
      setTimeout(() => kotakSukses.remove(), 6000);
    }

    formKontak.addEventListener("submit", function (event) {
      event.preventDefault();

      const hasilValidasi = [validasiNama(), validasiEmail(), validasiPesan()];
      let semuaValid = true;
      for (const hasil of hasilValidasi) {
        if (hasil === false) semuaValid = false;
      }

      if (!semuaValid) {
        console.warn("Form belum valid, pengiriman dibatalkan.");
        return;
      }

      const namaPengirim = kolomNama.value.trim();
      const subjekTerpilih = kolomSubjek.value;

      tampilkanPesanSukses(namaPengirim, subjekTerpilih);
      console.log("Form terkirim (simulasi):", {
        nama: namaPengirim,
        email: kolomEmail.value.trim(),
        subjek: subjekTerpilih,
        pesan: kolomPesan.value.trim()
      });

      formKontak.reset();

      [kolomNama, kolomEmail, kolomPesan].forEach(bersihkanError);
      const labelKonter = kolomPesan.parentNode.querySelector(".js-konter-karakter");
      if (labelKonter) {
        labelKonter.textContent = "0 / 300 karakter";
        labelKonter.classList.remove("js-peringatan");
      }
    });

    formKontak.addEventListener("reset", function () {
      [kolomNama, kolomEmail, kolomPesan].forEach(bersihkanError);
      const pesanSukses = formKontak.querySelector(".js-pesan-sukses");
      if (pesanSukses) pesanSukses.remove();
    });
  }

  /* INISIALISASI */

  const daftarInisialisasi = [
    sisipkanGayaTambahan,
    sapaSelamatDatang,
    setupModeGelap,
    setupNavigasiAktif,
    setupKonterKarakter,
    setupValidasiForm,
    setupJamFooter
  ];

  daftarInisialisasi.forEach(function (fungsiInit) {
    try {
      fungsiInit();
    } catch (kesalahan) {
      console.error(`Gagal menjalankan ${fungsiInit.name}:`, kesalahan);
    }
  });
});