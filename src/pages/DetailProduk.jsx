import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useApp, formatRupiah } from '../store/AppContext'
import { PRODUK } from '../lib/dataProduk'
import { rincianSkor, keHimpunan, irisan, gabungan, jaccard, overlap, selisih, skalaKecocokan } from '../lib/rekomendasi'
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
        <p className="mb-4 text-slate-400">Produk tidak ditemukan.</p>
        <Link to="/katalog" className="text-violet-300 hover:underline">← Kembali ke katalog</Link>
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
  const persen = Math.round(skor.total * 100)
  const skala = skalaKecocokan(persen)
  const A = keHimpunan(minatArr)
  const B = keHimpunan([item.kategori])
  const irisanAB = irisan(A, B)
  const gabunganAB = gabungan(A, B)
  const selisihTren = selisih(A, keHimpunan(kategoriTren))

  const serupa = PRODUK.filter((x) => x.kategori === item.kategori && x.id !== item.id).slice(0, 4)
  const diWishlist = wishlist.some((x) => x.id === item.id)

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 md:px-6">
      <Link to="/katalog" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-violet-300 transition hover:text-violet-200">
        ← Kembali ke katalog
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Foto */}
        <div className="relative">
          <FotoProduk item={item} className="h-64 w-full rounded-3xl border border-white/[0.06] shadow-hero" />
          {item.tren && <span className="badge-hot absolute left-3 top-3">🔥 Sedang tren</span>}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <h1 className="mb-2 text-2xl font-extrabold text-white md:text-3xl">{item.nama}</h1>
          <p className="mb-4 text-sm text-slate-400">
            {item.kategori} · ⭐ {item.rating}/5 · {item.tags.join(', ')}
          </p>
          <p className="mb-6 text-3xl font-extrabold text-white">{formatRupiah(item.harga)}</p>
          <div className="flex gap-3">
            <button
              onClick={() => tambahKeKeranjang(item)}
              className="grad-aksi flex-1 rounded-xl py-3 font-bold text-white shadow-md shadow-accent-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent-500/30"
            >
              + Tambah ke keranjang
            </button>
            <button
              onClick={() => toggleWishlist(item)}
              aria-pressed={diWishlist}
              className={`rounded-xl border px-5 py-3 font-semibold transition ${
                diWishlist
                  ? 'border-rose-500 bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'border-white/10 bg-white/[0.04] text-slate-300 hover:border-rose-400/60 hover:text-rose-300'
              }`}
            >
              {diWishlist ? '♥' : '♡'}
            </button>
          </div>
        </div>

        {/* Panel skor */}
        <div className="panel p-6 lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-bold text-white">Kenapa produk ini?</h2>
            <span className="font-mono text-[11px] text-slate-500">dihitung oleh src/lib/rekomendasi.js</span>
          </div>

          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
            {/* Langkah himpunan */}
            <div className="rounded-2xl bg-white/[0.03] p-4 font-mono text-xs leading-relaxed text-slate-300">
              <p>A (minatmu) = {'{'} {[...A].join(', ') || '∅'} {'}'}</p>
              <p>B (kategori item) = {'{'} {item.kategori} {'}'}</p>
              <p className="text-violet-300">
                A ∩ B = {'{'} {[...irisanAB].join(', ') || '∅'} {'}'} → |A∩B| = {irisanAB.size}
              </p>
              <p>
                A ∪ B = {'{'} {[...gabunganAB].join(', ')} {'}'} → |A∪B| = {gabunganAB.size}
              </p>
              <p className="font-bold text-white">
                J(A, B) = {irisanAB.size}/{gabunganAB.size} = {jaccard(A, B).toFixed(2)}
              </p>
              <p className="font-bold text-emerald-300">
                O(A, B) = |A∩B| / min(|A|,|B|) = {overlap(A, B).toFixed(2)} → dasar skor
              </p>
              <p className="text-violet-300">
                S = 0.6·kategori + 0.3·rating + 0.1·tren = {skor.genre.toFixed(2)} + {skor.rating.toFixed(2)} +{' '}
                {skor.tren.toFixed(2)} = <b className="text-white">{skor.total.toFixed(2)}</b>
              </p>
            </div>

            {/* Skala kecocokan */}
            <div className="flex flex-col justify-between gap-4 rounded-2xl bg-white/[0.03] p-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Skor kecocokan</span>
                  <span className="text-sm font-extrabold text-violet-300">{persen}%</span>
                </div>
                <div className="mb-3 h-2.5 overflow-hidden rounded-full bg-white/[0.08]">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${skala.bar}`}
                    style={{ width: `${Math.min(100, persen)}%` }}
                  />
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${skala.warna}`}>{skala.label}</span>
              </div>

              {selisihTren.size > 0 && (
                <p className="rounded-xl bg-violet-500/10 p-3 text-xs leading-relaxed text-violet-200">
                  Kategori tren yang belum kamu sukai (B − A):{' '}
                  <span className="font-mono font-semibold">{[...selisihTren].join(', ')}</span> — produk dari sini
                  disisipkan sebagai diversifikasi di beranda.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {serupa.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-lg font-bold text-white">Produk serupa</h2>
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
