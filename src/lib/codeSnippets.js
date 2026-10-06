// ============================================================
// POTONGAN KODE — ditampilkan di halaman "Himpunan & Barisan"
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
}

// Koefisien kemiripan Jaccard: J(A, B) = |A ∩ B| / |A ∪ B|
export const jaccard = (A, B) => {
  const gab = gabungan(A, B)
  if (gab.size === 0) return 0
  return irisan(A, B).size / gab.size
}

// Koefisien tumpang tindih: O(A, B) = |A ∩ B| / min(|A|, |B|)
// Bernilai 1 saat semua elemen B tercakup di A — dasar skor kecocokan
// (skor mencapai 100% saat kategori ∈ minat, rating ∈ ratingSuka, item tren)
export const overlap = (A, B) => {
  if (A.size === 0 || B.size === 0) return 0
  return irisan(A, B).size / Math.min(A.size, B.size)
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
