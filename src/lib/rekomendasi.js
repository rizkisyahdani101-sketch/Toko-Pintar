// ============================================================
// MESIN REKOMENDASI — TokoPintar
// Implementasi langsung dari laporan Rekayasa Ide Kelompok 4:
//   1. Operasi himpunan (irisan, gabungan, komplemen, selisih)
//   2. Koefisien kemiripan Jaccard: J(A,B) = |A∩B| / |A∪B|
//   3. Notasi sigma: S(u,i) = Σ w_k · J_k(u,i)
//   4. Barisan riwayat minat R = (r1, r2, ..., rt)
//   5. Analisis kompleksitas O(m × n × k)
// ============================================================

// ---------- 1. OPERASI HIMPUNAN DASAR ----------
// Representasi memakai Set (hash set) — operasi irisan O(k)

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

// Komplemen Aᶜ = U − A (diversifikasi / anti filter bubble)
export const komplemen = (A, U) => {
  const hasil = new Set(U)
  for (const x of A) hasil.delete(x)
  return hasil
}

// Selisih B − A (genre/item tren yang belum disukai pengguna)
export const selisih = (A, B) => {
  const hasil = new Set(B)
  for (const x of A) hasil.delete(x)
  return hasil
}

// ---------- 2. KOEFISIEN KEMIRIPAN JACCARD ----------
// J : P(U) × P(U) → [0, 1]
export const jaccard = (A, B) => {
  const gab = gabungan(A, B)
  if (gab.size === 0) return 0
  return irisan(A, B).size / gab.size
}

// ---------- 3. SKOR BERBOBOT (NOTASI SIGMA) ----------
// S(u, i) = Σ (k=1..n) w_k · J_k(u, i)
export const BOBOT = { genre: 0.6, rating: 0.3, tren: 0.1 }

export const hitungSkor = (userSet, itemSet, bobot) => {
  return jaccard(userSet, itemSet) * bobot
}

// Rincian skor per kriteria — dipakai untuk panel "Kenapa direkomendasikan?"
export const rincianSkor = (user, item, kategoriTren, bobot = BOBOT) => {
  const A = keHimpunan(user.minat)
  const B = keHimpunan([item.kategori])
  const R = keHimpunan(user.ratingSuka)
  const RB = keHimpunan([item.rating])
  const T = keHimpunan(kategoriTren)

  const dGenre = hitungSkor(A, B, bobot.genre)
  const dRating = hitungSkor(R, RB, bobot.rating)
  const dTren = hitungSkor(A, T, bobot.tren)

  return {
    genre: dGenre,
    rating: dRating,
    tren: dTren,
    total: dGenre + dRating + dTren, // notasi sigma
    detail: {
      irisanGenre: [...irisan(A, B)],
      gabunganGenre: [...gabungan(A, B)],
      jaccardGenre: jaccard(A, B),
      jaccardRating: jaccard(R, RB),
      jaccardTren: jaccard(A, T),
    },
  }
}

// ---------- 4. PERANGKINGAN + DIVERSIFIKASI ----------
export const rekomendasikan = (user, daftarItem, kategoriTren, topN = 8, bobot = BOBOT) => {
  const A = keHimpunan(user.minat)
  const T = keHimpunan(kategoriTren)
  const selisihTren = selisih(A, T) // B − A: tren yang belum disukai
  const komplemenA = komplemen(A, kategoriTren.length ? kategoriTren : user.minat)

  const skorList = daftarItem.map((item) => ({
    item,
    ...rincianSkor(user, item, kategoriTren, bobot),
  }))

  // Urutkan menurun berdasarkan skor total
  skorList.sort((a, b) => b.total - a.total)

  const utama = skorList.slice(0, topN)

  // Diversifikasi: sisipkan 2 item dari selisih tren (B − A) di posisi acak
  const kandidatDiv = skorList.filter(
    (s) => selisihTren.has(s.item.kategori) && !utama.some((u) => u.item.id === s.item.id)
  )
  const diversifikasi = kandidatDiv.slice(0, 2)

  const hasil = [...utama]
  const posisi = Math.max(2, Math.floor(topN / 2))
  for (const d of diversifikasi) {
    hasil.splice(Math.min(posisi, hasil.length), 0, { ...d, diversifikasi: true })
  }

  return { utama, diversifikasi, hasil: hasil.slice(0, topN + diversifikasi.length) }
}

// ---------- 5. BARISAN RIWAYAT MINAT ----------
// R = (r1, r2, ..., rt) — deteksi pergeseran minat antar periode
export const pergeseranMinat = (riwayat) => {
  if (riwayat.length < 2) return { baru: [], hilang: [], stabil: true }
  const sekarang = keHimpunan(riwayat[riwayat.length - 1])
  const sebelum = keHimpunan(riwayat[riwayat.length - 2])
  return {
    baru: [...selisih(sebelum, sekarang)], // muncul di periode ini
    hilang: [...selisih(sekarang, sebelum)], // tidak lagi disukai
    stabil: false,
  }
}

// Skor Jaccard antar periode — seberapa stabil minat pengguna
export const stabilitasMinat = (riwayat) => {
  if (riwayat.length < 2) return 1
  const sekarang = keHimpunan(riwayat[riwayat.length - 1])
  const sebelum = keHimpunan(riwayat[riwayat.length - 2])
  return jaccard(sebelum, sekarang)
}

// ---------- 6. ANALISIS KOMPLEKSITAS (BIG-O) ----------
// Naif: O(m × n × k) — m pengguna, n item, k rata-rata ukuran himpunan
export const estimasiOperasi = (m, n, k) => m * n * k

// Dengan pre-filtering (mis. hanya 20% kandidat lolos filter genre)
export const estimasiOperasiPrefilter = (m, n, k, rasioFilter = 0.2) =>
  m * n * rasioFilter * k + m * n // + biaya filter O(m×n)
