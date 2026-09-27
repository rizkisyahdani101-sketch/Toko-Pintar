import { useMemo, useState } from 'react'
import { useApp } from '../store/AppContext'
import { KATEGORI } from '../lib/dataProduk'
import {
  keHimpunan,
  irisan,
  gabungan,
  komplemen,
  selisih,
  jaccard,
  hitungSkor,
  pergeseranMinat,
  stabilitasMinat,
  estimasiOperasi,
  estimasiOperasiPrefilter,
  BOBOT,
} from '../lib/rekomendasi'
import {
  KODE_HIMPUNAN,
  KODE_JACCARD,
  KODE_SIGMA,
  KODE_REKOMENDASI,
  KODE_BARISAN,
  KODE_BIG_O,
} from '../lib/codeSnippets'
import CodeBlock from '../components/CodeBlock'

const TABS = [
  { id: 'himpunan', label: '⊕ Himpunan & Operasi' },
  { id: 'jaccard', label: '📐 Jaccard Similarity' },
  { id: 'sigma', label: 'Σ Notasi Sigma (Skor)' },
  { id: 'barisan', label: '🔗 Barisan (Riwayat)' },
  { id: 'bigo', label: '📈 Pertumbuhan (Big-O)' },
]

// ---------- Playground: pilih elemen himpunan ----------
function PlaygroundHimpunan() {
  const { kategoriTren } = useApp()
  const [setA, setSetA] = useState(['Elektronik', 'Buku'])
  const [setB, setSetB] = useState(kategoriTren)

  const toggle = (setter) => (elemen) =>
    setter((lama) => (lama.includes(elemen) ? lama.filter((x) => x !== elemen) : [...lama, elemen]))

  const A = keHimpunan(setA)
  const B = keHimpunan(setB)
  const U = keHimpunan(KATEGORI)
  const i = irisan(A, B)
  const g = gabungan(A, B)
  const Ac = komplemen(A, U)
  const s = selisih(A, B)
  const J = jaccard(A, B)

  const Chip = ({ aktif, onClick, children }) => (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
        aktif
          ? 'border-primary-600 bg-primary-600 text-white'
          : 'border-slate-300 text-slate-600 hover:border-primary-400 dark:border-slate-600 dark:text-slate-300'
      }`}
    >
      {children}
    </button>
  )

  const Pilih = ({ nilai, setter, label }) => (
    <div>
      <p className="mb-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {KATEGORI.map((k) => (
          <Chip key={k} aktif={nilai.includes(k)} onClick={() => toggle(setter)(k)}>
            {k}
          </Chip>
        ))}
      </div>
    </div>
  )

  const Hasil = ({ label, rumus, isi, tebal }) => (
    <div className={`rounded-lg p-2 font-mono text-xs ${tebal ? 'bg-primary-50 dark:bg-primary-900/30' : 'bg-slate-50 dark:bg-slate-700/50'}`}>
      <span className="text-slate-500 dark:text-slate-400">{rumus} = </span>
      <span className={tebal ? 'font-bold text-primary-700 dark:text-primary-300' : 'text-slate-700 dark:text-slate-200'}>
        {'{'} {isi.join(', ') || '∅'} {'}'}
      </span>
    </div>
  )

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-1 text-base font-bold text-slate-800 dark:text-slate-100">🧪 Coba Sendiri</h3>
      <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
        Pilih elemen himpunan A dan B, lalu semua operasi dihitung langsung di browser memakai fungsi yang sama dengan
        kode di atas.
      </p>
      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <Pilih nilai={setA} setter={setSetA} label="Himpunan A (mis. minat pengguna)" />
        <Pilih nilai={setB} setter={setSetB} label="Himpunan B (mis. kategori item / tren)" />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Hasil rumus="A ∩ B" isi={[...i]} tebal />
        <Hasil rumus="A ∪ B" isi={[...g]} />
        <Hasil rumus="Aᶜ = U − A" isi={[...Ac]} />
        <Hasil rumus="B − A" isi={[...s]} />
      </div>
      <div className="mt-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-800 p-4 text-white">
        <p className="font-mono text-sm">
          J(A, B) = |A ∩ B| / |A ∪ B| = {i.size}/{g.size} ={' '}
          <b className="text-lg">{J.toFixed(2)}</b>
        </p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/20">
          <div className="h-full rounded-full bg-white transition-all" style={{ width: `${J * 100}%` }} />
        </div>
      </div>
    </div>
  )
}

// ---------- Playground: skor sigma dengan slider bobot ----------
function PlaygroundSigma() {
  const { kategoriTren } = useApp()
  const [minat, setMinat] = useState(['Elektronik', 'Buku'])
  const [w1, setW1] = useState(BOBOT.genre)
  const [w2, setW2] = useState(BOBOT.rating)
  const [w3, setW3] = useState(BOBOT.tren)
  const [itemRating, setItemRating] = useState(4)
  const [itemTren, setItemTren] = useState(true)

  const A = keHimpunan(minat)
  const B = keHimpunan(['Elektronik']) // contoh: item berkategori Elektronik
  const R = keHimpunan([4, 5]) // rating yang disukai pengguna
  const RB = keHimpunan([itemRating])
  const T = keHimpunan(itemTren ? kategoriTren : [])

  const jG = jaccard(A, B)
  const jR = jaccard(R, RB)
  const jT = jaccard(A, T)
  const total = w1 * jG + w2 * jR + w3 * jT

  const Slider = ({ label, w, set }) => (
    <div>
      <div className="mb-1 flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
        <span>{label}</span>
        <span className="font-mono">w = {w.toFixed(1)}</span>
      </div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={w}
        onChange={(e) => set(Number(e.target.value))}
        className="w-full accent-primary-600"
      />
    </div>
  )

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-1 text-base font-bold text-slate-800 dark:text-slate-100">🧪 Simulasi Skor S(u,i)</h3>
      <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
        Contoh item berkategori Elektronik. Geser bobot dan lihat bagaimana skor sigma berubah.
      </p>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-4">
          <Slider label="w₁ · Kategori (genre)" w={w1} set={setW1} />
          <Slider label="w₂ · Rating" w={w2} set={setW2} />
          <Slider label="w₃ · Tren" w={w3} set={setW3} />
          <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-300">
            <label className="flex items-center gap-1.5">
              Rating item:
              <select
                value={itemRating}
                onChange={(e) => setItemRating(Number(e.target.value))}
                className="rounded border border-slate-300 px-2 py-1 dark:border-slate-600 dark:bg-slate-700"
              >
                {[3, 4, 5].map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-1.5">
              <input type="checkbox" checked={itemTren} onChange={(e) => setItemTren(e.target.checked)} />
              Item sedang tren
            </label>
          </div>
        </div>
        <div className="space-y-2 rounded-xl bg-slate-50 p-4 font-mono text-xs text-slate-600 dark:bg-slate-700/50 dark:text-slate-300">
          <p>J₁ (kategori) = {jG.toFixed(2)} → w₁·J₁ = {(w1 * jG).toFixed(3)}</p>
          <p>J₂ (rating) = {jR.toFixed(2)} → w₂·J₂ = {(w2 * jR).toFixed(3)}</p>
          <p>J₃ (tren) = {jT.toFixed(2)} → w₃·J₃ = {(w3 * jT).toFixed(3)}</p>
          <p className="mt-2 border-t border-slate-200 pt-2 text-sm font-bold text-primary-700 dark:border-slate-600 dark:text-primary-300">
            S(u,i) = Σ wₖ·Jₖ = {total.toFixed(3)}
          </p>
        </div>
      </div>
    </div>
  )
}

// ---------- Playground: barisan riwayat ----------
function PlaygroundBarisan() {
  const { riwayat, mulaiPeriodeBaru } = useApp()
  const pergeseran = pergeseranMinat(riwayat)
  const stabilitas = stabilitasMinat(riwayat)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-1 text-base font-bold text-slate-800 dark:text-slate-100">🧪 Riwayat Minat Kamu (Barisan R)</h3>
      <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
        Setiap kali kamu membuka detail produk atau menambah ke keranjang, minat periode ini diperbarui. Tombol di
        bawah menutup periode dan membuka periode baru.
      </p>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {riwayat.map((r, t) => (
          <div key={t} className="flex items-center gap-2">
            <div className="rounded-xl border border-primary-200 bg-primary-50 px-3 py-2 text-center dark:border-primary-800 dark:bg-primary-900/30">
              <p className="text-[10px] font-bold text-primary-500">r{t + 1}</p>
              <p className="font-mono text-[11px] text-primary-800 dark:text-primary-200">{'{'} {r.join(', ') || '∅'} {'}'}</p>
            </div>
            {t < riwayat.length - 1 && <span className="text-slate-400">→</span>}
          </div>
        ))}
      </div>
      <div className="mb-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg bg-green-50 p-2 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-300">
          ➕ Kategori baru periode ini: <b>{pergeseran.baru.join(', ') || '—'}</b>
        </div>
        <div className="rounded-lg bg-rose-50 p-2 text-xs text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
          ➖ Tidak lagi disukai: <b>{pergeseran.hilang.join(', ') || '—'}</b>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Stabilitas minat = J(r{riwayat.length - 1}, r{riwayat.length}) = <b>{stabilitas.toFixed(2)}</b>
        </p>
        <button
          onClick={mulaiPeriodeBaru}
          className="rounded-lg bg-primary-600 px-4 py-2 text-xs font-bold text-white hover:bg-primary-700"
        >
          + Mulai Periode Baru
        </button>
      </div>
    </div>
  )
}

// ---------- Playground: kalkulator Big-O ----------
function PlaygroundBigO() {
  const [m, setM] = useState(1000)
  const [n, setN] = useState(1000)
  const [k, setK] = useState(6)

  const naif = estimasiOperasi(m, n, k)
  const prefilter = estimasiOperasiPrefilter(m, n, k)
  const efisiensi = naif > 0 ? (1 - prefilter / naif) * 100 : 0

  const fmt = (x) => new Intl.NumberFormat('id-ID').format(Math.round(x))
  const Slider = ({ label, v, set, min, max, step }) => (
    <div>
      <div className="mb-1 flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
        <span>{label}</span>
        <span className="font-mono">{fmt(v)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={v} onChange={(e) => set(Number(e.target.value))} className="w-full accent-primary-600" />
    </div>
  )

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-1 text-base font-bold text-slate-800 dark:text-slate-100">🧪 Kalkulator Kompleksitas O(m × n × k)</h3>
      <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
        Geser jumlah pengguna (m), item (n), dan ukuran rata-rata himpunan (k). Bandingkan pendekatan naif vs
        pre-filtering.
      </p>
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <Slider label="m · pengguna" v={m} set={setM} min={100} max={100000} step={100} />
        <Slider label="n · item" v={n} set={setN} min={100} max={100000} step={100} />
        <Slider label="k · ukuran himpunan" v={k} set={setK} min={2} max={20} step={1} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-rose-50 p-4 dark:bg-rose-900/30">
          <p className="mb-1 text-xs font-bold text-rose-600 dark:text-rose-300">Naif — O(m × n × k)</p>
          <p className="font-mono text-xl font-bold text-rose-700 dark:text-rose-200">{fmt(naif)}</p>
          <p className="text-[11px] text-rose-500 dark:text-rose-300/70">operasi irisan himpunan</p>
        </div>
        <div className="rounded-xl bg-green-50 p-4 dark:bg-green-900/30">
          <p className="mb-1 text-xs font-bold text-green-600 dark:text-green-300">Pre-filtering (±20% kandidat)</p>
          <p className="font-mono text-xl font-bold text-green-700 dark:text-green-200">{fmt(prefilter)}</p>
          <p className="text-[11px] text-green-500 dark:text-green-300/70">hemat ±{efisiensi.toFixed(0)}% operasi</p>
        </div>
      </div>
    </div>
  )
}

// ---------- Halaman utama ----------
export default function LogikaMatematika() {
  const [tab, setTab] = useState('himpunan')

  const konten = {
    himpunan: {
      judul: 'Himpunan & Operasi Himpunan',
      teori: (
        <>
          <p className="mb-3">
            Minat pengguna dan atribut item direpresentasikan sebagai <b>himpunan</b>. Misalkan <b>U</b> = himpunan
            semesta kategori, <b>A</b> = kategori yang disukai pengguna, <b>B</b> = kategori yang sedang tren.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-600">
                  <th className="py-2 pr-4">Operasi</th>
                  <th className="py-2 pr-4">Notasi</th>
                  <th className="py-2">Makna dalam sistem</th>
                </tr>
              </thead>
              <tbody className="text-slate-600 dark:text-slate-300">
                {[
                  ['Irisan', 'A ∩ B', 'Genre favorit yang juga tren → kandidat rekomendasi utama'],
                  ['Gabungan', 'A ∪ B', 'Seluruh genre relevan → cakupan eksplorasi'],
                  ['Komplemen', 'Aᶜ = U − A', 'Belum pernah disukai → potensi rekomendasi baru (diversifikasi)'],
                  ['Selisih', 'B − A', 'Tren yang belum disukai → peluang memperluas minat'],
                ].map(([a, b, c]) => (
                  <tr key={a} className="border-b border-slate-100 dark:border-slate-700">
                    <td className="py-2 pr-4 font-semibold">{a}</td>
                    <td className="py-2 pr-4 font-mono">{b}</td>
                    <td className="py-2">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ),
      kode: [{ judul: 'src/lib/rekomendasi.js', isi: KODE_HIMPUNAN }],
      playground: <PlaygroundHimpunan />,
    },
    jaccard: {
      judul: 'Koefisien Kemiripan Jaccard',
      teori: (
        <>
          <p className="mb-3">
            Seberapa mirip dua himpunan? Fungsi similarity memetakan pasangan (A, B) ke bilangan real [0, 1]:
          </p>
          <p className="mb-3 rounded-xl bg-slate-100 p-4 text-center font-mono text-lg font-bold text-primary-700 dark:bg-slate-700 dark:text-primary-300">
            J(A, B) = |A ∩ B| / |A ∪ B|
          </p>
          <p>
            Contoh dari laporan: A = {'{'}Aksi, Sci-Fi, Drama{'}'}, B = {'{'}Sci-Fi, Drama{'}'} → |A∩B| = 2, |A∪B| = 3 →
            J = 2/3 ≈ 0.67 (kecocokan tinggi).
          </p>
        </>
      ),
      kode: [{ judul: 'src/lib/rekomendasi.js', isi: KODE_JACCARD }],
      playground: <PlaygroundHimpunan />,
    },
    sigma: {
      judul: 'Notasi Sigma — Skor Gabungan Berbobot',
      teori: (
        <>
          <p className="mb-3">
            Rekomendasi mempertimbangkan beberapa kriteria sekaligus. Skor total item <i>i</i> untuk pengguna <i>u</i>:
          </p>
          <p className="mb-3 rounded-xl bg-slate-100 p-4 text-center font-mono text-lg font-bold text-primary-700 dark:bg-slate-700 dark:text-primary-300">
            S(u, i) = Σₖ₌₁ⁿ wₖ · Jₖ(u, i)
          </p>
          <ul className="list-inside list-disc space-y-1 text-sm">
            <li>Jₖ(u,i) = skor kemiripan pada kriteria ke-k (kategori, rating, tren)</li>
            <li>wₖ = bobot kepentingan (0.6 / 0.3 / 0.1 — jumlahnya 1)</li>
            <li>n = jumlah kriteria (di sistem ini 3)</li>
          </ul>
        </>
      ),
      kode: [
        { judul: 'src/lib/rekomendasi.js — skor', isi: KODE_SIGMA },
        { judul: 'src/lib/rekomendasi.js — perangkingan & diversifikasi', isi: KODE_REKOMENDASI },
      ],
      playground: <PlaygroundSigma />,
    },
    barisan: {
      judul: 'Barisan — Riwayat Minat Pengguna',
      teori: (
        <>
          <p className="mb-3">Riwayat interaksi pengguna dimodelkan sebagai barisan waktu:</p>
          <p className="mb-3 rounded-xl bg-slate-100 p-4 text-center font-mono text-lg font-bold text-primary-700 dark:bg-slate-700 dark:text-primary-300">
            R = (r₁, r₂, r₃, …, rₜ)
          </p>
          <p>
            dengan rₜ = himpunan kategori yang disukai pada periode <i>t</i>. Pergeseran minat terdeteksi dengan
            membandingkan rₜ₋₁ dan rₜ (elemen baru = B−A, elemen hilang = A−B), dan stabilitas diukur dengan
            J(rₜ₋₁, rₜ).
          </p>
        </>
      ),
      kode: [{ judul: 'src/lib/rekomendasi.js', isi: KODE_BARISAN }],
      playground: <PlaygroundBarisan />,
    },
    bigo: {
      judul: 'Pertumbuhan Fungsi — Analisis Kompleksitas',
      teori: (
        <>
          <p className="mb-3">
            Untuk <b>m</b> pengguna dan <b>n</b> item, perhitungan skor semua kombinasi secara naif membutuhkan O(m ×
            n). Setiap pasangan memerlukan operasi irisan himpunan O(k) dengan hash set (k = ukuran rata-rata
            himpunan):
          </p>
          <p className="mb-3 rounded-xl bg-slate-100 p-4 text-center font-mono text-lg font-bold text-primary-700 dark:bg-slate-700 dark:text-primary-300">
            O(m × n × k)
          </p>
          <p>
            Karena itu diperlukan optimasi seperti <b>pre-filtering</b> (mis. hanya kandidat kategori populer yang
            dihitung penuh) agar sistem tetap efisien saat data berskala jutaan.
          </p>
        </>
      ),
      kode: [{ judul: 'src/lib/rekomendasi.js', isi: KODE_BIG_O }],
      playground: <PlaygroundBigO />,
    },
  }

  const aktif = konten[tab]

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-1 text-2xl font-extrabold text-slate-800 dark:text-slate-100">
        🧮 Logika Matematika & Kode Program
      </h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        Konsep Matematika Diskrit di balik sistem rekomendasi TokoPintar — lengkap dengan teori, kode sumber asli yang
        dipakai sistem, dan simulasi interaktif. (Laporan Rekayasa Ide — Kelompok 4)
      </p>

      {/* Tab */}
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              tab === t.id
                ? 'bg-primary-600 text-white shadow'
                : 'bg-white text-slate-600 shadow-sm hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Konten tab aktif */}
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="mb-3 text-lg font-bold text-slate-800 dark:text-slate-100">{aktif.judul}</h2>
        <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{aktif.teori}</div>
      </section>

      <section className="mb-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Kode Program Asli</h2>
        {aktif.kode.map((k) => (
          <CodeBlock key={k.judul} judul={k.judul} kode={k.isi} />
        ))}
      </section>

      <section className="mb-10">{aktif.playground}</section>
    </div>
  )
}
