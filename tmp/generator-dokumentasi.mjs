// ============================================================
// Generator dokumentasi TokoPintar (.docx)
// Jalankan dari root proyek: node tmp/generator-dokumentasi.mjs
// ============================================================
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle,
  LevelFormat, PageBreak, Footer, PageNumber, TableOfContents,
} from 'docx'
import { writeFileSync } from 'node:fs'

const NAVY = '1F3864'
const ABU = 'F2F2F2'
const VIOLET = '6D28D9'

// ---------- helper ----------
const p = (teks, { bold = false, italics = false, size = 22, before = 0, after = 120, align } = {}) =>
  new Paragraph({
    alignment: align,
    spacing: { before, after },
    children: [new TextRun({ text: teks, bold, italics, size, font: 'Calibri' })],
  })

const pRuns = (runs, opts = {}) =>
  new Paragraph({ spacing: { after: 120, ...(opts.spacing || {}) }, children: runs })

const r = (teks, opt = {}) => new TextRun({ text: teks, size: 22, font: 'Calibri', ...opt })

const h1 = (teks) => new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 320, after: 160 }, children: [new TextRun({ text: teks, bold: true, size: 32, color: NAVY, font: 'Calibri' })] })
const h2 = (teks) => new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 120 }, children: [new TextRun({ text: teks, bold: true, size: 26, color: VIOLET, font: 'Calibri' })] })
const h3 = (teks) => new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 180, after: 100 }, children: [new TextRun({ text: teks, bold: true, size: 23, color: '444444', font: 'Calibri' })] })

const bullet = (teks, level = 0) =>
  new Paragraph({
    numbering: { reference: 'bullets', level },
    spacing: { after: 80 },
    children: [new TextRun({ text: teks, size: 22, font: 'Calibri' })],
  })

const bulletRuns = (runs, level = 0) =>
  new Paragraph({ numbering: { reference: 'bullets', level }, spacing: { after: 80 }, children: runs })

const num = (teks, level = 0) =>
  new Paragraph({
    numbering: { reference: 'langkah', level },
    spacing: { after: 80 },
    children: [new TextRun({ text: teks, size: 22, font: 'Calibri' })],
  })

const rumus = (teks) =>
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 100, after: 140 },
    children: [new TextRun({ text: teks, bold: true, size: 24, font: 'Cambria', color: NAVY })],
  })

const mono = (teks, { after = 140 } = {}) =>
  new Paragraph({
    spacing: { after },
    shading: { type: ShadingType.CLEAR, fill: ABU },
    children: [new TextRun({ text: teks, size: 20, font: 'Consolas' })],
  })

// ---------- tabel ----------
const LEBAR = 9840 // A4 area konten (DXA)
const borderTipis = { style: BorderStyle.SINGLE, size: 4, color: 'BBBBBB' }
const bordersTabel = { top: borderTipis, bottom: borderTipis, left: borderTipis, right: borderTipis, insideHorizontal: borderTipis, insideVertical: borderTipis }

const sel = (teks, { bold = false, fill, w } = {}) =>
  new TableCell({
    width: { size: w, type: WidthType.DXA },
    shading: fill ? { type: ShadingType.CLEAR, fill } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [new Paragraph({ children: [new TextRun({ text: teks, bold, size: 20, font: 'Calibri' })] })],
  })

const tabel = (lebarKolom, barisJudul, barisData) =>
  new Table({
    columnWidths: lebarKolom,
    width: { size: LEBAR, type: WidthType.DXA },
    borders: bordersTabel,
    rows: [
      new TableRow({ tableHeader: true, children: barisJudul.map((t, i) => sel(t, { bold: true, fill: 'DEEBF7', w: lebarKolom[i] })) }),
      ...barisData.map((baris) => new TableRow({ children: baris.map((t, i) => sel(t, { w: lebarKolom[i] })) })),
    ],
  })

const spasi = (after = 160) => new Paragraph({ spacing: { after }, children: [] })

// ============================================================
// KONTEN DOKUMEN
// ============================================================
const isi = []

