<?php
session_start();

require __DIR__ . '/../includes/koneksi.php';

// Hanya menerima request POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: list.php');
    exit;
}

// Validasi ID buku
$id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);

if ($id === false || $id === null || $id < 1) {
    $_SESSION['flash'] = [
        'type' => 'error',
        'pesan' => 'ID buku tidak valid.'
    ];

    header('Location: list.php');
    exit;
}

try {
    // Pastikan buku tersedia
    $cek = $pdo->prepare('SELECT id FROM buku WHERE id = :id');
    $cek->execute(['id' => $id]);

    if (!$cek->fetch()) {
        $_SESSION['flash'] = [
            'type' => 'error',
            'pesan' => 'Buku tidak ditemukan atau sudah dihapus.'
        ];

        header('Location: list.php');
        exit;
    }

    // Hapus data buku
    $stmt = $pdo->prepare('DELETE FROM buku WHERE id = :id');
    $stmt->execute(['id' => $id]);

    $_SESSION['flash'] = [
        'type' => 'success',
        'pesan' => 'Buku berhasil dihapus.'
    ];

} catch (PDOException $e) {
    error_log('Gagal menghapus buku: ' . $e->getMessage());

    $_SESSION['flash'] = [
        'type' => 'error',
        'pesan' => 'Buku gagal dihapus. Periksa relasi database.'
    ];
}

// Kembali ke daftar buku
header('Location: list.php');
exit;
