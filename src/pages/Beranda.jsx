import { useApp } from '../store/AppContext'
import { PRODUK, KATEGORI } from '../lib/dataProduk'
import { rekomendasikan, keHimpunan, komplemen } from '../lib/rekomendasi'
import KartuProduk from '../components/KartuProduk'
import PanelMinat from '../components/PanelMinat'
import { Link } from 'react-router-dom'

export default function Beranda() {
  const { minat, minatArr, ratingSukaArr, kategoriTren, riwayat, pesanan } = useApp()

  const user = { minat: minatArr, ratingSuka: ratingSukaArr }
  const rekom = rekomendasikan(user, PRODUK, kategoriTren, 8)
  const A = minat
  const Ac = komplemen(A, keHimpunan(KATEGORI))

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Hero */}
      <section className="mb-8 rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 p-8 text-white shadow-xl md:p-12">
        <h1 className="mb-3 text-3xl font-extrabold md:text-4xl">
          Belanja Sesuai Minatmu, <br className="hidden md:block" /> Dihitung dengan Matematika Diskrit
        </h1>
        <p className="mb-6 max-w-2xl text-sm text-primary-100 md:text-base">
          TokoPintar merekomendasikan produk dari <b>irisan minat</b> — operasi himpunan{' '}
          <span className="font-mono">A ∩ B</span>, koefisien <span className="font-mono">Jaccard</span>, skor{' '}
          <span className="font-mono">S(u,i) = Σ wₖ·Jₖ</span>, dan diversifikasi lewat komplemen{' '}
          <span className="font-mono">Aᶜ</span>.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/katalog" className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-primary-700 shadow hover:bg-primary-50">
            Lihat Katalog
          </Link>
          <Link
            to="/logika"
            className="rounded-xl border border-white/40 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/10"
          >
            🧮 Lihat Logika Matematikanya
          </Link>
        </div>
      </section>

      {pesanan && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-200">
          ✅ Terima kasih! Pesanan sebesar{' '}
          <b>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(pesanan.total)}</b> telah
          dicatat (simulasi).
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-4">
          <PanelMinat />
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h3 className="mb-2 text-sm font-bold text-slate-800 dark:text-slate-100">
              🔥 Kategori Tren <span className="font-mono text-xs text-slate-400">(himpunan B)</span>
            </h3>
            <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
              B = {'{'}
              {kategoriTren.join(', ') || '∅'}
              {'}'}
            </p>
            <p className="mt-2 font-mono text-[11px] text-slate-500 dark:text-slate-400">
              A ∩ B = {'{'}
              {[...keHimpunan(minatArr.filter((x) => kategoriTren.includes(x)))].join(', ') || '∅'}
              {'}'} · B − A = {'{'}
              {[...keHimpunan(kategoriTren.filter((x) => !minatArr.includes(x)))].join(', ') || '∅'}
              {'}'}
            </p>
          </div>
        </aside>

        <main>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Rekomendasi Untukmu</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Diurutkan berdasarkan skor S(u,i) tertinggi — item ungu adalah hasil diversifikasi dari B − A.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {rekom.hasil.map(({ item, total, diversifikasi }) => (
              <KartuProduk key={item.id} item={item} skor={{ total }} diversifikasi={!!diversifikasi} />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
