// ============================================================
// MESIN REKOMENDASI — TokoPintar
// Implementasi langsung dari laporan Rekayasa Ide Kelompok 4:
//   1. Operasi himpunan (irisan, gabungan, komplemen, selisih)
//   2. Kemiripan himpunan: Jaccard J(A,B) = |A∩B| / |A∪B| dan
//      koefisien tumpang tindih O(A,B) = |A∩B| / min(|A|,|B|)
//   3. Skor gabungan S(u,i) = Σ w_k · O_k(u,i) ∈ [0,1] — bernilai 1.00 (100%)
//      saat semua atribut item cocok: kategori ∈ minat, rating ∈ ratingSuka, dan item tren
//   4. Barisan riwayat minat R = (r1, r2, ..., rt)
//   5. Skala kecocokan 5 tingkat (SKALA_KECOCKAN)
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

// Ringkasan analisis himpunan untuk dashboard — satu pemilik logika agar
// UI tidak menghitung ulang irisan/komplemen/selisih secara tersebar.
// A = minat pengguna, T = kategori tren, U = semesta kategori.
export const ringkasanHimpunan = (minatArr, kategoriTren, semestaKategori) => {
  const A = keHimpunan(minatArr)
  const T = keHimpunan(kategoriTren)
  const U = keHimpunan(semestaKategori)
  return {
    A,
    T,
    Ac: komplemen(A, U), // Aᶜ = U − A (diversifikasi / anti filter bubble)
    irisanAT: irisan(A, T), // A ∩ B (kategori favorit yang sedang tren)
    selisihTA: selisih(A, T), // B − A (tren yang belum diminati)
  }
}

// Format himpunan ke notasi matematika "{ a, b }" — "∅" saat kosong.
export const tulisHimpunan = (himpunan) => `{ ${[...himpunan].join(', ') || '∅'} }`

// ---------- 2. KOEFISIEN KEMIRIPAN JACCARD ----------
// J : P(U) × P(U) → [0, 1]
export const jaccard = (A, B) => {
  const gab = gabungan(A, B)
  if (gab.size === 0) return 0
  return irisan(A, B).size / gab.size
}

// Koefisien tumpang tindih (overlap): O : P(U) × P(U) → [0, 1]
// O(A, B) = |A ∩ B| / min(|A|, |B|) — bernilai 1 tepat saat semua elemen B
// tercakup di A (untuk himpunan satu elemen: keanggotaan B ⊆ A). Inilah yang
// membuat skor bisa mencapai 100% saat atribut item benar-benar cocok.
export const overlap = (A, B) => {
  if (A.size === 0 || B.size === 0) return 0
  return irisan(A, B).size / Math.min(A.size, B.size)
}

// ---------- 3. SKOR BERBOBOT (NOTASI SIGMA) ----------
// S(u, i) = Σ (k=1..n) w_k · O_k(u, i),  S ∈ [0, 1]
export const BOBOT = { genre: 0.6, rating: 0.3, tren: 0.1 }

export const hitungSkor = (preferensiSet, atributSet, bobot) => {
  return overlap(preferensiSet, atributSet) * bobot
}

// Rincian skor per kriteria — dipakai untuk panel "Kenapa direkomendasikan?"
export const rincianSkor = (user, item, kategoriTren, bobot = BOBOT) => {
  const A = keHimpunan(user.minat)
  const B = keHimpunan([item.kategori])
  const R = keHimpunan(user.ratingSuka)
  const RB = keHimpunan([item.rating])
  const T = keHimpunan(kategoriTren)
  // Himpunan atribut "tren" milik item: {kategori} bila item sedang tren, ∅ jika tidak
  const I = keHimpunan(item.tren ? [item.kategori] : [])

  const dGenre = hitungSkor(A, B, bobot.genre) // 1.0 bila kategori ∈ minat
  const dRating = hitungSkor(R, RB, bobot.rating) // 1.0 bila rating ∈ ratingSuka
  const dTren = hitungSkor(T, I, bobot.tren) // 1.0 bila item sedang tren

  return {
    genre: dGenre,
    rating: dRating,
    tren: dTren,
    total: dGenre + dRating + dTren, // skor gabungan
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

// ---------- 6. SKALA KECOCOKAN (5 TINGKAT) ----------
// Memetakan persen skor S(u,i) ke 5 label kecocokan untuk badge di UI.
// Struktur band baru: "Sangat Cocok" DIKUNCI hanya di skor 100% (skor sempurna);
// skor dapat mencapai 100% karena setiap komponen memakai koefisien tumpang tindih
// yang bernilai 1 saat atribut item cocok seluruhnya.
export const SKALA_KECOCKAN = [
  {
    label: "Tidak Cocok",
    min: 0,
    max: 20,
    warna: "bg-rose-100 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:ring-rose-800",
    bar: "bg-rose-500",
  },
  {
    label: "Kurang Cocok",
    min: 21,
    max: 35,
    warna: "bg-orange-100 text-orange-700 ring-1 ring-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:ring-orange-800",
    bar: "bg-orange-500",
  },
  {
    label: "Cukup Cocok",
    min: 36,
    max: 65,
    warna: "bg-amber-100 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:ring-amber-800",
    bar: "bg-amber-500",
  },
  {
    label: "Cocok",
    min: 66,
    max: 99,
    warna: "bg-sky-100 text-sky-700 ring-1 ring-sky-200 dark:bg-sky-900/40 dark:text-sky-300 dark:ring-sky-800",
    bar: "bg-sky-500",
  },
  {
    label: "Sangat Cocok",
    min: 100,
    max: 100,
    warna: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:ring-emerald-800",
    bar: "bg-emerald-500",
  },
]

// skalaKecocokan(persen) -> entri SKALA_KECOCKAN yang sesuai (dibulatkan dan dibatasi 0..100)
export const skalaKecocokan = (persen) => {
  const p = Math.max(0, Math.min(100, Math.round(persen)))
  for (const s of SKALA_KECOCKAN) {
    if (p >= s.min && p <= s.max) return s
  }
  return SKALA_KECOCKAN[0]
}
