import { useState } from 'react'
import { useApp } from '../store/AppContext'
import { KATEGORI } from '../lib/dataProduk'
import {
  keHimpunan,
  irisan,
  gabungan,
  komplemen,
  selisih,
  jaccard,
  pergeseranMinat,
  stabilitasMinat,
  skalaKecocokan,
} from '../lib/rekomendasi'
import {
  KODE_HIMPUNAN,
  KODE_BARISAN,
} from '../lib/codeSnippets'
import CodeBlock from '../components/CodeBlock'

const TABS = [
  { id: 'himpunan', label: '⊕ Himpunan & Operasi' },
  { id: 'barisan', label: '🔗 Barisan (Riwayat)' },
]

// ---------- Playground: pilih elemen himpunan ----------
function PlaygroundHimpunan() {
  const { kategoriTren } = useApp()
  // Playground mulai kosong — sesuai prinsip "mulai kosong" aplikasi:
  // pengguna membangun himpunannya sendiri dari nol.
  const [setA, setSetA] = useState([])
  const [setB, setSetB] = useState([])

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
          ? 'grad-aksi border-transparent text-white shadow-sm shadow-accent-500/25'
          : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-violet-400/50 hover:text-white'
      }`}
    >
      {children}
    </button>
  )

  const Pilih = ({ nilai, setter, label }) => (
    <div>
      <p className="mb-1.5 text-xs font-bold text-slate-400">{label}</p>
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
    <div className={`rounded-lg p-2 font-mono text-xs ${      tebal ? 'bg-violet-500/15' : 'bg-white/[0.03]'}`}>
      <span className="text-slate-400">{rumus} = </span>
      <span className={tebal ? 'font-bold text-violet-300' : 'text-slate-200'}>
        {'{'} {isi.join(', ') || '∅'} {'}'}
      </span>
    </div>
  )

  return (
    <div className="rounded-2xl panel p-5">
      <h3 className="mb-1 text-base font-bold text-slate-100">🧪 Coba Sendiri</h3>
      <p className="mb-4 text-xs text-slate-400">
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
      <div className="mt-3 overflow-hidden rounded-[22px] border border-accent-200/70 bg-gradient-to-br from-accent-600 via-accent-700 to-indigo-950 p-4 text-white shadow-[0_18px_35px_-15px_rgba(76,29,149,0.55)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-accent-100/80">
              Market fit score
            </p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black leading-none">{J.toFixed(2)}</span>
              <span className="pb-1 text-xs font-semibold text-violet-200/80">/ 1.00</span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-sm md:self-auto">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.9)]" />
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-white">
              {skalaKecocokan(Math.round(J * 100)).label}
            </span>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-white/10 p-3 backdrop-blur-md">
          <div className="mb-2 flex items-center justify-between text-[11px] font-semibold text-accent-50/90">
            <span>Skala kompatibilitas</span>
            <span>{Math.round(J * 100)}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/15">
            <div
              className={`h-full rounded-full ${skalaKecocokan(Math.round(J * 100)).bar} transition-all duration-500`}
              style={{ width: `${Math.min(100, Math.round(J * 100))}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[10px] font-semibold text-accent-100/80">
            <span>0</span>
            <span>0.5</span>
            <span>1</span>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <div className="rounded-xl bg-white/10 p-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-accent-100/70">Irisan</p>
            <p className="mt-1 font-mono text-sm font-bold text-white">{i.size}</p>
          </div>
          <div className="rounded-xl bg-white/10 p-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-accent-100/70">Gabungan</p>
            <p className="mt-1 font-mono text-sm font-bold text-white">{g.size}</p>
          </div>
          <div className="rounded-xl bg-white/10 p-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-accent-100/70">Rumus</p>
            <p className="mt-1 font-mono text-xs font-bold text-white">|A∩B| / |A∪B|</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------- Playground: barisan riwayat ----------
