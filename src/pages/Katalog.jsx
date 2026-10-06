import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import { PRODUK, KATEGORI } from '../lib/dataProduk'
import { rincianSkor } from '../lib/rekomendasi'
import KartuProduk from '../components/KartuProduk'

const PILIHAN_URUT = [
  { nilai: 'skor', label: 'Skor kecocokan' },
  { nilai: 'harga-naik', label: 'Harga terendah' },
  { nilai: 'harga-turun', label: 'Harga tertinggi' },
  { nilai: 'rating', label: 'Rating tertinggi' },
]

export default function Katalog() {
  const { minatArr, ratingSukaArr, kategoriTren } = useApp()
  const [params] = useSearchParams()
  const kueriAwal = params.get('q') || ''

  const [kueri, setKueri] = useState(kueriAwal)
  const [filterKategori, setFilterKategori] = useState('Semua')
  const [urutan, setUrutan] = useState('skor')

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

  const kelasPilih =
    'rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-slate-200 focus:border-violet-400/60 focus:outline-none'

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 md:px-6">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Katalog</h1>
        <p className="mt-1 text-sm text-slate-400">
          Urutan bawaan mengikuti skor kecocokan dengan minatmu —{' '}
          <span className="font-mono font-semibold text-violet-300">A ∩ {kueri.trim() ? 'kata kunci' : 'B'}</span> dan
          pembobotan rating serta tren.
        </p>
      </header>

      <div className="panel mb-6 flex flex-wrap items-center gap-3 p-4">
        <div className="relative min-w-[200px] flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
          <input
            value={kueri}
            onChange={(e) => setKueri(e.target.value)}
            placeholder="Cari nama atau tag…"
            className="glass-input !pl-10"
          />
        </div>
        <select value={filterKategori} onChange={(e) => setFilterKategori(e.target.value)} className={kelasPilih}>
          <option>Semua</option>
          {KATEGORI.map((k) => (
            <option key={k}>{k}</option>
          ))}
        </select>
        <select
          value={urutan}
          onChange={(e) => setUrutan(e.target.value)}
          className={kelasPilih}
          aria-label="Urutkan berdasarkan"
        >
          {PILIHAN_URUT.map((o) => (
            <option key={o.nilai} value={o.nilai}>
              {o.label}
            </option>
          ))}
        </select>
        <span className="ml-auto whitespace-nowrap text-xs font-semibold text-slate-400">{daftar.length} produk</span>
      </div>

      {daftar.length === 0 ? (
        <p className="py-16 text-center text-sm text-slate-400">
          Tidak ada produk yang cocok. Coba kata kunci lain atau pilih kategori "Semua".
        </p>
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
