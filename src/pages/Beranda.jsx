import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import { PRODUK } from '../lib/dataProduk'
import { rekomendasikan, tulisHimpunan } from '../lib/rekomendasi'
import KartuProduk from '../components/KartuProduk'
import PanelMinat from '../components/PanelMinat'
import VennMinat from '../components/VennMinat'

/* Count-up saat mount — hormati prefers-reduced-motion.
   Tanpa guard ref: StrictMode menjalankan efek dua kali (mount-cleanup-mount),
   guard ref membuat eksekusi kedua berhenti sehingga angka macet di 0. */
function AngkaTumbuh({ nilai, durasi = 800 }) {
  const [tampil, setTampil] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTampil(nilai)
      return
    }
    let raf
    const mulai = performance.now()
    const langkah = (kini) => {
      const p = Math.min(1, (kini - mulai) / durasi)
      setTampil(Math.round(nilai * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(langkah)
    }
    raf = requestAnimationFrame(langkah)
    return () => cancelAnimationFrame(raf)
  }, [nilai, durasi])

  return <>{tampil}</>
}

export default function Beranda() {
  const { minat, minatArr, ratingSukaArr, kategoriTren, pesanan } = useApp()

  const user = { minat: minatArr, ratingSuka: ratingSukaArr }
  const rekom = rekomendasikan(user, PRODUK, kategoriTren, 8)
  const A = minat
  const skorTerbaik = rekom.hasil[0] ? Math.round(rekom.hasil[0].total * 100) : 0

  const jmlTren = PRODUK.filter((p) => p.tren).length
  const jmlIrisan = [...A].filter((x) => kategoriTren.includes(x)).length

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 md:px-6">
      {/* ============ HERO ============ */}
      <section className="mb-14 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
        {/* Kiri: pernyataan */}
        <div className="anim-naik flex flex-col justify-center rounded-3xl border border-white/[0.06] bg-ink-800/70 p-7 backdrop-blur-sm md:p-10" style={{ '--stagger': '0ms' }}>
          <p className="mb-5 max-w-md text-base leading-relaxed text-slate-400">
            TokoPintar menilai setiap produk dengan operasi himpunan — irisan minatmu dan kategori tren menentukan skor
            kecocokan, bukan sekadar promo.
          </p>
          <h1 className="mb-6 max-w-lg text-4xl font-extrabold leading-[1.08] tracking-tight text-white md:text-5xl">
            Rekomendasi yang bisa kamu <span className="text-violet-300">buktikan</span>.
          </h1>
          <p className="mb-8 max-w-md text-sm leading-relaxed text-slate-400">
            Setiap kartu produk menampilkan rincian skor dari tiga komponen — kategori, rating, dan tren. Buka satu kartu
            untuk melihat notasi lengkapnya.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/katalog" className="btn-primary">
              Jelajahi katalog
            </Link>
            <Link to="/logika" className="btn-secondary">
              Lihat rumus di baliknya
            </Link>
          </div>
        </div>

        {/* Kanan: kartu "laporan mesin" — momen khas halaman */}
        <div className="anim-naik flex flex-col justify-between rounded-3xl border border-violet-400/20 bg-gradient-to-b from-violet-950/40 to-ink-900/60 p-7 backdrop-blur-sm" style={{ '--stagger': '120ms' }}>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-200">Laporan mesin</h2>
            <span className="flex items-center gap-1.5 text-xs text-emerald-300">
              <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-emerald-400" />
              langsung dari minatmu
            </span>
          </div>

          <VennMinat />

          <dl className="mt-6 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-white/[0.04] px-3 py-3">
              <dt className="text-[11px] text-slate-400">Skor tertinggi</dt>
              <dd className="mt-1 font-mono text-2xl font-bold text-violet-300">
                <AngkaTumbuh nilai={skorTerbaik} />%
              </dd>
            </div>
            <div className="rounded-xl bg-white/[0.04] px-3 py-3">
              <dt className="text-[11px] text-slate-400">A =</dt>
              <dd className="mt-1 truncate font-mono text-sm font-bold text-slate-200" title={tulisHimpunan(A)}>
                {tulisHimpunan(A)}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {pesanan && (
        <div className="anim-naik mb-8 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.07] p-4 text-sm font-medium text-emerald-200" style={{ '--stagger': '240ms' }}>
          Pesanan sebesar{' '}
          <b>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(pesanan.total)}</b> sudah
          dicatat sebagai simulasi. Riwayat interaksimu ikut memperbarui barisan R.
        </div>
      )}

      {/* ============ STRIP METRIK ============ */}
      <section aria-label="Ringkasan aktivitas" className="mb-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Produk terkurasi', nilai: rekom.hasil.length, sub: 'untuk profilmu' },
          { label: 'Kategori tren', nilai: kategoriTren.length, sub: 'sedang naik' },
          { label: 'Minatmu yang tren', nilai: jmlIrisan, sub: 'irisan A ∩ B' },
          { label: 'Produk bertren', nilai: jmlTren, sub: `dari ${PRODUK.length} produk` },
        ].map(({ label, nilai, sub }, i) => (
          <div
            key={label}
            className="panel anim-naik p-5"
            style={{ '--stagger': `${320 + i * 80}ms` }}
          >
            <p className="font-mono text-3xl font-bold text-white">
              <AngkaTumbuh nilai={nilai} />
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-300">{label}</p>
            <p className="text-xs text-slate-500">{sub}</p>
          </div>
        ))}
      </section>

      {/* ============ PANEL MINAT ============ */}
      <div className="anim-naik mb-12" style={{ '--stagger': '620ms' }}>
        <PanelMinat />
      </div>

      {/* ============ REKOMENDASI ============ */}
      <main>
        <div className="anim-naik mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center" style={{ '--stagger': '680ms' }}>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white">Rekomendasi untukmu</h2>
            <p className="mt-1 text-sm text-slate-400">{rekom.hasil.length} produk dipilih dari skor kecocokan tertinggi</p>
          </div>
          <Link to="/katalog" className="btn-secondary !rounded-full !px-5 !py-2.5 text-sm">
            Lihat semua
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rekom.hasil.map(({ item, total, diversifikasi }, i) => (
            <div key={item.id} className="anim-naik" style={{ '--stagger': `${720 + i * 60}ms` }}>
              <KartuProduk item={item} skor={{ total }} diversifikasi={!!diversifikasi} />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
