# 🛒 TokoPintar

Prototipe web e-commerce dengan **sistem rekomendasi berbasis irisan minat** — penerapan konsep
**Matematika Diskrit** — fokus **Himpunan** dan **Barisan** — sesuai laporan
*Rekayasa Ide — Kelompok 4, Ilmu Komputer FMIPA Universitas Negeri Medan 2026*.

## Fitur

- **Beranda** — rekomendasi produk dihitung dari himpunan minat (A ∩ B) lewat koefisien tumpang tindih
  O(A,B), plus barisan riwayat
- **Katalog** — filter kategori, pencarian, urutkan skor/harga/rating
- **Detail Produk** — panel *"Kenapa direkomendasikan?"*: langkah A∩B, A∪B, J(A,B), O(A,B), dan rincian wₖ·Oₖ
- **Keranjang + Checkout Simulasi** — tanpa pembayaran sungguhan (localStorage)
- **📚 Himpunan & Barisan** — 2 tab: teori + rumus, **kode program asli**, dan playground interaktif
  (operasi himpunan + Jaccard, barisan riwayat minat)
- **5 skala kecocokan** di tiap kartu produk: Tidak Cocok (0–20%), Kurang Cocok (21–35%),
  Cukup Cocok (36–65%), Cocok (66–99%), Sangat Cocok (hanya 100%)
- Dark mode, wishlist, deteksi pergeseran minat

## Rumus Inti

| Konsep | Rumus |
|---|---|
| Operasi himpunan | A ∩ B, A ∪ B, Aᶜ = U − A, B − A |
| Kemiripan Jaccard | J(A,B) = |A ∩ B| / |A ∪ B| |
| Tumpang tindih | O(A,B) = |A ∩ B| / min(|A|, |B|) — dasar skor, maks 100% |
| Barisan riwayat | R = (r₁, r₂, …, rₜ) — deteksi pergeseran minat |
| Skala kecocokan | 5 tingkat: Tidak → Kurang → Cukup → Cocok → Sangat Cocok (100% saja) |

## Menjalankan

```bash
npm install
npm run dev          # development
npm run build        # produksi
node skala.test.mjs  # uji skala 5 tingkat (Sangat Cocok hanya di 100%)
```

## Struktur

```
src/
├── lib/rekomendasi.js     # mesin: himpunan, Jaccard, diversifikasi, barisan, skala 5 kecocokan
├── lib/dataProduk.js      # mock data 24 produk (6 kategori)
├── lib/codeSnippets.js    # potongan kode untuk halaman Himpunan & Barisan
├── store/AppContext.jsx   # state global (minat, keranjang, wishlist, riwayat, tema)
├── components/            # Navbar, KartuProduk, PanelMinat, CodeBlock
└── pages/                 # Beranda, Katalog, DetailProduk, Keranjang, LogikaMatematika (2 tab)
```
