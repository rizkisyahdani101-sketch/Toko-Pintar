import { Link } from 'react-router-dom'
import { useApp, formatRupiah } from '../store/AppContext'
import { rincianSkor, skalaKecocokan } from '../lib/rekomendasi'
import FotoProduk from './FotoProduk'

export default function KartuProduk({ item, skor, tampilSkor = true, diversifikasi = false }) {
  const { tambahKeKeranjang, toggleWishlist, wishlist, kategoriTren } = useApp()
  const diWishlist = wishlist.some((x) => x.id === item.id)

  const skorData = skor ?? rincianSkor({ minat: [], ratingSuka: [4, 5] }, item, kategoriTren)
  const persen = Math.round(skorData.total * 100)
  const skala = skalaKecocokan(persen)

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.06] bg-ink-800 card-hover">
      {diversifikasi && (
        <span className="badge-new absolute left-3 top-3 z-10 shadow-md">✨ Coba hal baru</span>
      )}

      <button
        onClick={() => toggleWishlist(item)}
        title={diWishlist ? 'Hapus dari wishlist' : 'Tambah ke wishlist'}
        aria-pressed={diWishlist}
        className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full text-sm shadow transition ${
          diWishlist ? 'bg-rose-500 text-white' : 'bg-ink-900/70 text-slate-300 backdrop-blur-sm hover:text-rose-300'
        }`}
      >
        {diWishlist ? '♥' : '♡'}
      </button>

      <Link to={`/produk/${item.id}`} className="flex flex-1 flex-col p-3">
        <div className="relative mb-3 overflow-hidden rounded-2xl bg-white/[0.04]">
          <FotoProduk item={item} className="h-36 w-full object-cover transition duration-500 group-hover:scale-105" />
          {item.tren && <span className="badge-hot absolute left-2 top-2">🔥 Hot</span>}
        </div>

        <div className="mb-2 flex items-center justify-between gap-2 text-[10px] font-semibold text-slate-400">
          <span className="rounded-full bg-white/[0.06] px-2.5 py-1">{item.kategori}</span>
          <span>⭐ {item.rating}/5</span>
        </div>

        <h3 className="mb-2 line-clamp-2 min-h-[42px] text-sm font-bold text-slate-100 group-hover:text-violet-300">
          {item.nama}
        </h3>

        <div className="mt-auto">
          <p className="text-lg font-extrabold text-white">{formatRupiah(item.harga)}</p>
        </div>
      </Link>

      <div className="border-t border-white/[0.06] p-3">
        {tampilSkor && (
          <div className="mb-3" title={`S(u,i) = ${skorData.total.toFixed(2)}`}>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${skala.warna}`}>{skala.label}</span>
              <span className="text-[11px] font-semibold text-slate-400">{persen}%</span>
            </div>
            <div className="progress-bar">
              <div className={`${skala.bar} progress-fill`} style={{ width: `${Math.min(100, persen)}%` }} />
            </div>
          </div>
        )}

        <button
          onClick={() => tambahKeKeranjang(item)}
          className="grad-aksi w-full rounded-xl py-2.5 text-xs font-bold text-white shadow-sm shadow-accent-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-accent-500/30"
        >
          + Keranjang
        </button>
      </div>
    </div>
  )
}
