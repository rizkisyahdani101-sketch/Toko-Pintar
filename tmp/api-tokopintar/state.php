<?php
/**
 * TokoPintar — API state perangkat (Laragon / MySQL)
 *
 * GET  /state.php?id=<device_id>  -> { ok, data }   (data = null bila perangkat baru)
 * POST /state.php                 { id, data }     -> simpan (upsert)
 *
 * Tanpa login: identitas = ID acak yang dibuat di browser (anonim).
 * Prototipe kuliah — bukan untuk produksi.
 */

declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

const DB = [
  'host' => '127.0.0.1',
  'name' => 'tokopintar',
  'user' => 'root',
  'pass' => '',
];

// Kunci yang boleh disimpan — apa pun di luar ini dibuang (bukan sandingan,
// tapi disaring) agar state tidak bisa dipenuhi sampah.
const KUNCI_STATE = ['minat', 'ratingSuka', 'keranjang', 'wishlist', 'riwayat', 'pesanan'];

function balas(array $isi, int $kode = 200): void
{
    http_response_code($kode);
    echo json_encode($isi, JSON_UNESCAPED_UNICODE);
    exit;
}

function gagal(string $pesan, int $kode = 400): void
{
    balas(['ok' => false, 'error' => $pesan], $kode);
}

try {
    $pdo = new PDO(
        'mysql:host=' . DB['host'] . ';dbname=' . DB['name'] . ';charset=utf8mb4',
        DB['user'],
        DB['pass'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
    );
} catch (PDOException $e) {
    gagal('Koneksi database gagal', 500);
}

$metode = $_SERVER['REQUEST_METHOD'];

// ---------- GET: ambil state ----------
if ($metode === 'GET') {
    $id = $_GET['id'] ?? '';
    if (!is_string($id) || !preg_match('/^[a-f0-9]{64}$/', $id)) {
        gagal('id tidak valid');
    }
    $stmt = $pdo->prepare('SELECT data_state FROM state_perangkat WHERE device_id = ?');
    $stmt->execute([$id]);
    $baris = $stmt->fetch();
    balas(['ok' => true, 'data' => $baris ? json_decode($baris['data_state'], true) : null]);
}

// ---------- POST: simpan state ----------
if ($metode === 'POST') {
    $isi = json_decode(file_get_contents('php://input'), true);
    if (!is_array($isi)) gagal('body JSON tidak valid');

    $id = $isi['id'] ?? '';
    if (!is_string($id) || !preg_match('/^[a-f0-9]{64}$/', $id)) {
        gagal('id tidak valid');
    }

    $data = $isi['data'] ?? null;
    if (!is_array($data)) gagal('data tidak valid');

    $bersih = [];
    foreach (KUNCI_STATE as $k) {
        if (array_key_exists($k, $data)) {
            $bersih[$k] = $data[$k];
        }
    }

    $json = json_encode($bersih, JSON_UNESCAPED_UNICODE);
    if ($json === false) gagal('data tidak bisa diserialisasi', 500);

    $stmt = $pdo->prepare(
        'INSERT INTO state_perangkat (device_id, data_state) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE data_state = VALUES(data_state)'
    );
    $stmt->execute([$id, $json]);
    balas(['ok' => true]);
}

gagal('Metode tidak didukung', 405);
