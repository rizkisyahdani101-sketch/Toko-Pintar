import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import { PRODUK, KATEGORI } from '../lib/dataProduk'
import { rincianSkor } from '../lib/rekomendasi'
import KartuProduk from '../components/KartuProduk'

export default function Katalog() {
  const { minatArr, ratingSukaArr, kategoriTren } = useApp()
  const [params] = useSearchParams()
  const kueriAwal = params.get('q') || ''

  const [kueri, setKueri] = useState(kueriAwal)
  const [filterKategori, setFilterKategori] = useState('Semua')
  const [urutan, setUrutan] = useState('skor') // skor | harga-naik | harga-turun | rating

  const daftar = useMemo(() => {
    const user = { minat: minatArr, ratingSuka: ratingSukaArr }
    let hasil = PRODUK.map((item) => ({ item, skor: rincianSkor(user, item, kategoriTren) }))

    if (filterKategori !== 'Semua') hasil = hasil.filter((x) => x.item.kategori === filterKategori)
    if (kueri.trim()) {
      const q = kueri.toLowerCase()
      hasil = hasil.filter(
        (x) => x.item.nama.toLowerCase().includes(q) || x.item.tags.some((t) => t.includes(q))
      )
    }

    switch (urutan) {
      case 'harga-naik':
        hasil.sort((a, b) => a.item.harga - b.item.harga)
        break
      case 'harga-turun':
        hasil.sort((a, b) => b.item.harga - a.item.harga)
        break
      case 'rating':
        hasil.sort((a, b) => b.item.rating - a.item.rating)
        break
      default:
        hasil.sort((a, b) => b.skor.total - a.skor.total)
    }
    return hasil
  }, [minatArr, ratingSukaArr, kategoriTren, filterKategori, kueri, urutan])

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-1 text-2xl font-extrabold text-slate-800 dark:text-slate-100">Katalog Produk</h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        Skor kecocokan (%) pada tiap kartu dihitung dari S(u,i) = Σ wₖ·Jₖ terhadap himpunan minatmu.
      </p>

      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <input
          value={kueri}
          onChange={(e) => setKueri(e.target.value)}
          placeholder="Cari nama atau tag…"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
        />
        <select
          value={filterKategori}
          onChange={(e) => setFilterKategori(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
        >
          <option>Semua</option>
          {KATEGORI.map((k) => (
            <option key={k}>{k}</option>
          ))}
        </select>
        <select
          value={urutan}
          onChange={(e) => setUrutan(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
        >
          <option value="skor">Urut: Skor Kecocokan</option>
          <option value="harga-naik">Urut: Harga Terendah</option>
          <option value="harga-turun">Urut: Harga Tertinggi</option>
          <option value="rating">Urut: Rating</option>
        </select>
        <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">{daftar.length} produk</span>
      </div>

      {daftar.length === 0 ? (
        <p className="py-16 text-center text-slate-400">Tidak ada produk yang cocok. 🤷</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {daftar.map(({ item, skor }) => (
            <KartuProduk key={item.id} item={item} skor={skor} />
          ))}
        </div>
      )}
    </div>
  )
}
