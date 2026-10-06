// ============================================================
// DATA MOCK — TokoPintar
// Kategori produk berperan sebagai "genre" (elemen himpunan)
// dalam sistem rekomendasi berbasis irisan minat.
// ============================================================

export const KATEGORI = [
  'Elektronik',
  'Fashion',
  'Olahraga',
  'Buku',
  'Rumah Tangga',
  'Mainan & Hobi',
]

// Himpunan semesta U — seluruh kategori yang tersedia di platform
export const U = KATEGORI

// Rating dipetakan ke "bintang" sebagai himpunan kecocokan kedua
// (kriteria rating pada skor gabungan: w2 = 0.3)
export const SEMUA_RATING = [3, 4, 5]

let idCounter = 1
const p = (nama, harga, kategori, tags, rating, tren = false, gambar) => ({
  id: idCounter++,
  nama,
  harga,
  kategori,
  tags,
  rating,
  tren,
  gambar,
})

export const PRODUK = [
  // Elektronik
  p('Headphone Wireless ProX', 2044300, 'Elektronik', ['audio', 'wireless', 'musik'], 5, true, '/produk/headphone.jpg'),
  p('Smartwatch FitLine X2', 249000, 'Elektronik', ['wearable', 'kebugaran'], 4, true, '/produk/smartwatch.jpg'),
  p('Speaker Bluetooth MiniBoom', 129000, 'Elektronik', ['audio', 'portable'], 4, false, '/produk/speaker.jpg'),
  p('Powerbank 20000mAh UltraCharge', 259000, 'Elektronik', ['aksesoris', 'portable'], 4, false, '/produk/powerbank.jpg'),
  // Fashion
  p('Kaos Oversize Basic Cotton', 47900, 'Fashion', ['kasual', 'pakaian'], 4, true, '/produk/tshirt.jpg'),
  p('Sepatu Sneakers UrbanStep', 229000, 'Fashion', ['sepatu', 'kasual'], 5, true, '/produk/sneakers.jpg'),
  p('Tas Ransel DailyPack 25L', 175000, 'Fashion', ['tas', 'kasual'], 4, false, '/produk/backpack.jpg'),
  p('Jaket Hoodie Fleece WarmCozy', 280644, 'Fashion', ['pakaian', 'kasual'], 4, false, '/produk/hoodie.jpg'),
  // Olahraga
  p('Matras Yoga Anti-Slip 6mm', 57500, 'Olahraga', ['yoga', 'kebugaran'], 5, false, '/produk/yoga.jpg'),
  p('Dumbbell Set 10kg IronFit', 320000, 'Olahraga', ['angkat beban', 'kebugaran'], 4, true, '/produk/dumbbells.jpg'),
  p('Sepeda Lipat CityGo 20"', 1650000, 'Olahraga', ['sepeda', 'outdoor'], 5, false, '/produk/bicycle.jpg'),
  p('Botol Minum Sport 1L', 42700, 'Olahraga', ['aksesoris', 'kebugaran'], 3, false, '/produk/bottle.jpg'),
  // Buku
  p('Buku "Matematika Diskrit" — Munir', 50000, 'Buku', ['pendidikan', 'sains'], 5, true, '/produk/math-book.jpg'),
  p('Buku "Introduction to Algorithms"', 207000, 'Buku', ['pendidikan', 'sains'], 5, false, '/produk/algorithms.jpg'),
  p('Novel "Laskar Pelangi"', 89100, 'Buku', ['sastra', 'hiburan'], 5, false, '/produk/novel.jpg'),
  p('Buku "Atomic Habits"', 108000, 'Buku', ['pengembangan diri'], 4, true, '/produk/habits.jpg'),
  // Rumah Tangga
  p('Rice Cooker Digital 1.8L', 489000, 'Rumah Tangga', ['dapur', 'perabot'], 4, false, '/produk/rice-cooker.jpg'),
  p('Vacuum Cleaner Cordless CleanMax', 450000, 'Rumah Tangga', ['kebersihan', 'perabot'], 4, true, '/produk/vacuum.jpg'),
  p('Set Lampu Tidur LED WarmGlow', 55000, 'Rumah Tangga', ['dekorasi', 'cahaya'], 4, false, '/produk/lamp.jpg'),
  p('Air Fryer 4.5L CrispyChef', 549000, 'Rumah Tangga', ['dapur', 'perabot'], 5, true, '/produk/air-fryer.jpg'),
  // Mainan & Hobi
  p('Puzzle 1000 Piece Pemandangan', 85000, 'Mainan & Hobi', ['puzzle', 'keluarga'], 4, false, '/produk/puzzle.jpg'),
  p('Set Drone Kamera MiniFly', 399000, 'Mainan & Hobi', ['drone', 'outdoor', 'teknologi'], 4, true, '/produk/drone.jpg'),
  p('Lego Classic Creative Bricks 500pcs', 129000, 'Mainan & Hobi', ['konstruksi', 'keluarga'], 5, false, '/produk/bricks.jpg'),
  p('Papan Catur Kayu Premium', 144900, 'Mainan & Hobi', ['strategi', 'keluarga'], 5, false, '/produk/chess.jpg'),
]

// ------------------------------------------------------------
// PROFIL PENGGUNA DEFAULT
// A = himpunan minat pengguna (dapat diubah lewat UI)
// ratingSuka = himpunan rating yang biasa disukai pengguna
// riwayat = barisan R = (r1, r2, ..., rt) minat per periode/sesi
//
// Prinsip "mulai kosong": kunjungan pertama TIDAK punya pilihan awal —
// minat dan riwayat dikosongkan agar semua skor lahir dari pilihan user
// sendiri. Nilai tersimpan per perangkat di database (lihat lib/penyimpanan.js)
// sehingga refresh tidak menghapus apa pun.
// ------------------------------------------------------------
export const USER_DEFAULT = {
  nama: 'Pengguna',
  minat: [],
  ratingSuka: [4, 5],
  riwayat: [],
}

// Himpunan B: kategori yang sedang tren (disimulasikan dari data penjualan)
export const hitungKategoriTren = (produk) => {
  const trenSet = new Set()
  for (const item of produk) if (item.tren) trenSet.add(item.kategori)
  return [...trenSet]
}