function PlaygroundBarisan() {
  const { riwayat, mulaiPeriodeBaru, hapusRiwayat, hapusSemuaRiwayat } = useApp()
  const [hapusMode, setHapusMode] = useState(false)
  const pergeseran = pergeseranMinat(riwayat)
  const stabilitas = stabilitasMinat(riwayat)

  return (
    <div className="rounded-2xl panel p-5">
      <h3 className="mb-1 text-base font-bold text-slate-100">🧪 Riwayat Minat Kamu (Barisan R)</h3>
      <p className="mb-4 text-xs text-slate-400">
        Setiap kali kamu membuka detail produk atau menambah ke keranjang, minat periode ini diperbarui. Tombol di
        bawah menutup periode dan membuka periode baru.
      </p>

      {riwayat.length === 0 ? (
        <div className="mb-4 rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-6 text-center text-sm text-slate-400">
          Belum ada riwayat minat. Kamu bisa memulai periode baru untuk menambahkan data.
        </div>
      ) : (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {riwayat.map((r, t) => (
            <div key={t} className="flex items-center gap-2">
              <div className="rounded-xl border border-violet-400/25 bg-violet-500/10 px-3 py-2 text-center">
                {hapusMode && (
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <p className="text-[10px] font-bold text-violet-300">r{t + 1}</p>
                    <button
                      type="button"
                      onClick={() => hapusRiwayat(t)}
                      className="text-[9px] font-semibold text-rose-500 transition hover:text-rose-700"
                      aria-label={`Hapus riwayat periode ${t + 1}`}
                    >
                      Hapus
                    </button>
                  </div>
                )}
                {!hapusMode && <p className="mb-1 text-[10px] font-bold text-accent-500">r{t + 1}</p>}
                <p className="font-mono text-[11px] text-violet-200">{'{'} {r.join(', ') || '∅'} {'}'}</p>
              </div>
              {t < riwayat.length - 1 && <span className="text-slate-400">→</span>}
            </div>
          ))}
        </div>
      )}

      <div className="mb-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg bg-emerald-500/10 p-2 text-xs text-emerald-300">
          ➕ Kategori baru periode ini: <b>{pergeseran.baru.join(', ') || '—'}</b>
        </div>
        <div className="rounded-lg bg-rose-500/10 p-2 text-xs text-rose-300">
          ➖ Tidak lagi disukai: <b>{pergeseran.hilang.join(', ') || '—'}</b>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-400">
          {riwayat.length >= 2 ? (
            <>
              Stabilitas minat = J(r{riwayat.length - 1}, r{riwayat.length}) = <b>{stabilitas.toFixed(2)}</b>
            </>
          ) : (
            <>
              Stabilitas minat: <b>Belum cukup data</b>
            </>
          )}
        </p>
        <div className="flex flex-wrap gap-2">
          {riwayat.length > 0 && (
            <button
              onClick={() => setHapusMode((v) => !v)}
              className={`rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-wide ${
                hapusMode
                  ? 'border border-white/10 bg-white/[0.06] text-slate-200 hover:bg-white/[0.12]'
                  : 'border border-rose-400/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20'
              }`}
            >
              {hapusMode ? 'Selesai' : 'Hapus Riwayat'}
            </button>
          )}
          {hapusMode && riwayat.length > 0 && (
            <button
              onClick={hapusSemuaRiwayat}
              className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-rose-300 hover:bg-rose-500/20"
            >
              Hapus Semua
            </button>
          )}
          <button
            onClick={mulaiPeriodeBaru}
            className="grad-aksi rounded-lg px-4 py-2 text-xs font-bold text-white shadow-sm shadow-accent-500/25"
          >
            + Mulai Periode Baru
          </button>
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
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="py-2 pr-4">Operasi</th>
                  <th className="py-2 pr-4">Notasi</th>
                  <th className="py-2">Makna dalam sistem</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {[
                  ['Irisan', 'A ∩ B', 'Genre favorit yang juga tren → kandidat rekomendasi utama'],
                  ['Gabungan', 'A ∪ B', 'Seluruh genre relevan → cakupan eksplorasi'],
                  ['Komplemen', 'Aᶜ = U − A', 'Belum pernah disukai → potensi rekomendasi baru (diversifikasi)'],
                  ['Selisih', 'B − A', 'Tren yang belum disukai → peluang memperluas minat'],
                ].map(([a, b, c]) => (
                  <tr key={a} className="border-b border-white/[0.06]">
                    <td className="py-2 pr-4 font-semibold">{a}</td>
                    <td className="py-2 pr-4 font-mono">{b}</td>
                    <td className="py-2">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mb-3">
            Dari operasi di atas lahir dua koefisien kemiripan: <b>Jaccard</b> <span className="font-mono">J(A, B) = |A ∩ B| / |A ∪ B|</span> dan <b>tumpang tindih</b> <span className="font-mono">O(A, B) = |A ∩ B| / min(|A|, |B|)</span>. <b>O</b> adalah dasar skor kecocokan karena bernilai 1 saat atribut item benar-benar cocok — sehingga skor bisa mencapai <b>100%</b> dan dipetakan ke <b>5 skala</b>: Tidak Cocok, Kurang Cocok, Cukup Cocok, Cocok, Sangat Cocok (skala terakhir hanya muncul di <b>100%</b>).
          </p>
        </>
      ),
      kode: [{ judul: 'src/lib/rekomendasi.js', isi: KODE_HIMPUNAN }],
      playground: <PlaygroundHimpunan />,
    },
    barisan: {
      judul: 'Barisan — Riwayat Minat Pengguna',
      teori: (
        <>
          <p className="mb-3">Riwayat interaksi pengguna dimodelkan sebagai barisan waktu:</p>
          <p className="mb-3 rounded-xl bg-white/[0.05] p-4 text-center font-mono text-lg font-bold text-violet-300">
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
  }

  const aktif = konten[tab]

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 md:px-6">
      <h1 className="mb-1 text-3xl font-extrabold tracking-tight text-white">Himpunan & Barisan</h1>
      <p className="mb-6 text-sm text-slate-400">
        Dua konsep Matematika Diskrit di balik sistem rekomendasi TokoPintar — himpunan dan barisan — lengkap dengan teori, kode sumber asli yang
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
                ? 'grad-aksi text-white shadow-md shadow-accent-500/30'
                : 'border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Konten tab aktif */}
      <section className="mb-6 rounded-2xl panel p-6">
        <h2 className="mb-3 text-lg font-bold text-slate-100">{aktif.judul}</h2>
        <div className="text-sm leading-relaxed text-slate-300">{aktif.teori}</div>
      </section>

      <section className="mb-6 space-y-4">
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">Kode program asli</h2>
        {aktif.kode.map((k) => (
          <CodeBlock key={k.judul} judul={k.judul} kode={k.isi} />
        ))}
      </section>

      <section className="mb-10">{aktif.playground}</section>
    </div>
  )
}