// ---------- COVER ----------
isi.push(
  spasi(1800),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: 'TokoPintar', bold: true, size: 60, color: NAVY, font: 'Calibri' })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 }, children: [new TextRun({ text: 'Dokumentasi Sistem Rekomendasi Produk Berbasis Himpunan & Barisan', size: 28, color: '444444', font: 'Calibri' })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [new TextRun({ text: 'Matematika Diskrit — Kelompok 4', bold: true, size: 24, font: 'Calibri' })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [new TextRun({ text: 'Universitas Negeri Medan — 2026', size: 24, font: 'Calibri' })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [new TextRun({ text: 'Teknologi: React 19 · Vite 7 · Tailwind CSS · PHP (Laragon) · MySQL', size: 22, italics: true, color: '666666', font: 'Calibri' })] }),
  new Paragraph({ children: [new PageBreak()] }),
)

// ---------- DAFTAR ISI ----------
isi.push(h1('Daftar Isi'), new TableOfContents('Daftar Isi', { hyperlink: true, headingStyleRange: '1-2' }), new Paragraph({ children: [new PageBreak()] }))

// ---------- 1. PENDAHULUAN ----------
isi.push(
  h1('1. Pendahuluan'),
  p('TokoPintar adalah prototipe situs e-commerce yang membangun rekomendasi produk bukan dari promo atau popularitas, melainkan dari perhitungan Matematika Diskrit yang berjalan penuh di sisi klien: operasi himpunan untuk mencocokkan minat pengguna dengan atribut produk, dan barisan riwayat untuk mengikuti pergeseran minat dari waktu ke waktu.'),
  p('Setiap skor yang tampil di layar dapat dijelaskan sumber angkanya (0.6·kategori + 0.3·rating + 0.1·tren), sehingga pengguna dapat membuktikan mengapa sebuah produk direkomendasikan. Halaman "Himpunan & Barisan" bahkan menampilkan kode program asli yang dipakai mesin rekomendasi beserta playground interaktif.'),
  h2('1.1 Tujuan Dokumen'),
  bullet('Menjelaskan seluruh fitur TokoPintar beserta fungsi masing-masing.'),
  bullet('Mendokumentasikan alur lengkap: apa saja input, bagaimana proses, dan apa outputnya.'),
  bullet('Menegaskan hubungan setiap bagian sistem dengan materi Himpunan dan Barisan.'),
  bullet('Menjadi acuan anggota kelompok lain saat membaca atau mengubah kode.'),
  h2('1.2 Lingkup Sistem'),
  p('Sistem terdiri atas dua bagian: (1) aplikasi web React yang menangani tampilan dan seluruh perhitungan skor; (2) API PHP kecil di Laragon yang hanya menyimpan state perangkat (minat, keranjang, wishlist, riwayat, pesanan) ke MySQL agar data tidak hilang saat halaman dimuat ulang. Tidak ada akun/login — identitas memakai ID perangkat anonim 64 digit heksadesimal.'),
)

// ---------- 2. FITUR ----------
isi.push(
  h1('2. Fitur-Fitur Aplikasi'),
  num('Dashboard Beranda — ringkasan skor tertinggi, jumlah kategori tren, irisan minat-tren, dan produk bertren; seluruh angka dihitung dari data nyata, bukan angka pajangan.'),
  num('Diagram Venn langsung (live) — visual A (minatmu) dan B (kategori tren) beserta irisannya; berubah seketika saat pengguna mencentang kategori.'),
  num('Panel Minat — pemilihan kategori minat (6 kategori) yang membentuk himpunan A; menampilkan notasi A, Aᶜ, A ∩ B, dan B − A secara langsung.'),
  num('Rekomendasi berbobot — daftar produk terurut dari skor kecocokan tertinggi, lengkap persentase dan label skala (5 tingkat).'),
  num('Diversifikasi — dua produk dari tren yang belum menjadi minat pengguna disisipkan ke daftar untuk mencegah filter bubble.'),
  num('Katalog — pencarian nama/tag, filter kategori, dan pengurutan (skor, harga, rating).'),
  num('Detail Produk — rincian perhitungan skor langkah demi langkah: himpunan A, B, irisan, gabungan, Jaccard, overlap, hingga skor akhir.'),
  num('Keranjang & Checkout simulasi — penambahan item mencatat interaksi ke barisan riwayat; checkout merekam pesanan simulasi.'),
  num('Halaman Himpunan & Barisan — teori, kode sumber asli, dan dua playground: operasi himpunan yang dihitung di browser, dan pengelolaan barisan riwayat R per periode.'),
  num('Penyimpanan MySQL — state per perangkat disimpan melalui API PHP (Laragon) dengan cache localStorage agar tampilan tetap instan dan tetap jalan saat server mati.'),
  num('Mode gelap & desain responsif — tema navy-violet, navigasi keyboard, dan animasi yang menghormati preferensi pengguna (prefers-reduced-motion).'),
)

