// ===== Fungsi generik untuk memuat data JSON =====
async function muatDaftar(namaFile, daftarKunci) {
    const tbody = document.querySelector(
        ".table-responsive table tbody"
    );

    const loading = document.getElementById(
        "loading-indicator"
    );

    if (!tbody) return;

    loading.style.display = "block";
    tbody.innerHTML = "";

    try {
// Simulasi koneksi lambat: 3 detik
await new Promise(function (resolve) {
    setTimeout(resolve, 3000);
});

        const res = await fetch(
            "../data/" + namaFile
        );

        if (!res.ok) {
            throw new Error(
                "Gagal mengambil data (status " +
                res.status +
                ")"
            );
        }

        const daftarData = await res.json();

        daftarData.forEach(function (data) {
            const tr = document.createElement("tr");

            // Membuat <td> berdasarkan daftar key
            daftarKunci.forEach(function (kunci) {
                const td = document.createElement("td");

                td.textContent = data[kunci];

                tr.appendChild(td);
            });

            // Kolom aksi
            const tdAksi = document.createElement("td");

            tdAksi.innerHTML =
                '<button type="button">Edit</button> ' +
                '<button type="button" class="btn-hapus">Hapus</button>';

            tr.appendChild(tdAksi);

            tbody.appendChild(tr);
        });

    } catch (err) {
        tbody.innerHTML =
            "<tr><td colspan=\"" +
            (daftarKunci.length + 1) +
            "\">" +
            "Gagal memuat data: " +
            err.message +
            "</td></tr>";

    } finally {
        loading.style.display = "none";
    }
}


// ===== Otomatis membaca konfigurasi dari HTML =====
document.addEventListener(
    "DOMContentLoaded",
    function () {

        const body = document.body;

        const namaFile =
            body.dataset.json;

        const daftarKunci =
            body.dataset.keys
                .split(",")
                .map(function (key) {
                    return key.trim();
                });

        // Jalankan fungsi generik
        muatDaftar(
            namaFile,
            daftarKunci
        );
    }
);
