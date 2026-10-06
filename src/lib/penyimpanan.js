// ============================================================
// PENYIMPANAN STATE — TokoPintar
//
// State aplikasi (minat, keranjang, wishlist, riwayat, pesanan)
// disimpan di database MySQL via API PHP (Laragon). Identitas
// tanpa login: ID acak 64-hex per perangkat yang hidup di
// localStorage — pengguna berbeda perangkat = data berbeda.
//
// Lapisan:
//   1. localStorage  — cache untuk tampilan instan & fallback offline
//   2. MySQL (server)— sumber kebenaran; refresh tidak menghapus apa pun
// ============================================================

const KUNCI_ID = 'tp_device_id'

/** ID perangkat anonim — dibuat sekali, dipakai ulang selamanya. */
export function ambilIdPerangkat() {
  try {
    const ada = localStorage.getItem(KUNCI_ID)
    if (ada && /^[a-f0-9]{64}$/.test(ada)) return ada
    const acak = new Uint8Array(32)
    window.crypto.getRandomValues(acak)
    const id = [...acak].map((b) => b.toString(16).padStart(2, '0')).join('')
    localStorage.setItem(KUNCI_ID, id)
    return id
  } catch {
    // localStorage diblokir — ID sesi saja (state tetap jalan, tidak persist)
    let id = ''
    for (let i = 0; i < 64; i++) id += Math.floor(Math.random() * 16).toString(16)
    return id
  }
}

/** Ambil state tersimpan dari server. null = perangkat baru / offline / error. */
export async function muatServer(id) {
  try {
    const r = await fetch(`/api/state.php?id=${encodeURIComponent(id)}`)
    if (!r.ok) return null
    const j = await r.json()
    return j && j.ok ? (j.data ?? null) : null
  } catch {
    return null
  }
}

/** Simpan sebagian kunci state ke server (upsert). true bila berhasil. */
export async function simpanServer(id, data) {
  try {
    const r = await fetch('/api/state.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, data }),
    })
    return r.ok
  } catch {
    return false
  }
}