// ---------- 3. INPUT ----------
isi.push(
  h1('3. Input Sistem'),
  p('Input adalah semua data yang masuk ke mesin rekomendasi. Ada dua kelompok: data dari pengguna dan data dari katalog. Tabel berikut merinci semuanya — kolom terakhir menunjukkan bentuk himpunan/barisan yang dihasilkan, karena itulah cara sistem membaca inputnya.'),
  tabel(
    [2300, 2600, 2300, 2640],
    ['Input', 'Bentuk / Contoh', 'Asal', 'Menjadi di sistem'],
    [
      ['Minat pengguna', 'Elektronik, Buku (centang kategori)', 'Panel Minat (UI)', 'Himpunan A ⊆ U'],
      ['Rating yang disukai', '{4, 5} (bintang)', 'Profil default', 'Himpunan R'],
      ['Interaksi (klik produk, keranjang, wishlist)', 'klik "Headphone ProX"', 'Aksi pengguna', 'Elemen barisan rₜ (riwayat periode ini)'],
      ['Riwayat periode', '[["Elektronik"], ["Elektronik","Buku"]]', 'Panel logika / MySQL', 'Barisan R = (r₁, r₂, …, rₜ)'],
      ['Katalog produk', '24 produk: nama, harga, kategori, rating, label tren', 'dataProduk.js', 'Item dengan atribut kategori ∈ U, rating, tren'],
      ['Kategori tren', 'kategori yang punya ≥1 produk bertren', 'Dihitung dari katalog (hitungKategoriTren)', 'Himpunan B'],
      ['Query katalog', 'kata kunci "buku", filter "Elektronik", urutan "harga"', 'Form katalog', 'Penyaring & pengurutan daftar hasil'],
      ['Keranjang & data checkout', 'item + jumlah; nama, telepon, alamat', 'UI keranjang', 'Objek pesanan (disimpan ke MySQL)'],
      ['ID perangkat', '64 digit heksadesimal acak', 'crypto.getRandomValues (browser)', 'Kunci baris state di tabel MySQL'],
    ],
  ),
  spasi(),
  pRuns([r('Semesta U', { bold: true }), r(' = seluruh kategori yang tersedia: { Elektronik, Fashion, Olahraga, Buku, Rumah Tangga, Mainan & Hobi }, sehingga |U| = 6. Semua himpunan kategori (A, B, rₜ) adalah subset dari U.')]),
)

