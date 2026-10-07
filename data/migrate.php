<?php

require '../includes/koneksi.php';

$file = __DIR__ . '/buku.json';

if (!file_exists($file)) {
    die("File data/buku.json tidak ditemukan.\n");
}

$json = file_get_contents($file);

$data = json_decode($json, true);

if ($data === null) {
    die("Gagal membaca JSON.\n");
}

$stmt = $pdo->prepare(
    "INSERT INTO buku (
        judul,
        pengarang,
        tahun,
        stok,
        kategori
    )
    VALUES (
        :judul,
        :pengarang,
        :tahun,
        :stok,
        :kategori
    )"
);

foreach ($data as $buku) {

    $stmt->execute([
        'judul' => $buku['judul'],
        'pengarang' => $buku['pengarang'],
        'tahun' => $buku['tahun'],
        'stok' => $buku['stok'],
        'kategori' => $buku['kategori'],
    ]);

    echo "Berhasil memasukkan: "
        . $buku['judul']
        . PHP_EOL;
}

echo "Migrasi selesai.\n";