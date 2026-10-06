import { useApp } from '../store/AppContext'
import { KATEGORI } from '../lib/dataProduk'
import { ringkasanHimpunan, tulisHimpunan } from '../lib/rekomendasi'

const IKON_KATEGORI = {
  Elektronik: '🎧',
  Fashion: '👕',
  Olahraga: '🏋️',
  Buku: '📚',
  'Rumah Tangga': '🏠',
  'Mainan & Hobi': '🧩',
}

export default function PanelMinat() {
  const { minat, ubahMinat, kategoriTren } = useApp()

  const { A, Ac, irisanAT, selisihTA } = ringkasanHimpunan([...minat], kategoriTren, KATEGORI)

  return (
    <section
      aria-label="Pengaturan minat"
      className="panel overflow-hidden"
    >
      <div className="grid md:grid-cols-[1.1fr_0.9fr]">
        {/* Kiri: pemilihan minat */}
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-extrabold tracking-tight text-white">Minatmu</h3>
            <span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs font-bold text-violet-300">
              {A.size}/{KATEGORI.length} dipilih
            </span>
          </div>
          <p className="mb-5 text-sm leading-relaxed text-slate-400">
            Kategori yang kamu pilih menjadi himpunan{' '}
            <span className="font-mono font-semibold text-violet-300">A</span> — mesin rekomendasi menghitung ulang skor
            seketika.
          </p>
          <div className="flex flex-wrap gap-2">
            {KATEGORI.map((k) => {
              const aktif = A.has(k)
              const tren = kategoriTren.includes(k)
              return (
                <label
                  key={k}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${
                    aktif
                      ? 'border-transparent grad-aksi text-white shadow-md shadow-accent-500/25'
                      : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-violet-400/50 hover:text-white'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={aktif}
                    onChange={(e) => ubahMinat(k, e.target.checked)}
                    className="peer sr-only"
                  />
                  <span aria-hidden>{IKON_KATEGORI[k] ?? '🏷️'}</span>
                  {k}
                  {tren && !aktif && <span title="Kategori sedang tren">🔥</span>}
                </label>
              )
            })}
          </div>
          <p className="mt-5 rounded-xl bg-white/[0.04] px-3 py-2 font-mono text-[11px] text-slate-400">
            A = {tulisHimpunan(A)} · Aᶜ = {tulisHimpunan(Ac)}
          </p>
        </div>

        {/* Kanan: analisis terhadap tren */}
        <div className="border-t border-white/[0.06] bg-white/[0.02] p-6 md:border-l md:border-t-0">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-extrabold tracking-tight text-white">Kategori tren</h3>
            <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs font-bold text-amber-300">
              {kategoriTren.length} kategori
            </span>
          </div>
          <p className="mb-5 font-mono text-xs text-slate-400">B = {tulisHimpunan(kategoriTren)}</p>
          <dl className="space-y-2.5 text-xs">
            <div className="rounded-xl bg-white/[0.04] p-3">
              <dt className="font-semibold text-slate-300">A ∩ B — favoritmu yang sedang tren</dt>
              <dd className="mt-1 font-mono text-[11px] font-bold text-emerald-300">{tulisHimpunan(irisanAT)}</dd>
            </div>
            <div className="rounded-xl bg-white/[0.04] p-3">
              <dt className="font-semibold text-slate-300">B − A — tren yang belum kamu ikuti</dt>
              <dd className="mt-1 font-mono text-[11px] font-bold text-amber-300">{tulisHimpunan(selisihTA)}</dd>
            </div>
          </dl>
          <p className="mt-4 text-[11px] leading-relaxed text-slate-500">
            Skor tiap produk = 0.6·kategori + 0.3·rating + 0.1·tren
          </p>
        </div>
      </div>
    </section>
  )
}