// ---------- 4. PROSES ----------
isi.push(
  h1('4. Proses Perhitungan'),
  p('Mesin rekomendasi (src/lib/rekomendasi.js) menjalankan lima tahap berurutan. Semua fungsi memakai struktur Set JavaScript sehingga irisan dan gabungan bekerja O(k) per elemen.'),
  h2('4.1 Operasi Himpunan Dasar'),
  p('Empat operasi inti dihitung dari A (minat), B (kategori item atau tren), dan U (semesta):'),
  rumus('A ∩ B   (irisan)      A ∪ B   (gabungan)'),
  rumus('Aᶜ = U − A   (komplemen)      B − A   (selisih)'),
  bullet('A ∩ B: kategori favorit pengguna yang juga sedang tren — kandidat rekomendasi terkuat.'),
  bullet('A ∪ B: seluruh kategori relevan — ukur cakupan.'),
  bullet('Aᶜ: kategori yang belum diminati — sumber diversifikasi.'),
  bullet('B − A: tren yang belum diikuti — peluang perluasan minat.'),
  h2('4.2 Koefisien Kemiripan'),
  p('Dua koefisien mengukur kemiripan dua himpunan:'),
  rumus('J(A, B) = |A ∩ B| / |A ∪ B|        (Jaccard)'),
  rumus('O(A, B) = |A ∩ B| / min(|A|, |B|)   (tumpang tindih / overlap)'),
  p('Overlap dipilih sebagai dasar skor karena bernilai 1 saat seluruh atribut item tercakup — dengan B satu elemen, O = 1 tepat saat kategori item menjadi anggota A. Inilah yang membuat skor sempurna 100% terjadi secara jujur (tidak pernah dipaksakan).'),
  h2('4.3 Skor Gabungan (Notasi Sigma)'),
  rumus('S(u, i) = Σₖ wₖ · Oₖ(u, i) = 0.6·O_kategori + 0.3·O_rating + 0.1·O_tren'),
  p('Tiga komponen overlap: (1) kategori — apakah kategori produk ∈ A; (2) rating — apakah rating produk ∈ R (rating yang disukai); (3) tren — apakah kategori produk termasuk B. Setiap Oₖ ∈ [0,1] sehingga S ∈ [0,1]; skor dikali 100 untuk ditampilkan sebagai persen.'),
  h2('4.4 Perangkingan dan Diversifikasi'),
  num('Hitung S(u, i) untuk seluruh 24 produk.'),
  num('Urutkan menurun berdasarkan S.'),
  num('Ambil 8 teratas (utama).'),
  num('Cari produk dari B − A (kategori tren yang belum diminati) dan sisipkan hingga 2 produk di posisi tengah daftar, bertanda "Coba hal baru".'),
  h2('4.5 Barisan Riwayat Minat'),
  p('Setiap interaksi (membuka detail produk, menambah keranjang, wishlist) memperbarui suku terakhir barisan. Tombol "Mulai Periode Baru" menutup periode dan membuka suku baru:'),
  rumus('R = (r₁, r₂, r₃, …, rₜ),  rₜ ⊆ U'),
  rumus('Pergeseran: baru = rₜ − rₜ₋₁ ,   hilang = rₜ₋₁ − rₜ'),
  rumus('Stabilitas: J(rₜ₋₁, rₜ)'),
  p('Angka baru/hilang dan stabilitas inilah yang ditampilkan di playground barisan: minat pengguna tidak dianggap statis, dan sistem mengikutinya lewat perbandingan dua suku terakhir.'),
  h2('4.6 Skala Kecocokan (5 Tingkat)'),
  p('Persen skor dipetakan ke label agar mudah dibaca. Band ini diuji otomatis oleh skala.test.mjs (22 asersi):'),
  tabel(
    [2400, 1800, 2400, 3240],
    ['Label', 'Rentang', 'Makna', 'Catatan'],
    [
      ['Tidak Cocok', '0–20%', 'tidak relevan', 'termasuk skor 0'],
      ['Kurang Cocok', '21–35%', 'hampir tidak cocok', ''],
      ['Cukup Cocok', '36–65%', 'parsial', 'skor 40% = tanpa kecocokan kategori'],
      ['Cocok', '66–99%', 'kuat', ''],
      ['Sangat Cocok', '100%', 'sempurna', 'DIKUNCI hanya di 100% — dipastikan test'],
    ],
  ),
  spasi(),
  h2('4.7 Contoh Perhitungan Nyata'),
  h3('Kasus 1 — kecocokan sempurna'),
  p('Pengguna: A = { Elektronik }, R = {4, 5}. Produk: Headphone Wireless ProX (Elektronik, rating 5, sedang tren).'),
  bullet('O_kategori: A ∩ {Elektronik} = {Elektronik}, min(|A|,|B|) = 1 → O = 1 → 0.6 × 1 = 0.6'),
  bullet('O_rating: {5} ⊆ {4,5} → O = 1 → 0.3 × 1 = 0.3'),
  bullet('O_tren: kategori tergolong tren → O = 1 → 0.1 × 1 = 0.1'),
  pRuns([r('S = 0.6 + 0.3 + 0.1 = 1.00 → '), r('100% → Sangat Cocok', { bold: true })]),
  h3('Kasus 2 — kecocokan tanpa irisan kategori'),
  p('Pengguna: A = { Buku }. Produk: Kaos Oversize Basic Cotton (Fashion, rating 4, tren).'),
  bullet('O_kategori: A ∩ {Fashion} = ∅ → 0 → 0.0'),
  bullet('O_rating: {4} ⊆ {4,5} → 1 → 0.3'),
  bullet('O_tren: Fashion bertren → 1 → 0.1'),
  pRuns([r('S = 0.40 → '), r('40% → Cukup Cocok', { bold: true }), r('.  Inilah penjelasan angka 40% yang muncul saat minat masih kosong: komponen kategori (bobot terbesar, 0.6) mustahil tercapai.')]),
  h3('Kasus 3 — minat banyak, irisan parsial'),
  p('A = { Elektronik, Buku, Fashion, Olahraga } dan produk kategori Fashion: O = |A ∩ {Fashion}| / min(4, 1) = 1/1 = 1. Perhatikan min( ,1) — untuk item satu kategori, overlap hanya mengenal "cocok / tidak". Irisan parsial justru terlihat di tingkat himpunan lewat Jaccard J(A, B) yang ditampilkan di kartu market-fit halaman logika.'),
)

