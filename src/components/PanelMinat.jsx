import { useApp } from '../store/AppContext'
import { KATEGORI } from '../lib/dataProduk'
import { komplemen, keHimpunan } from '../lib/rekomendasi'

// Panel pemilihan himpunan minat pengguna (A) via checkbox kategori
export default function PanelMinat() {
  const { minat, ubahMinat, kategoriTren } = useApp()

  const A = minat
  const U = keHimpunan(KATEGORI)
  const Ac = komplemen(A, U)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-1 text-sm font-bold text-slate-800 dark:text-slate-100">
        🎯 Minat Saya <span className="font-mono text-xs text-slate-400">(himpunan A)</span>
      </h3>
      <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
        Centang kategori yang kamu sukai — rekomendasi langsung dihitung ulang dari irisan minat.
      </p>
      <div className="flex flex-wrap gap-2">
        {KATEGORI.map((k) => {
          const aktif = A.has(k)
          const tren = kategoriTren.includes(k)
          return (
            <label
              key={k}
              className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                aktif
                  ? 'border-primary-600 bg-primary-600 text-white'
                  : 'border-slate-300 text-slate-600 hover:border-primary-400 dark:border-slate-600 dark:text-slate-300'
              }`}
            >
              <input
                type="checkbox"
                checked={aktif}
                onChange={(e) => ubahMinat(k, e.target.checked)}
                className="hidden"
              />
              {tren && !aktif && '🔥 '}
              {aktif && '✓ '}
              {k}
            </label>
          )
        })}
      </div>
      <p className="mt-3 rounded-lg bg-slate-50 p-2 font-mono text-[11px] text-slate-500 dark:bg-slate-700/50 dark:text-slate-400">
        A = {'{'}
        {[...A].join(', ') || '∅'}
        {'}'} · Aᶜ = {'{'}
        {[...Ac].join(', ') || '∅'}
        {'}'}
      </p>
    </div>
  )
}
