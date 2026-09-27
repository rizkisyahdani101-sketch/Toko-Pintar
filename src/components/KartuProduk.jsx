import { Link } from 'react-router-dom'
import { useApp, formatRupiah } from '../store/AppContext'
import { rincianSkor } from '../lib/rekomendasi'
import FotoProduk from './FotoProduk'

export default function KartuProduk({ item, skor, tampilSkor = true, diversifikasi = false }) {
  const { tambahKeKeranjang, toggleWishlist, wishlist, kategoriTren } = useApp()
  const diWishlist = wishlist.some((x) => x.id === item.id)

  // Hitung skor bila tidak diberikan dari luar
  const skorData = skor ?? rincianSkor({ minat: [], ratingSuka: [4, 5] }, item, kategoriTren)
  const persen = Math.round(skorData.total * 100)

  return (
    <div className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
      {diversifikasi && (
        <span className="absolute -top-2 left-3 z-10 rounded-full bg-purple-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">
          ✨ Coba Hal Baru
        </span>
      )}
      <button
        onClick={() => toggleWishlist(item)}
        title={diWishlist ? 'Hapus dari wishlist' : 'Tambah ke wishlist'}
        className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm shadow transition ${
          diWishlist ? 'bg-rose-500 text-white' : 'bg-white/90 text-slate-400 hover:text-rose-500 dark:bg-slate-700'
        }`}
      >
        {diWishlist ? '♥' : '♡'}
      </button>

      <Link to={`/produk/${item.id}`} className="flex flex-1 flex-col p-4">
        <FotoProduk item={item} className="mb-3 h-28 w-full rounded-xl" />
        <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-slate-800 group-hover:text-primary-600 dark:text-slate-100">
          {item.nama}
        </h3>
        <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
          {item.kategori} · ⭐ {item.rating}/5 {item.tren && '· 🔥 Tren'}
        </p>
        <p className="text-base font-bold text-primary-600 dark:text-primary-400">{formatRupiah(item.harga)}</p>
      </Link>

      <div className="border-t border-slate-100 p-3 dark:border-slate-700">
        {tampilSkor && (
          <div className="mb-2" title={`S(u,i) = ${skorData.total.toFixed(2)}`}>
            <div className="mb-1 flex justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <span>Kecocokan</span>
              <span>{persen}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-600">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600"
                style={{ width: `${Math.min(100, persen)}%` }}
              />
            </div>
          </div>
        )}
        <button
          onClick={() => tambahKeKeranjang(item)}
          className="w-full rounded-lg bg-primary-600 py-2 text-xs font-semibold text-white transition hover:bg-primary-700"
        >
          + Keranjang
        </button>
      </div>
    </div>
  )
}
