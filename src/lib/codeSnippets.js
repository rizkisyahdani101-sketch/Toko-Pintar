// ============================================================
// POTONGAN KODE — ditampilkan di halaman "Logika Matematika"
// Kode asli dari src/lib/rekomendasi.js (sumber tunggal kebenaran).
// ============================================================

export const KODE_HIMPUNAN = `// Operasi himpunan dasar — representasi memakai Set (hash set)
// U = himpunan semesta kategori, A = minat pengguna, B = kategori item

export const keHimpunan = (arr) => new Set(arr)

export const irisan = (A, B) => {
  const hasil = new Set()
  for (const x of A) if (B.has(x)) hasil.add(x)
  return hasil
}

export const gabungan = (A, B) => {
  const hasil = new Set(A)
  for (const x of B) hasil.add(x)
  return hasil
}

// Komplemen A^c = U − A (diversifikasi / anti filter bubble)
export const komplemen = (A, U) => {
  const hasil = new Set(U)
  for (const x of A) hasil.delete(x)
  return hasil
}

// Selisih B − A (kategori tren yang belum disukai pengguna)
export const selisih = (A, B) => {
  const hasil = new Set(B)
  for (const x of A) hasil.delete(x)
  return hasil
}`

export const KODE_JACCARD = `// Koefisien kemiripan Jaccard
// J : P(U) × P(U) → [0, 1]
// J(A, B) = |A ∩ B| / |A ∪ B|

export const jaccard = (A, B) => {
  const gab = gabungan(A, B)
  if (gab.size === 0) return 0
  return irisan(A, B).size / gab.size
}`

export const KODE_SIGMA = `// Skor berbobot (notasi sigma): S(u, i) = Σ w_k · J_k(u, i)
export const BOBOT = { genre: 0.6, rating: 0.3, tren: 0.1 }

export const hitungSkor = (userSet, itemSet, bobot) => {
  return jaccard(userSet, itemSet) * bobot
}

// Rincian skor per kriteria untuk satu item
export const rincianSkor = (user, item, kategoriTren, bobot = BOBOT) => {
  const A  = keHimpunan(user.minat)          // himpunan minat pengguna
  const B  = keHimpunan([item.kategori])     // himpunan kategori item
  const R  = keHimpunan(user.ratingSuka)     // rating yang disukai
  const RB = keHimpunan([item.rating])       // rating item
  const T  = keHimpunan(kategoriTren)        // kategori yang sedang tren

  const dGenre  = hitungSkor(A, B, bobot.genre)    // w1 = 0.6
  const dRating = hitungSkor(R, RB, bobot.rating)  // w2 = 0.3
  const dTren   = hitungSkor(A, T, bobot.tren)     // w3 = 0.1

  return {
    genre: dGenre,
    rating: dRating,
    tren: dTren,
    total: dGenre + dRating + dTren,  // ← notasi sigma
  }
}`

export const KODE_REKOMENDASI = `// Perangkingan + diversifikasi (anti filter bubble)
export const rekomendasikan = (user, daftarItem, kategoriTren, topN = 8) => {
  const A = keHimpunan(user.minat)
  const T = keHimpunan(kategoriTren)
  const selisihTren = selisih(A, T)      // B − A: tren yang belum disukai

  const skorList = daftarItem.map((item) => ({
    item,
    ...rincianSkor(user, item, kategoriTren),
  }))

  // Urutkan menurun berdasarkan skor total S(u, i)
  skorList.sort((a, b) => b.total - a.total)

  const utama = skorList.slice(0, topN)

  // Diversifikasi: sisipkan item dari B − A agar minat pengguna berkembang
  const kandidatDiv = skorList.filter(
    (s) => selisihTren.has(s.item.kategori) && !utama.some((u) => u.item.id === s.item.id)
  )
  const diversifikasi = kandidatDiv.slice(0, 2)

  const hasil = [...utama]
  const posisi = Math.max(2, Math.floor(topN / 2))
  for (const d of diversifikasi) {
    hasil.splice(Math.min(posisi, hasil.length), 0, { ...d, diversifikasi: true })
  }
  return { utama, diversifikasi, hasil }
}`

export const KODE_BARISAN = `// Barisan riwayat minat: R = (r1, r2, ..., rt)
// rt = himpunan kategori yang disukai pada periode t

// Deteksi pergeseran minat antar periode
export const pergeseranMinat = (riwayat) => {
  if (riwayat.length < 2) return { baru: [], hilang: [], stabil: true }
  const sekarang = keHimpunan(riwayat[riwayat.length - 1])
  const sebelum  = keHimpunan(riwayat[riwayat.length - 2])
  return {
    baru:   [...selisih(sebelum,  sekarang)], // muncul di periode ini
    hilang: [...selisih(sekarang, sebelum)],  // tidak lagi disukai
    stabil: false,
  }
}

// Stabilitas minat = Jaccard(r_{t-1}, r_t)
export const stabilitasMinat = (riwayat) => {
  if (riwayat.length < 2) return 1
  const sekarang = keHimpunan(riwayat[riwayat.length - 1])
  const sebelum  = keHimpunan(riwayat[riwayat.length - 2])
  return jaccard(sebelum, sekarang)
}`

export const KODE_BIG_O = `// Analisis kompleksitas (pertumbuhan fungsi)
// m = jumlah pengguna, n = jumlah item, k = rata-rata ukuran himpunan

// Pendekatan naif: hitung skor semua kombinasi pengguna-item
export const estimasiOperasi = (m, n, k) => m * n * k          // O(m × n × k)

// Dengan pre-filtering: hanya ±20% kandidat lolos filter genre
export const estimasiOperasiPrefilter = (m, n, k, rasioFilter = 0.2) =>
  m * n * rasioFilter * k + m * n   // + biaya filter O(m × n)`
