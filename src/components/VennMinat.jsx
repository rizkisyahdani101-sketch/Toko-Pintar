import { useApp } from '../store/AppContext'
import { ringkasanHimpunan } from '../lib/rekomendasi'
import { KATEGORI } from '../lib/dataProduk'

/**
 * Diagram Venn live — bintang visual dashboard.
 * Dua lingkaran (A = minatmu, B = kategori tren) digambar sebagai SVG dan
 * saling tumpang tindih; irisannya diisi emerald dan berdenyut halus.
 * Aria: makna diagram dinyatakan di <title>/<desc> untuk pembaca layar.
 */
export default function VennMinat() {
  const { minat, kategoriTren } = useApp()
  const { A, irisanAT } = ringkasanHimpunan([...minat], kategoriTren, KATEGORI)

  const nA = A.size
  const nIris = irisanAT.size
  const nB = kategoriTren.length

  const kosong = nIris === 0
  const persenIrisan = nB ? Math.round((nIris / nB) * 100) : 0

  return (
    <figure className="flex flex-col items-center">
      <svg viewBox="0 0 220 130" className="h-auto w-full max-w-[240px]" role="img" aria-labelledby="venn-title venn-desc">
        <title id="venn-title">Diagram Venn minat dan tren</title>
        <desc id="venn-desc">
          {nA} kategori minat, {nB} kategori tren, {nIris} di antaranya beririsan.
        </desc>

        {/* Lingkaran A (violet) */}
        <circle
          cx="82"
          cy="65"
          r="44"
          className={kosong ? 'fill-violet-500/10 stroke-violet-400/40' : 'fill-violet-500/25 stroke-violet-400/70'}
          strokeWidth="1.5"
        />
        {/* Lingkaran B (indigo) */}
        <circle
          cx="138"
          cy="65"
          r="44"
          className="fill-indigo-500/15 stroke-indigo-400/50"
          strokeWidth="1.5"
        />
        {/* Irisan A∩B — emerald, berdenyut saat ada kecocokan */}
        {!kosong && (
          <clipPath id="clip-venn-a">
            <circle cx="82" cy="65" r="44" />
          </clipPath>
        )}
        {nIris > 0 && (
          <g clipPath="url(#clip-venn-a)">
            <circle cx="138" cy="65" r="44" className="fill-emerald-400/35 animate-pulse-soft" />
          </g>
        )}

        {/* Label A / B di luar tumpang tindih */}
        <text x="46" y="72" textAnchor="middle" className="fill-violet-200 text-[13px] font-bold" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          A
        </text>
        <text x="174" y="72" textAnchor="middle" className="fill-indigo-200 text-[13px] font-bold" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          B
        </text>
        {/* Angka irisan di tengah lensa */}
        {nIris > 0 && (
          <text x="110" y="70" textAnchor="middle" className="fill-emerald-200 text-[15px] font-extrabold" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {nIris}
          </text>
        )}
      </svg>

      <figcaption className="mt-2 text-center text-xs text-slate-400">
        {kosong ? (
          <>Pilih minat untuk melihat <span className="font-mono font-semibold text-violet-300">A ∩ B</span></>
        ) : (
          <>
            <span className="font-mono font-semibold text-emerald-300">{nIris} kategori</span> cocok dengan tren —{' '}
            <span className="font-mono font-semibold text-slate-200">{persenIrisan}%</span> dari B
          </>
        )}
      </figcaption>
    </figure>
  )
}