// ---------- 5. OUTPUT ----------
isi.push(
  h1('5. Output Sistem'),
  p('Output adalah semua yang sistem sajikan atau rekam setelah proses. Setiap output dapat dijejaki kembali ke input dan rumus di atas.'),
  tabel(
    [2900, 4100, 2840],
    ['Output', 'Isi', 'Dibangun dari'],
    [
      ['Daftar rekomendasi (Beranda & Katalog)', 'produk terurut skor: persen, label skala, bar skala berwarna band, badge 🔥 Hot / ✨ Coba hal baru', 'S(u,i) diurutkan + diversifikasi B−A'],
      ['Diagram Venn langsung', 'dua lingkaran A & B, irisannya (angka + keterangan "n kategori cocok — x% dari B")', 'ringkasanHimpunan(A, B)'],
      ['Notasi himpunan di panel', 'A = { … }, Aᶜ = { … }, A ∩ B = { … }, B − A = { … }', 'tulisHimpunan()'],
      ['Metrik dashboard', 'produk terkurasi (n), kategori tren (|B|), minatmu yang tren (|A∩B|), produk bertren', 'hasil proses + katalog'],
      ['Skor tertinggi', 'persen S terbesar hari ini, mis. 100%', 'hasil[0]'],
      ['Rincian skor (Detail Produk)', 'langkah: A, B, A∩B, A∪B, J, O, S dengan angka lengkap', 'rincianSkor()'],
      ['Ringkasan keranjang & pesanan', 'total Rp, daftar item, konfirmasi pesanan simulasi', 'state keranjang'],
      ['Analisis barisan (halaman logika)', 'R = (r₁ … rₜ), kategori baru/hilang, stabilitas J(rₜ₋₁, rₜ)', 'pergeseranMinat, stabilitasMinat'],
      ['State tersimpan MySQL', 'baris state_perangkat per device_id (JSON: minat, ratingSuka, keranjang, wishlist, riwayat, pesanan)', 'API state.php + penyimpanan.js'],
    ],
  ),
  spasi(),
  p('Skala warna bar (merah-oranye-amber-biru-hijau) adalah semantik data band kecocokan — sengaja dipisahkan dari warna identitas visual agar makna band konsisten di seluruh halaman.'),
)

// ---------- 6. HUBUNGAN DENGAN HIMPUNAN ----------
isi.push(
  h1('6. Hubungan Output dengan Materi Himpunan'),
  p('Setiap output sistem adalah wujud langsung dari konsep himpunan — bukan sekadar hiasan. Tabel ini memetakan materi ke penerapannya:'),
  tabel(
    [2500, 3900, 3440],
    ['Konsep Himpunan', 'Penerapan di TokoPintar', 'Terlihat di Output'],
    [
      ['Semesta U', 'Enam kategori produk menjadi U; semua himpunan adalah subset U', 'notasi A, B selalu diukur terhadap U'],
      ['Keanggotaan (∈)', 'kategori item ∈ A menentukan komponen skor terbesar', 'persen skor tiap kartu'],
      ['Irisan A ∩ B', 'kategori favorit yang sedang tren = kandidat utama', 'angka di lensa Venn; komponen A ∩ B panel minat'],
      ['Gabungan A ∪ B', 'penyebut koefisien Jaccard', 'kartu market-fit (|A∩B| / |A∪B|)'],
      ['Komplemen Aᶜ', 'kategori belum diminati — arah diversifikasi', 'notasi Aᶜ di panel minat'],
      ['Selisih B − A', 'tren yang belum diikuti → sisipan "Coba hal baru"', 'badge di kartu rekomendasi'],
      ['Himpunan kosong ∅', 'kunjungan pertama tanpa pilihan; sistem jujur menampilkan { ∅ } dan skor terbatas (40%)', 'panel minat pengguna baru'],
      ['Koefisien Jaccard J', 'kemiripan dua himpunan umum', 'kartu market-fit; stabilitas antar periode'],
      ['Koefisien overlap O', 'dasar skor per komponen (kategori, rating, tren)', 'rincian skor di detail produk'],
      ['Operasi pada himpunan', 'irisan/gabungan/komplemen/selisih dihitung fungsi murni (Set)', 'kode asli dipajang di halaman logika'],
    ],
  ),
  spasi(),
  p('Kesimpulan bagian ini: output rekomendasi secara harfiah adalah hasil operasi himpunan yang ditata ulang menjadi antarmuka belanja. Angka yang tampil bukan hasil pemodelan statistik gelap, melainkan |A ∩ B|, min(|A|,|B|), dan Σ wₖ·Oₖ yang semuanya dapat dihitung ulang dengan tangan.'),
)

