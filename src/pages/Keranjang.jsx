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

  const inputCls = 'glass-input !py-2.5'

  if (selesai && pesanan) {
    return (
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-12 text-center">
        <div className="mb-4 text-6xl animate-float">🎉</div>
        <h1 className="mb-2 text-2xl font-extrabold text-white">Pesanan tercatat (simulasi)</h1>
        <p className="mb-6 text-sm leading-relaxed text-slate-400">
          Terima kasih, {pesanan.nama}. Total belanja{' '}
          <b className="text-violet-300">{formatRupiah(pesanan.total)}</b> untuk {pesanan.items.length} produk. Tidak ada
          pembayaran sungguhan.
        </p>
        <div className="panel mb-6 space-y-2 p-4 text-left text-sm">
          {pesanan.items.map((x) => {
            const produk = PRODUK.find((item) => item.id === x.id) ?? x
            return (
              <div key={x.id} className="flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-3 text-slate-300">
                  <FotoProduk item={produk} className="h-10 w-10 shrink-0 rounded-lg" />
                  <span className="truncate">{x.nama} × {x.jumlah}</span>
                </span>
                <span className="shrink-0 font-semibold text-white">{formatRupiah(x.harga * x.jumlah)}</span>
              </div>
            )
          })}
        </div>
        <Link to="/" className="btn-primary">Kembali ke beranda</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 md:px-6">
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-white">Keranjang</h1>

      {keranjang.length === 0 ? (
        <div className="panel border-dashed py-20 text-center">
          <p className="mb-4 text-sm text-slate-400">Keranjangmu masih kosong.</p>
          <Link to="/katalog" className="btn-primary !px-5 !py-2.5 text-sm">Lihat produk</Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Daftar item */}
          <div className="space-y-3">
            {keranjang.map((x) => (
              <div key={x.id} className="panel flex items-center gap-4 p-4">
                <FotoProduk
                  item={PRODUK.find((item) => item.id === x.id) ?? x}
                  gambar={x.gambar ?? PRODUK.find((item) => item.id === x.id)?.gambar}
                  className="h-14 w-14 shrink-0 rounded-xl"
                />
                <div className="min-w-0 flex-1">
                  <Link to={`/produk/${x.id}`} className="line-clamp-1 text-sm font-semibold text-slate-100 hover:text-violet-300">
                    {x.nama}
                  </Link>
                  <p className="text-xs text-slate-400">{formatRupiah(x.harga)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => ubahJumlah(x.id, x.jumlah - 1)}
                    className="h-8 w-8 rounded-lg border border-white/10 text-slate-300 transition hover:bg-white/[0.06]"
                    aria-label={`Kurangi jumlah ${x.nama}`}
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-white">{x.jumlah}</span>
                  <button
                    onClick={() => ubahJumlah(x.id, x.jumlah + 1)}
                    className="h-8 w-8 rounded-lg border border-white/10 text-slate-300 transition hover:bg-white/[0.06]"
                    aria-label={`Tambah jumlah ${x.nama}`}
                  >
                    +
                  </button>
                </div>
                <p className="w-28 text-right text-sm font-bold text-white">{formatRupiah(x.harga * x.jumlah)}</p>
                <button
                  onClick={() => hapusDariKeranjang(x.id)}
                  className="text-slate-500 transition hover:text-rose-400"
                  title={`Hapus ${x.nama}`}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          {/* Ringkasan + checkout */}
          <div className="panel h-fit space-y-4 p-5">
            <h2 className="text-sm font-bold text-white">Ringkasan</h2>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Total ({keranjang.reduce((s, x) => s + x.jumlah, 0)} item)</span>
              <span className="text-lg font-extrabold text-violet-300">{formatRupiah(total)}</span>
            </div>
            <form onSubmit={submit} className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">Data pengiriman (simulasi)</h3>
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
              <button type="submit" className="btn-primary w-full !py-3">Checkout</button>
              <p className="text-center text-[11px] text-slate-500">
                Tidak ada pembayaran sungguhan — data hanya tersimpan di browser kamu.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
