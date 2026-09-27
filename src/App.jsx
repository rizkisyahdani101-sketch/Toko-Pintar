import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './store/AppContext'
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
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
          <Navbar />
          <Routes>
            <Route path="/" element={<Beranda />} />
            <Route path="/katalog" element={<Katalog />} />
            <Route path="/produk/:id" element={<DetailProduk />} />
            <Route path="/keranjang" element={<Keranjang />} />
            <Route path="/logika" element={<LogikaMatematika />} />
          </Routes>
          <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400 dark:border-slate-700">
            TokoPintar — Prototipe e-commerce dengan sistem rekomendasi berbasis irisan minat · Matematika Diskrit ·
            Kelompok 4 · Universitas Negeri Medan 2026
          </footer>
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}