// ---------- 7. HUBUNGAN DENGAN BARISAN ----------
isi.push(
  h1('7. Hubungan Output dengan Materi Barisan'),
  p('Himpunan menangkap minat pada satu titik waktu; barisan menangkap perkembangannya. TokoPintar memodelkan riwayat pengguna sebagai barisan tak hingga yang suku-sukunya himpunan:'),
  rumus('R = (r₁, r₂, r₃, …, rₜ),  rₜ = himpunan kategori minat periode ke-t'),
  tabel(
    [2500, 3900, 3440],
    ['Konsep Barisan', 'Penerapan di TokoPintar', 'Terlihat di Output'],
    [
      ['Suku barisan rₜ (himpunan)', 'satu periode minat; interaksi menambah anggota suku terakhir', 'kotak r₁, r₂, … di playground barisan'],
      ['Barisan terdefinisi bertahap', '"Mulai Periode Baru" membangun suku berikutnya', 'panjang R bertambah'],
      ['Perbandingan dua suku', 'pergeseran minat: rₜ − rₜ₋₁ (baru) dan rₜ₋₁ − rₜ (hilang)', 'kotak "Kategori baru periode ini" / "Tidak lagi disukai"'],
      ['Konvergensi/stabilitas', 'J(rₜ₋₁, rₜ) ≈ 1 berarti minat stabil, ≈ 0 berarti bergeser', 'angka stabilitas di playground'],
      ['Barisan sebagai riwayat', 'riwayat tersimpan per perangkat (MySQL) dan ikut dipertahankan antar kunjungan', 'data riwayat tetap ada setelah refresh'],
      ['Induksi periode', 'setiap periode memakai minat hasil periode sebelumnya sebagai titik awal', 'suku terakhir = A aktif saat ini'],
    ],
  ),
  spasi(),
  p('Hubungan dua materi itu saling melengkapi: skor hari ini lahir dari himpunan (A terhadap atribut item), sedangkan kemampuan sistem mengikuti penggunanya dari waktu ke waktu lahir dari barisan. Tanpa barisan, rekomendasi membeku pada klik pertama; tanpa himpunan, tidak ada isi yang bisa diperbandingkan antar suku.'),
)

// ---------- 8. ALUR DATA ----------
isi.push(
  h1('8. Alur Data Lengkap (Input → Proses → Output)'),
  num('Pengguna membuka situs; browser membuat/membaca ID perangkat dan memuat cache, lalu mengambil state dari MySQL melalui GET /api/state.php (proxy Vite → Apache → PHP).'),
  num('Aplikasi menghitung kategori tren B dari katalog: kategori yang memiliki produk bertren.'),
  num('Pengguna memberi input minat (mencentang kategori) — A terbentuk; panel menampilkan A, Aᶜ, A ∩ B, B − A seketika.'),
  num('Mesin menghitung S(u, i) untuk 24 produk: 0.6·O_kategori + 0.3·O_rating + 0.1·O_tren, mengurutkan, lalu menyisipkan dua item diversifikasi dari B − A.'),
  num('Output ditampilkan: daftar rekomendasi + skala 5 tingkat, Venn langsung, metrik, rincian skor di detail produk.'),
  num('Setiap interaksi (detail, keranjang, wishlist) menambah anggota rₜ; state terbaru dikirim (debounce 400 ms) via POST /api/state.php dan tersimpan sebagai satu baris JSON per perangkat di MySQL.'),
  num('Saat halaman dimuat ulang, langkah 1 mengembalikan seluruh state — refresh tidak menghapus apa pun; pada perangkat lain data berbeda karena device_id berbeda.'),
  spasi(),
  mono('Beranda: A → S(u,i) tiap produk → urut → sisip B−A → tampil'),
  mono('Waktu  : rₜ bertumbuh → rₜ₊₁ (periode baru) → J(rₜ, rₜ₊₁) → stabilitas'),
  mono('Server : state{minat,…} → POST state.php → MySQL(tokopintar) → GET saat reload'),
)

