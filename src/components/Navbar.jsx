import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useApp } from '../store/AppContext'
import { PRODUK } from '../lib/dataProduk'

export default function Navbar() {
  const { keranjang, wishlist } = useApp()
  const [kueri, setKueri] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const cari = (e) => {
    e.preventDefault()
    if (kueri.trim()) navigate(`/katalog?q=${encodeURIComponent(kueri.trim())}`)
    setMenuOpen(false)
  }

  const linkClass = ({ isActive }) =>
    `rounded-full px-3 py-2 text-sm font-semibold transition ${
      isActive ? 'grad-aksi text-white' : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-ink-900/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-500 to-primary-500 text-xl shadow-lg shadow-accent-500/30">
            🛒
          </span>
          <span>
            Toko<span className="text-violet-300">Pintar</span>
          </span>
        </Link>

        {/* Hamburger mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] text-lg transition hover:bg-white/[0.12] md:hidden"
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <nav className={`${menuOpen ? 'flex' : 'hidden'} w-full flex-col gap-1 md:flex md:w-auto md:flex-row md:items-center md:gap-1`}>
          <NavLink to="/" end className={linkClass} onClick={() => setMenuOpen(false)}>Beranda</NavLink>
          <NavLink to="/katalog" className={linkClass} onClick={() => setMenuOpen(false)}>Katalog</NavLink>
          <NavLink to="/keranjang" className={linkClass} onClick={() => setMenuOpen(false)}>Keranjang</NavLink>
          <NavLink to="/logika" className={linkClass} onClick={() => setMenuOpen(false)}>📚 Himpunan</NavLink>
        </nav>

        <form onSubmit={cari} className="ml-auto hidden items-center overflow-hidden rounded-full border border-white/10 bg-white/[0.04] sm:flex">
          <input
            value={kueri}
            onChange={(e) => setKueri(e.target.value)}
            placeholder={`Cari ${PRODUK.length} produk…`}
            className="w-40 bg-transparent px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 sm:w-56"
          />
          <button className="grad-aksi flex h-11 w-12 items-center justify-center border-l border-white/10 text-lg text-white">
            🔍
          </button>
        </form>

        <div className="flex items-center gap-2">
          <Link
            to="/keranjang"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] text-lg transition hover:bg-white/[0.12]"
            title="Keranjang"
          >
            🛍️
            {keranjang.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white">
                {keranjang.reduce((s, x) => s + x.jumlah, 0)}
              </span>
            )}
          </Link>
          {wishlist.length > 0 && (
            <span className="hidden rounded-full bg-violet-500/15 px-2.5 py-1 text-[10px] font-bold text-violet-300 sm:inline-flex">
              {wishlist.length} favorit
            </span>
          )}
        </div>
      </div>
    </header>
  )
}
