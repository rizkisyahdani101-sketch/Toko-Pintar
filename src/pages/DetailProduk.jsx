import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useApp, formatRupiah } from '../store/AppContext'
import { PRODUK } from '../lib/dataProduk'
import { rincianSkor, keHimpunan, irisan, gabungan, jaccard, selisih } from '../lib/rekomendasi'
import KartuProduk from '../components/KartuProduk'
import FotoProduk from '../components/FotoProduk'

export default function DetailProduk() {
  const { id } = useParams()
  const { minatArr, ratingSukaArr, kategoriTren, tambahKeKeranjang, toggleWishlist, wishlist, catatInteraksi } =
    useApp()

  const item = PRODUK.find((x) => x.id === Number(id))
  if (!item) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="mb-4 text-slate-500">Produk tidak ditemukan.</p>
        <Link to="/katalog" className="text-primary-600 hover:underline">← Kembali ke katalog</Link>
      </div>
    )
  }

  // Catat interaksi sekali per kunjungan (membentuk barisan riwayat R)
  useEffect(() => {
    if (item) catatInteraksi(item)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id])

  const user = { minat: minatArr, ratingSuka: ratingSukaArr }
  const skor = rincianSkor(user, item, kategoriTren)
  const A = keHimpunan(minatArr)
  const B = keHimpunan([item.kategori])
  const irisanAB = irisan(A, B)
  const gabunganAB = gabungan(A, B)
  const selisihTren = selisih(A, keHimpunan(kategoriTren))

  const serupa = PRODUK.filter((x) => x.kategori === item.kategori && x.id !== item.id).slice(0, 4)
  const diWishlist = wishlist.some((x) => x.id === item.id)

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Link to="/katalog" className="mb-4 inline-block text-sm text-primary-600 hover:underline">
        ← Kembali ke Katalog
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Info produk */}
        <div>
          <FotoProduk item={item} className="mb-6 h-64 w-full rounded-2xl" />
          <h1 className="mb-2 text-2xl font-extrabold text-slate-800 dark:text-slate-100">{item.nama}</h1>
          <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
            {item.kategori} · ⭐ {item.rating}/5 · Tag: {item.tags.join(', ')} {item.tren && '· 🔥 Sedang tren'}
          </p>
          <p className="mb-6 text-3xl font-bold text-primary-600 dark:text-primary-400">{formatRupiah(item.harga)}</p>
          <div className="flex gap-3">
            <button
              onClick={() => tambahKeKeranjang(item)}
              className="flex-1 rounded-xl bg-primary-600 py-3 font-semibold text-white shadow hover:bg-primary-700"
            >
              + Tambah ke Keranjang
            </button>
            <button
              onClick={() => toggleWishlist(item)}
              className={`rounded-xl border px-5 py-3 font-semibold transition ${
                diWishlist
                  ? 'border-rose-500 bg-rose-500 text-white'
                  : 'border-slate-300 text-slate-600 hover:border-rose-400 hover:text-rose-500 dark:border-slate-600 dark:text-slate-300'
              }`}
            >
              {diWishlist ? '♥' : '♡'}
            </button>
          </div>
        </div>

        {/* Panel "Kenapa direkomendasikan?" */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-1 text-lg font-bold text-slate-800 dark:text-slate-100">🧠 Kenapa direkomendasikan?</h2>
          <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
            Semua angka di bawah dihitung langsung oleh <span className="font-mono">src/lib/rekomendasi.js</span>
          </p>

          {/* Langkah himpunan */}
          <div className="mb-4 space-y-2 rounded-xl bg-slate-50 p-4 font-mono text-xs text-slate-600 dark:bg-slate-700/50 dark:text-slate-300">
            <p>A (minatmu) = {'{'}</p>
            <p className="pl-4">{[...A].join(', ') || '∅'}</p>
            <p>{'}'}</p>
            <p>B (kategori item) = {'{'} {item.kategori} {'}'}</p>
            <p className="text-primary-600 dark:text-primary-400">
              A ∩ B = {'{'} {[...irisanAB].join(', ') || '∅'} {'}'} → |A∩B| = {irisanAB.size}
            </p>
            <p>
              A ∪ B = {'{'} {[...gabunganAB].join(', ')} {'}'} → |A∪B| = {gabunganAB.size}
            </p>
            <p className="font-bold">
              J(A, B) = {irisanAB.size}/{gabunganAB.size} = {jaccard(A, B).toFixed(2)}
            </p>
          </div>

          {/* Rincian skor sigma */}
          <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Skor total: S(u,i) = Σ wₖ·Jₖ = <span className="text-primary-600 dark:text-primary-400">{skor.total.toFixed(2)}</span>
          </h3>
          {[
            { label: 'Kategori (genre)', w: 0.6, j: skor.detail.jaccardGenre, s: skor.genre },
            { label: 'Rating', w: 0.3, j: skor.detail.jaccardRating, s: skor.rating },
            { label: 'Tren', w: 0.1, j: skor.detail.jaccardTren, s: skor.tren },
          ].map(({ label, w, j, s }) => (
            <div key={label} className="mb-2">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>
                  {label}: w={w} · J={j.toFixed(2)}
                </span>
                <span className="font-semibold">w·J = {s.toFixed(3)}</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-600">
                <div
                  className="h-full rounded-full bg-primary-500"
                  style={{ width: `${Math.min(100, (s / 0.6) * 100)}%` }}
                />
              </div>
            </div>
          ))}

          {selisihTren.size > 0 && (
            <p className="mt-4 rounded-lg bg-purple-50 p-2 text-xs text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
              ✨ Kategori tren yang belum kamu sukai (B − A): {'{'} {[...selisihTren].join(', ')} {'}'} — produk dari
              sini disisipkan sebagai diversifikasi di beranda.
            </p>
          )}
        </div>
      </div>

      {serupa.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-slate-800 dark:text-slate-100">Produk Serupa</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {serupa.map((x) => (
              <KartuProduk key={x.id} item={x} tampilSkor={false} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