// ---------- 9. LAMPIRAN ----------
isi.push(
  h1('9. Lampiran'),
  h2('9.1 Struktur Kode'),
  tabel(
    [3400, 6440],
    ['File', 'Tanggung jawab'],
    [
      ['src/lib/rekomendasi.js', 'Seluruh matematika: operasi himpunan, Jaccard, overlap, skor berbobot, rekomendasi + diversifikasi, barisan, skala kecocokan'],
      ['src/lib/dataProduk.js', 'Kategori (U), 24 produk, profil default (mulai kosong), hitungKategoriTren'],
      ['src/lib/penyimpanan.js', 'ID perangkat (crypto) + muat/simpan state ke API'],
      ['src/store/AppContext.jsx', 'State global: minat, keranjang, wishlist, riwayat, pesanan; sinkronisasi cache + MySQL'],
      ['src/pages/Beranda.jsx', 'Dashboard: hero, Venn langsung, metrik, panel minat, rekomendasi'],
      ['src/pages/Katalog.jsx', 'Pencarian, filter, urutan'],
      ['src/pages/DetailProduk.jsx', 'Rincian skor langkah demi langkah + produk serupa'],
      ['src/pages/Keranjang.jsx', 'Keranjang + checkout simulasi'],
      ['src/pages/LogikaMatematika.jsx', 'Teori, kode asli, playground himpunan & barisan'],
      ['src/components/VennMinat.jsx', 'Diagram Venn SVG langsung'],
      ['tmp/api-tokopintar/state.php', 'API GET/POST state (PDO prepared statement, batas 64 KB, validasi id)'],
      ['tmp/api-tokopintar/schema.sql', 'Skema MySQL: state_perangkat, pengguna'],
      ['skala.test.mjs', '22 asersi otomatis skala kecocokan & skor'],
    ],
  ),
  spasi(),
  h2('9.2 Cara Menjalankan'),
  num('Nyalakan Laragon (Start All) — Apache + MySQL; database tokopintar dibuat dari schema.sql bila belum ada.'),
  num('Salin state.php ke C:\\laragon\\www\\tokopintar-api\\ bila belum ada.'),
  num('Jalankan npm install (sekali), lalu npm run dev — situs terbuka di http://localhost:5173.'),
  num('Uji mesin: node skala.test.mjs (semua harus "SEMUA LULUS").'),
  h2('9.3 Batasan Prototipe'),
  bullet('Identitas memakai device ID anonim — tanpa login; perangkat berbeda dianggap pengguna berbeda.'),
  bullet('Katalog 24 produk bersifat mock; harga dan tren disimulasikan.'),
  bullet('Checkout tidak memproses pembayaran sungguhan.'),
  p('Dokumen ini dibuat otomatis dari kondisi kode aktual per 5 Oktober 2026.', { italics: true }),
)

// ============================================================
// DOKUMEN
// ============================================================
const doc = new Document({
  features: { updateFields: true },
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 480, hanging: 240 } } } },
          { level: 1, format: LevelFormat.BULLET, text: '–', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 960, hanging: 240 } } } },
        ],
      },
      {
        reference: 'langkah',
        levels: [
          { level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 480, hanging: 240 } } } },
        ],
      },
    ],
  },
  styles: {
    default: {
      document: { run: { font: 'Calibri', size: 22 } },
    },
  },
  sections: [
    {
      properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: 'TokoPintar — Dokumentasi | hal. ', size: 18, color: '888888', font: 'Calibri' }),
                new TextRun({ children: [PageNumber.CURRENT], size: 18, color: '888888', font: 'Calibri' }),
              ],
            }),
          ],
        }),
      },
      children: isi,
    },
  ],
})

const buf = await Packer.toBuffer(doc)
const KELUARAN = 'Dokumentasi_TokoPintar.docx'
writeFileSync(KELUARAN, buf)
console.log('OK:', KELUARAN, buf.length, 'bytes')
