# 🛒 TokoPintar

Prototipe web e-commerce dengan **sistem rekomendasi berbasis irisan minat** — penerapan konsep
**Matematika Diskrit** (Himpunan, Fungsi, Barisan, Notasi Sigma, Pertumbuhan Fungsi) sesuai laporan
*Rekayasa Ide — Kelompok 4, Ilmu Komputer FMIPA Universitas Negeri Medan 2026*.

## Fitur

- **Beranda** — rekomendasi produk dihitung dari irisan minat (A ∩ B), skor Jaccard, dan sigma berbobot
- **Katalog** — filter kategori, pencarian, urutkan skor/harga/rating
- **Detail Produk** — panel *"Kenapa direkomendasikan?"*: langkah A∩B, A∪B, J(A,B), dan rincian wₖ·Jₖ
- **Keranjang + Checkout Simulasi** — tanpa pembayaran sungguhan (localStorage)
- **🧮 Logika Matematika & Kode** — tab per konsep: teori + rumus, **kode program asli**, dan playground
  interaktif (operasi himpunan, slider bobot sigma, barisan riwayat minat, kalkulator O(m×n×k))
- Dark mode, wishlist, badge skor kecocokan di tiap kartu, deteksi pergeseran minat

## Rumus Inti

| Konsep | Rumus |
|---|---|
| Kemiripan Jaccard | J(A,B) = \|A ∩ B\| / \|A ∪ B\| |
| Skor gabungan | S(u,i) = Σ wₖ·Jₖ(u,i) — w = 0.6 (kategori) + 0.3 (rating) + 0.1 (tren) |
| Kompleksitas | O(m × n × k), dioptimasi dengan pre-filtering |

## Menjalankan

```bash
npm install
npm run dev      # development
npm run build    # produksi
```

## Struktur

```
src/
├── lib/rekomendasi.js     # mesin: himpunan, Jaccard, sigma, diversifikasi, barisan, Big-O
├── lib/dataProduk.js      # mock data 24 produk (6 kategori)
├── lib/codeSnippets.js    # potongan kode untuk halaman Logika Matematika
├── store/AppContext.jsx   # state global (minat, keranjang, wishlist, riwayat, tema)
├── components/            # Navbar, KartuProduk, PanelMinat, CodeBlock
└── pages/                 # Beranda, Katalog, DetailProduk, Keranjang, LogikaMatematika
```
