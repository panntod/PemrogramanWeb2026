<?php
session_start();

require __DIR__ . '/../includes/koneksi.php';

// Hanya menerima request POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: list.php');
    exit;
}

// Validasi ID
$id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);

if (!$id || $id < 1) {
    $_SESSION['flash'] = [
        'type' => 'error',
        'pesan' => 'ID buku tidak valid.'
    ];

    header('Location: list.php');
    exit;
}

try {
    // Hapus buku berdasarkan ID
    $stmt = $pdo->prepare(
        'DELETE FROM buku WHERE id = :id'
    );

    $stmt->execute(['id' => $id]);

    // Periksa apakah ada baris yang benar-benar terhapus
    if ($stmt->rowCount() > 0) {
        $_SESSION['flash'] = [
            'type' => 'success',
            'pesan' => 'Buku berhasil dihapus.'
        ];
    } else {
        $_SESSION['flash'] = [
            'type' => 'error',
            'pesan' => 'Buku tidak ditemukan atau sudah dihapus.'
        ];
    }
} catch (PDOException $e) {
    error_log('Gagal menghapus buku: ' . $e->getMessage());

    $_SESSION['flash'] = [
        'type' => 'error',
        'pesan' => 'Gagal menghapus buku. Periksa relasi database atau log error.'
    ];
}

header('Location: list.php');
exit;
