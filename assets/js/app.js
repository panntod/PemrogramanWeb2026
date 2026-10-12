// ===== Hamburger menu (JS-driven, menggantikan checkbox hack) =====
function initNavToggle() {
  const toggleBtn = document.getElementById("nav-toggle-btn");
  const nav = document.querySelector("header nav");
  if (!toggleBtn || !nav) return;

  toggleBtn.addEventListener("click", function () {
    nav.classList.toggle("nav-open");
  });
}

// ===== Konfirmasi hapus =====
// Tombol Hapus kini berada di dalam <form class="form-hapus" method="post">
// yang benar-benar mengirim request DELETE ke server (buku/hapus.php,
// anggota/hapus.php). Konfirmasi dilakukan pada event "submit" agar bisa
// dibatalkan (preventDefault) sebelum request terkirim.
function initHapusConfirm() {
  document.querySelectorAll("form.form-hapus").forEach(function (form) {
    if (form.dataset.confirmInit === "true") return;
    form.dataset.confirmInit = "true";

    form.addEventListener("submit", function (e) {
      const row = form.closest("tr");
      const kolomPertama = row?.querySelector("td");
      const nama = kolomPertama?.textContent.trim() || "data ini";

      const yakin = window.confirm(`Yakin ingin menghapus "${nama}"?`);

      if (!yakin) {
        e.preventDefault();
      }
    });
  });
}

// ===== Validasi form (client-side) =====
function tampilkanError(input, pesan) {
  hapusError(input);
  const span = document.createElement("span");
  span.className = "error";
  span.textContent = pesan;
  input.insertAdjacentElement("afterend", span);
}

function hapusError(input) {
  const next = input.nextElementSibling;
  if (next && next.classList.contains("error")) {
    next.remove();
  }
}

function initValidasiForm() {
  const form = document.getElementById("form-tambah");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    let valid = true;

    const judul = form.querySelector("[name='judul'], [name='nama']");
    if (judul && judul.value.trim() === "") {
      tampilkanError(judul, "Field ini wajib diisi.");
      valid = false;
    } else if (judul) {
      hapusError(judul);
    }

    const pengarang = form.querySelector("[name='pengarang']");
    if (pengarang && pengarang.value.trim() === "") {
      tampilkanError(pengarang, "Pengarang wajib diisi.");
      valid = false;
    } else if (pengarang) {
      hapusError(pengarang);
    }

    const tahun = form.querySelector("[name='tahun']");
    if (tahun) {
      const nilai = parseInt(tahun.value, 10);
      if (isNaN(nilai) || nilai < 1900 || nilai > 2026) {
        tampilkanError(tahun, "Tahun harus di antara 1900-2026.");
        valid = false;
      } else {
        hapusError(tahun);
      }
    }

    const stok = form.querySelector("[name='stok']");
    if (stok) {
      const nilai = parseInt(stok.value, 10);
      if (isNaN(nilai) || nilai < 0) {
        tampilkanError(stok, "Stok tidak boleh negatif.");
        valid = false;
      } else {
        hapusError(stok);
      }
    }

    // ===== Validasi ISBN =====
    // ISBN bersifat tidak wajib.
    // Jika diisi, hanya boleh angka dan tanda hubung.
    const isbn = form.querySelector("[name='isbn']");

    if (isbn) {
      const nilaiISBN = isbn.value.trim();

      if (nilaiISBN !== "" && !/^[0-9-]+$/.test(nilaiISBN)) {
        tampilkanError(
          isbn,
          "ISBN hanya boleh berisi angka dan tanda hubung (-).",
        );
        valid = false;
      } else {
        hapusError(isbn);
      }
    }

    if (!valid) {
      e.preventDefault();
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initNavToggle();
  initHapusConfirm();
  initValidasiForm();
});
