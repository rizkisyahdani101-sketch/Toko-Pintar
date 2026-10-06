import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './store/AppContext'
import Latar from './components/Latar'
import Navbar from './components/Navbar'
import Beranda from './pages/Beranda'
import Katalog from './pages/Katalog'
import DetailProduk from './pages/DetailProduk'
import Keranjang from './pages/Keranjang'
import LogikaMatematika from './pages/LogikaMatematika'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="relative min-h-screen text-slate-100">
          <Latar />
          <div className="relative z-10">
            <Navbar />
            <Routes>
              <Route path="/" element={<Beranda />} />
              <Route path="/katalog" element={<Katalog />} />
              <Route path="/produk/:id" element={<DetailProduk />} />
              <Route path="/keranjang" element={<Keranjang />} />
              <Route path="/logika" element={<LogikaMatematika />} />
            </Routes>
            <footer className="border-t border-white/[0.06] py-6 text-center text-xs text-slate-500">
              TokoPintar — prototipe rekomendasi berbasis himpunan &amp; barisan · Matematika Diskrit · Kelompok 4 ·
              Universitas Negeri Medan 2026
            </footer>
          </div>
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}
