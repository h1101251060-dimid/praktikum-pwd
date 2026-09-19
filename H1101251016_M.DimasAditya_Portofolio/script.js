
/* ---------- 1. MODE GELAP ---------- */
function initDarkMode() {
  const tombol = document.getElementById("dark-mode-toggle");

  tombol.addEventListener("click", function () {
    // toggle: kalau class belum ada -> ditambahkan, kalau sudah ada -> dilepas
    document.body.classList.toggle("mode-gelap");

    // Operator ternary: kondisi ? nilaiJikaBenar : nilaiJikaSalah
    const sedangGelap = document.body.classList.contains("mode-gelap");
    tombol.textContent = sedangGelap ? "☀️" : "🌙";
  });
}


/* ---------- 2. MENU HAMBURGER (ponsel) ---------- */
function initHamburgerMenu() {
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("nav-menu");
  const semuaLink = document.querySelectorAll(".nav-link");

  // Klik hamburger: pasang/lepas class supaya menu terbuka dan ikon jadi silang (×)
  hamburger.addEventListener("click", function () {
    const terbuka = hamburger.classList.toggle("hamburger-aktif");
    menu.classList.toggle("menu-terbuka");
    hamburger.setAttribute("aria-expanded", terbuka);
  });

  // Klik salah satu tautan: tutup menu otomatis
  semuaLink.forEach(function (link) {
    link.addEventListener("click", function () {
      hamburger.classList.remove("hamburger-aktif");
      menu.classList.remove("menu-terbuka");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
}


/* ---------- 3. EFEK SCROLL NAVBAR ---------- */
function initNavbarScrollEffects() {
  const navbar = document.getElementById("navbar");
  const semuaSection = document.querySelectorAll("section[id]");
  const semuaLink = document.querySelectorAll(".nav-link");

  function perbaruiNavbar() {
    // window.scrollY = jarak guliran dari paling atas (piksel).
    // Lebih dari 40px -> navbar mendapat bayangan.
    navbar.classList.toggle("navbar-scrolled", window.scrollY > 40);

    // getBoundingClientRect() = posisi elemen relatif terhadap layar (viewport).
    // Section yang garis atasnya sudah lewat 120px dan bawahnya belum = sedang dibaca.
    semuaSection.forEach(function (section) {
      const posisi = section.getBoundingClientRect();

      if (posisi.top <= 120 && posisi.bottom > 120) {
        // Lepas dulu class lama dari SEMUA tautan, supaya sorotan
        // tidak tertinggal di tautan sebelumnya.
        semuaLink.forEach(function (link) {
          link.classList.remove("link-aktif");
        });

        // Lalu sorot tautan yang href-nya cocok dengan id section ini
        const linkCocok = document.querySelector('.nav-link[href="#' + section.id + '"]');
        if (linkCocok) {
          linkCocok.classList.add("link-aktif");
        }
      }
    });
  }

  window.addEventListener("scroll", perbaruiNavbar);
  perbaruiNavbar(); // jalankan sekali saat halaman dimuat
}


/* ---------- 4. ANIMASI COUNTER STATISTIK ---------- */

// Menghitung naik dari 0 sampai target pada semua elemen .counter
function jalankanAnimasiCounter() {
  const semuaCounter = document.querySelectorAll(".counter");

  semuaCounter.forEach(function (counter) {
    // dataset.target membaca atribut data-target (bentuknya teks),
    // parseInt(..., 10) mengubahnya menjadi bilangan bulat berbasis 10.
    const nilaiTarget = parseInt(counter.dataset.target, 10);

    // Naik sedikit demi sedikit: ada sekitar 50 langkah x 30ms = +-1,5 detik
    const kenaikan = Math.ceil(nilaiTarget / 50);
    let nilaiSekarang = 0;

    // setInterval mengulang fungsi setiap 30 milidetik
    const interval = setInterval(function () {
      nilaiSekarang += kenaikan;

      if (nilaiSekarang >= nilaiTarget) {
        nilaiSekarang = nilaiTarget;
        clearInterval(interval); // WAJIB: hentikan pengulangan saat target tercapai
      }

      counter.textContent = nilaiSekarang;
    }, 30);
  });
}

// Memantau guliran: counter hanya berjalan sekali saat bagian Tentang terlihat
function initCounterAnimation() {
  const bagianTentang = document.getElementById("tentang");
  let animasiSudahDijalankan = false; // penanda (flag)

  function cekPosisi() {
    if (animasiSudahDijalankan) {
      return; // sudah pernah jalan, jangan ulangi
    }

    const jarakAtas = bagianTentang.getBoundingClientRect().top;
    if (jarakAtas < window.innerHeight - 100) {
      animasiSudahDijalankan = true;
      jalankanAnimasiCounter();
    }
  }

  window.addEventListener("scroll", cekPosisi);
  cekPosisi();
}


/* ---------- 5. FILTER PORTOFOLIO ---------- */
function initPortfolioFilter() {
  const semuaTombol = document.querySelectorAll(".filter-btn");
  const semuaItem = document.querySelectorAll(".portofolio-item");

  semuaTombol.forEach(function (tombol) {
    tombol.addEventListener("click", function () {
      // Baca kategori dari atribut data-kategori pada tombol
      const kategoriDipilih = tombol.dataset.kategori;

      // Tandai tombol yang sedang dipilih
      semuaTombol.forEach(function (t) {
        t.classList.toggle("filter-aktif", t === tombol);
      });

      // Cek setiap item: cocok jika kategori "semua" atau kategorinya sama
      semuaItem.forEach(function (item) {
        const cocok = kategoriDipilih === "semua" || item.dataset.kategori === kategoriDipilih;

        // Argumen kedua toggle (boolean) memaksa:
        // true -> class "tersembunyi" ditambahkan, false -> dilepas
        item.classList.toggle("tersembunyi", !cocok);
      });
    });
  });
}


/* ---------- 6. SLIDER TESTIMONI ---------- */
function initTestimonialSlider() {
  const semuaSlide = document.querySelectorAll(".slide");
  const wadahDots = document.getElementById("slider-dots");
  const tombolPrev = document.getElementById("slide-prev");
  const tombolNext = document.getElementById("slide-next");

  let indexAktif = 0;
  let autoplay;

  // TAHAP 1: buat titik navigasi otomatis sebanyak jumlah slide.
  // Karena dibuat lewat kode, menambah testimoni di HTML tidak perlu mengubah JavaScript.
  semuaSlide.forEach(function (slide, index) {
    const dot = document.createElement("button"); // buat elemen <button> baru
    dot.classList.add("dot");
    dot.setAttribute("aria-label", "Testimoni ke-" + (index + 1));

    dot.addEventListener("click", function () {
      tampilkanSlide(index);
      mulaiAutoplay(); // setelah klik manual, hitung ulang 6 detik dari awal
    });

    wadahDots.appendChild(dot); // tempelkan ke kontainer titik
  });

  const semuaDot = wadahDots.querySelectorAll(".dot");

  // TAHAP 2: lepas semua class aktif, lalu pasang pada slide dan titik tujuan
  function tampilkanSlide(index) {
    semuaSlide.forEach(function (slide) {
      slide.classList.remove("slide-aktif");
    });
    semuaDot.forEach(function (dot) {
      dot.classList.remove("dot-aktif");
    });

    semuaSlide[index].classList.add("slide-aktif");
    semuaDot[index].classList.add("dot-aktif");
    indexAktif = index;
  }

  // TAHAP 3: hitung slide berikutnya/sebelumnya dengan modulus (%).
  // Modulus menjaga indeks tetap di antara 0 dan jumlah slide - 1,
  // jadi slide berputar kembali ke awal dan tidak pernah "keluar batas".
  function slideBerikutnya() {
    tampilkanSlide((indexAktif + 1) % semuaSlide.length);
  }
  function slideSebelumnya() {
    // ditambah panjang slide dulu supaya hasilnya tidak negatif
    tampilkanSlide((indexAktif - 1 + semuaSlide.length) % semuaSlide.length);
  }

  function mulaiAutoplay() {
    clearInterval(autoplay); // hapus timer lama agar tidak dobel
    autoplay = setInterval(slideBerikutnya, 6000); // ganti slide tiap 6 detik
  }

  tombolNext.addEventListener("click", function () {
    slideBerikutnya();
    mulaiAutoplay();
  });
  tombolPrev.addEventListener("click", function () {
    slideSebelumnya();
    mulaiAutoplay();
  });

  tampilkanSlide(0);
  mulaiAutoplay();
}


/* ---------- 7. ACCORDION FAQ ---------- */
function initAccordionFAQ() {
  const semuaItem = document.querySelectorAll(".faq-item");

  semuaItem.forEach(function (item) {
    const tombol = item.querySelector(".faq-pertanyaan");
    const elemenJawaban = item.querySelector(".faq-jawaban");

    tombol.addEventListener("click", function () {
      // Catat dulu: apakah item ini sedang terbuka sebelum diklik?
      const sedangTerbuka = item.classList.contains("item-terbuka");

      // Tutup SEMUA item dulu, sehingga hanya satu jawaban terbuka dalam satu waktu
      semuaItem.forEach(function (lain) {
        lain.classList.remove("item-terbuka");
        lain.querySelector(".faq-jawaban").style.maxHeight = null;
        lain.querySelector(".faq-pertanyaan").setAttribute("aria-expanded", "false");
      });

      // Jika tadi tertutup, buka item ini.
      // CSS tidak bisa menganimasikan max-height ke "auto", jadi kita baca
      // tinggi asli isinya dengan scrollHeight lalu jadikan nilai max-height.
      if (!sedangTerbuka) {
        item.classList.add("item-terbuka");
        elemenJawaban.style.maxHeight = elemenJawaban.scrollHeight + "px";
        tombol.setAttribute("aria-expanded", "true");
      }
    });
  });
}


/* ---------- 8. FORMULIR KONTAK ---------- */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const elemenStatus = document.getElementById("status-form");

  // Fungsi bantu: tampilkan pesan umpan balik ("sukses" atau "gagal")
  function tampilkanStatus(pesan, jenis) {
    elemenStatus.textContent = pesan;
    elemenStatus.className = "status-form " + jenis;
  }

  form.addEventListener("submit", function (event) {
    // Cegah halaman dimuat ulang saat formulir dikirim
    event.preventDefault();

    // .value.trim() = ambil isi input dan buang spasi di awal/akhir
    const nama = document.getElementById("nama").value.trim();
    const email = document.getElementById("email").value.trim();
    const pesan = document.getElementById("pesan").value.trim();

    // Aturan 1: semua kolom wajib diisi
    if (nama === "" || email === "" || pesan === "") {
      tampilkanStatus("Semua kolom wajib diisi.", "gagal");
      return;
    }

    // Aturan 2: email harus mengandung tanda @
    if (!email.includes("@")) {
      tampilkanStatus("Format email belum benar.", "gagal");
      return;
    }

    // Aturan 3: pesan minimal 10 karakter
    if (pesan.length < 10) {
      tampilkanStatus("Pesan terlalu pendek (minimal 10 karakter).", "gagal");
      return;
    }

    // Lolos semua aturan.
    // Pada proyek nyata, data dikirim ke server memakai fetch().
    tampilkanStatus("Terima kasih, " + nama + "! Pesanmu sudah terkirim.", "sukses");
    form.reset();
  });
}


/* ---------- 9. TOMBOL KEMBALI KE ATAS ---------- */
function initBackToTopButton() {
  const tombol = document.getElementById("back-to-top");

  // Tombol baru muncul setelah halaman digulir lebih dari 500px
  window.addEventListener("scroll", function () {
    tombol.classList.toggle("tombol-tampil", window.scrollY > 500);
  });

  // Saat diklik, gulir halus ke posisi paling atas
  tombol.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}


/* ==================================================
   10. FITUR BARU: Reading Progress Bar

   Cara kerja:
   1. Ada satu <div id="progress-bar"> di paling atas layar.
      Lebarnya awalnya 0.
   2. Setiap halaman digulir, kita hitung sudah berapa persen
      halaman yang dibaca:
        - window.scrollY = jarak yang sudah digulir dari atas.
        - Jarak gulir maksimum = tinggi seluruh halaman dikurangi
          tinggi layar (document.documentElement.scrollHeight
          - window.innerHeight).
        - Persen = (jarak gulir / jarak gulir maksimum) x 100.
   3. Persen itu dipasang sebagai lebar bar (style.width).
      Bar memanjang dari kiri ke kanan mengikuti guliran, dan
      penuh 100% saat pengunjung sampai di bagian paling bawah.
   ================================================== */
function initReadingProgress() {
  const bar = document.getElementById("progress-bar");

  function perbaruiProgress() {
    const jarakGulir = window.scrollY;
    const jarakMaksimum = document.documentElement.scrollHeight - window.innerHeight;

    // Jika halaman terlalu pendek untuk digulir, hindari pembagian dengan 0
    const persen = jarakMaksimum > 0 ? (jarakGulir / jarakMaksimum) * 100 : 0;

    bar.style.width = persen + "%";
  }

  window.addEventListener("scroll", perbaruiProgress);
  perbaruiProgress();
}


/* ==================================================
   MENJALANKAN SEMUA FITUR
   Jadi, jika ingin mematikan satu fiturkita hanya 
   perlu beri komentar pada satu barisnya saja.
   ================================================== */
initDarkMode();
initHamburgerMenu();
initNavbarScrollEffects();
initCounterAnimation();
initPortfolioFilter();
initTestimonialSlider();
initAccordionFAQ();
initContactForm();
initBackToTopButton();
initReadingProgress(); // fitur baru