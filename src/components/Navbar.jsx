import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useApp } from '../store/AppContext'
import { KATEGORI, PRODUK } from '../lib/dataProduk'

export default function Navbar() {
  const { gelap, toggleGelap, keranjang, wishlist } = useApp()
  const [kueri, setKueri] = useState('')
  const navigate = useNavigate()

  const cari = (e) => {
    e.preventDefault()
    if (kueri.trim()) navigate(`/katalog?q=${encodeURIComponent(kueri.trim())}`)
  }

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-1.5 text-sm font-medium transition ${
      isActive
        ? 'bg-primary-600 text-white'
        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-extrabold text-primary-600 dark:text-primary-400">
          <span className="text-2xl">🛒</span> Toko<span className="-ml-2">Pintar</span>
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink to="/" end className={linkClass}>Beranda</NavLink>
          <NavLink to="/katalog" className={linkClass}>Katalog</NavLink>
          <NavLink to="/keranjang" className={linkClass}>Keranjang</NavLink>
          <NavLink to="/logika" className={linkClass}>🧮 Logika Matematika</NavLink>
        </nav>

        <form onSubmit={cari} className="ml-auto flex items-center">
          <input
            value={kueri}
            onChange={(e) => setKueri(e.target.value)}
            placeholder={`Cari di ${PRODUK.length} produk…`}
            className="w-40 rounded-l-lg border border-r-0 border-slate-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-primary-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 sm:w-56"
          />
          <button className="rounded-r-lg border border-primary-600 bg-primary-600 px-3 py-1.5 text-sm text-white hover:bg-primary-700">
            🔍
          </button>
        </form>

        <div className="flex items-center gap-1">
          <Link
            to="/keranjang"
            className="relative rounded-lg px-2 py-1.5 text-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            title="Keranjang"
          >
            🛍️
            {keranjang.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {keranjang.reduce((s, x) => s + x.jumlah, 0)}
              </span>
            )}
          </Link>
          <button
            onClick={toggleGelap}
            className="rounded-lg px-2 py-1.5 text-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            title="Mode gelap/terang"
          >
            {gelap ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  )
}
