import { rincianSkor, skalaKecocokan, SKALA_KECOCKAN } from './src/lib/rekomendasi.js'
import { PRODUK, KATEGORI, USER_DEFAULT, hitungKategoriTren } from './src/lib/dataProduk.js'

const kategoriTren = hitungKategoriTren(PRODUK)
let gagal = 0
const ok = (kondisi, pesan) => {
  if (kondisi) console.log('OK   ' + pesan)
  else { gagal++; console.log('GAGAL ' + pesan) }
}

// 1. Struktur band persis seperti yang diminta
const eksak = [
  ['Tidak Cocok', 0, 20],
  ['Kurang Cocok', 21, 35],
  ['Cukup Cocok', 36, 65],
  ['Cocok', 66, 99],
  ['Sangat Cocok', 100, 100],
]
SKALA_KECOCKAN.forEach((s, i) => {
  const [l, mn, mx] = eksak[i]
  ok(s.label === l && s.min === mn && s.max === mx, `band ${s.label} = ${s.min}-${s.max}`)
})
for (let i = 1; i < SKALA_KECOCKAN.length; i++) {
  const prev = SKALA_KECOCKAN[i - 1]
  const cur = SKALA_KECOCKAN[i]
  ok(cur.min === prev.max + 1, `tanpa celah: ${prev.max} -> ${cur.min}`)
}

// 2. skalaKecocokan: Sangat Cocok HANYA di 100
ok(skalaKecocokan(100).label === 'Sangat Cocok', '100% -> Sangat Cocok')
ok(skalaKecocokan(99).label === 'Cocok', '99% -> Cocok')
ok(skalaKecocokan(0).label === 'Tidak Cocok', '0% -> Tidak Cocok')
ok(skalaKecocokan(-5).label === 'Tidak Cocok', '-5% -> dibatasi Tidak Cocok')
ok(skalaKecocokan(150).label === 'Sangat Cocok', '150% -> dibatasi 100')
let bocor = []
for (let p = 0; p <= 99; p++) if (skalaKecocokan(p).label === 'Sangat Cocok') bocor.push(p)
ok(bocor.length === 0, 'tidak ada persen < 100 yang dapat Sangat Cocok')

// Profil uji eksplisit — USER_DEFAULT kini sengaja kosong (prinsip "mulai
// kosong": kunjungan pertama tanpa pilihan awal), jadi test memakai profil
// contoh yang mewakili pengguna aktif.
const PROFIL_UJI = { minat: ['Elektronik', 'Buku'], ratingSuka: [4, 5] }

// 3. Skor maksimum benar-benar bisa 100% dengan profil contoh
const user = PROFIL_UJI
const skorSemua = PRODUK.map((p) => ({ p, persen: Math.round(rincianSkor(user, p, kategoriTren).total * 100) }))
const maks = Math.max(...skorSemua.map((x) => x.persen))
ok(maks === 100, `skor maksimum profil contoh = ${maks}%`)
const sempurna = skorSemua.filter((x) => x.persen === 100)
ok(sempurna.length > 0, `${sempurna.length} produk mencapai 100% (Sangat Cocok)`)

// 4. Dengan profil contoh, kelima label muncul
const labelsDefault = new Set(skorSemua.map((x) => skalaKecocokan(x.persen).label))
ok(labelsDefault.size === 5, `profil contoh: ${labelsDefault.size}/5 label -> ${[...labelsDefault].join(', ')}`)

// 5. Semua konfigurasi minat: label Sangat Cocok muncul hanya untuk persen 100
const konfig = [[], ['Elektronik'], ['Elektronik', 'Buku'], KATEGORI, ['Fashion', 'Olahraga'], ['Buku']]
let semuaLabel = new Set()
let pelanggaran = []
let persenList = new Set()
for (const minat of konfig) {
  const u = { minat, ratingSuka: [4, 5] }
  for (const p of PRODUK) {
    const persen = Math.round(rincianSkor(u, p, kategoriTren).total * 100)
    const lbl = skalaKecocokan(persen).label
    if (lbl === 'Sangat Cocok' && persen !== 100) pelanggaran.push(`${p.nama}: ${persen}%`)
    semuaLabel.add(lbl)
    persenList.add(persen)
  }
}
ok(pelanggaran.length === 0, `tidak ada Sangat Cocok palsu di ${konfig.length} konfigurasi`)
ok(semuaLabel.size === 5, `semua konfigurasi: ${semuaLabel.size}/5 label tercapai`)
console.log('Sebaran persen yang mungkin: ' + [...persenList].sort((a, b) => a - b).join(', '))

// 6. Skor selalu dalam [0, 1]
let diLuar = []
for (const minat of konfig) {
  for (const p of PRODUK) {
    const t = rincianSkor({ minat, ratingSuka: [4, 5] }, p, kategoriTren).total
    if (t < 0 || t > 1) diLuar.push(`${p.nama}: ${t}`)
  }
}
ok(diLuar.length === 0, 'skor selalu dalam [0, 1]')

console.log(gagal ? `ADA ${gagal} GAGAL` : 'SEMUA LULUS')
process.exit(gagal ? 1 : 0)
