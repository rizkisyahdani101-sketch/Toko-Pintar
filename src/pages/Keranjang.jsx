import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp, formatRupiah } from '../store/AppContext'
import { PRODUK } from '../lib/dataProduk'
import FotoProduk from '../components/FotoProduk'

export default function Keranjang() {
  const { keranjang, ubahJumlah, hapusDariKeranjang, checkout, pesanan } = useApp()
  const [form, setForm] = useState({ nama: '', alamat: '', telepon: '' })
  const [selesai, setSelesai] = useState(false)

  const total = keranjang.reduce((s, x) => s + x.harga * x.jumlah, 0)

  const submit = (e) => {
    e.preventDefault()
    if (!form.nama.trim() || !form.alamat.trim()) return
    checkout(form)
    setSelesai(true)
  }

  const inputCls =
    'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100'

  if (selesai && pesanan) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mb-4 text-6xl">🎉</div>
        <h1 className="mb-2 text-2xl font-extrabold text-slate-800 dark:text-slate-100">Pesanan Berhasil! (Simulasi)</h1>
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          Terima kasih, {pesanan.nama}. Total belanja{' '}
          <b className="text-primary-600">{formatRupiah(pesanan.total)}</b> untuk {pesanan.items.length} produk. Ini
          hanya simulasi — tidak ada pembayaran sungguhan.
        </p>
        <div className="mb-6 space-y-2 rounded-2xl border border-slate-200 bg-white p-4 text-left text-sm shadow-sm dark:border-slate-700 dark:bg-slate-800">
          {pesanan.items.map((x) => {
            const produk = PRODUK.find((item) => item.id === x.id) ?? x
            return (
              <div key={x.id} className="flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-3 text-slate-600 dark:text-slate-300">
                  <FotoProduk item={produk} className="h-10 w-10 shrink-0 rounded-lg" />
                  <span className="truncate">{x.nama} × {x.jumlah}</span>
                </span>
                <span className="shrink-0 font-medium text-slate-800 dark:text-slate-100">{formatRupiah(x.harga * x.jumlah)}</span>
              </div>
            )
          })}
        </div>
        <Link to="/" className="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-primary-700">
          Kembali ke Beranda
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-extrabold text-slate-800 dark:text-slate-100">🛍️ Keranjang Belanja</h1>

      {keranjang.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 py-20 text-center dark:border-slate-600">
          <p className="mb-4 text-slate-400">Keranjangmu masih kosong.</p>
          <Link to="/katalog" className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-700">
            Lihat Produk
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Daftar item */}
          <div className="space-y-3">
            {keranjang.map((x) => (
              <div
                key={x.id}
                className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <FotoProduk
                  item={PRODUK.find((item) => item.id === x.id) ?? x}
                  gambar={x.gambar ?? PRODUK.find((item) => item.id === x.id)?.gambar}
                  className="h-14 w-14 shrink-0 rounded-xl"
                />
                <div className="min-w-0 flex-1">
                  <Link to={`/produk/${x.id}`} className="line-clamp-1 text-sm font-semibold text-slate-800 hover:text-primary-600 dark:text-slate-100">
                    {x.nama}
                  </Link>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{formatRupiah(x.harga)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => ubahJumlah(x.id, x.jumlah - 1)}
                    className="h-8 w-8 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-semibold dark:text-slate-100">{x.jumlah}</span>
                  <button
                    onClick={() => ubahJumlah(x.id, x.jumlah + 1)}
                    className="h-8 w-8 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    +
                  </button>
                </div>
                <p className="w-28 text-right text-sm font-bold text-slate-800 dark:text-slate-100">
                  {formatRupiah(x.harga * x.jumlah)}
                </p>
                <button
                  onClick={() => hapusDariKeranjang(x.id)}
                  className="text-slate-400 transition hover:text-rose-500"
                  title="Hapus"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          {/* Ringkasan + checkout */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h2 className="mb-3 text-sm font-bold text-slate-800 dark:text-slate-100">Ringkasan</h2>
              <div className="mb-4 flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Total ({keranjang.reduce((s, x) => s + x.jumlah, 0)} item)</span>
                <span className="text-lg font-extrabold text-primary-600 dark:text-primary-400">{formatRupiah(total)}</span>
              </div>
              <form onSubmit={submit} className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400">Data Pengiriman (Simulasi)</h3>
                <input
                  className={inputCls}
                  placeholder="Nama lengkap"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  required
                />
                <input
                  className={inputCls}
                  placeholder="Nomor telepon (opsional)"
                  value={form.telepon}
                  onChange={(e) => setForm({ ...form, telepon: e.target.value })}
                />
                <textarea
                  className={inputCls}
                  rows={3}
                  placeholder="Alamat lengkap"
                  value={form.alamat}
                  onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                  required
                />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-primary-600 py-3 text-sm font-bold text-white shadow hover:bg-primary-700"
                >
                  Checkout (Simulasi)
                </button>
                <p className="text-center text-[11px] text-slate-400">
                  Tidak ada pembayaran sungguhan — data hanya tersimpan di browser kamu.
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
