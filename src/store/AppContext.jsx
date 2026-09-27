import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { PRODUK, USER_DEFAULT, hitungKategoriTren } from '../lib/dataProduk'
import { keHimpunan } from '../lib/rekomendasi'

const AppContext = createContext(null)

const muat = (kunci, bawaan) => {
  try {
    const v = localStorage.getItem(kunci)
    return v ? JSON.parse(v) : bawaan
  } catch {
    return bawaan
  }
}

const simpan = (kunci, nilai) => {
  try {
    localStorage.setItem(kunci, JSON.stringify(nilai))
  } catch {
    /* abaikan */
  }
}

export function AppProvider({ children }) {
  const [gelap, setGelap] = useState(() => muat('tp_gelap', false))
  const [minat, setMinat] = useState(() => muat('tp_minat', USER_DEFAULT.minat))
  const [ratingSuka, setRatingSuka] = useState(() => muat('tp_rating', USER_DEFAULT.ratingSuka))
  const [keranjang, setKeranjang] = useState(() => muat('tp_keranjang', []))
  const [wishlist, setWishlist] = useState(() => muat('tp_wishlist', []))
  // Barisan R: riwayat minat per sesi interaksi
  const [riwayat, setRiwayat] = useState(() => muat('tp_riwayat', USER_DEFAULT.riwayat))
  const [pesanan, setPesanan] = useState(() => muat('tp_pesanan', null))

  const kategoriTren = useMemo(() => hitungKategoriTren(PRODUK), [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', gelap)
    simpan('tp_gelap', gelap)
  }, [gelap])
  useEffect(() => simpan('tp_minat', minat), [minat])
  useEffect(() => simpan('tp_rating', ratingSuka), [ratingSuka])
  useEffect(() => simpan('tp_keranjang', keranjang), [keranjang])
  useEffect(() => simpan('tp_wishlist', wishlist), [wishlist])
  useEffect(() => simpan('tp_riwayat', riwayat), [riwayat])
  useEffect(() => simpan('tp_pesanan', pesanan), [pesanan])

  // Perbarui himpunan minat A (dari checkbox kategori / interaksi)
  const ubahMinat = (kategori, aktif) => {
    setMinat((lama) => {
      const set = new Set(lama)
      aktif ? set.add(kategori) : set.delete(kategori)
      return [...set]
    })
  }

  const ubahRatingSuka = (rating, aktif) => {
    setRatingSuka((lama) => {
      const set = new Set(lama)
      aktif ? set.add(rating) : set.delete(rating)
      return [...set]
    })
  }

  const tambahKeKeranjang = (produk, jumlah = 1) => {
    setKeranjang((lama) => {
      const ada = lama.find((x) => x.id === produk.id)
      if (ada) return lama.map((x) => (x.id === produk.id ? { ...x, jumlah: x.jumlah + jumlah } : x))
      return [...lama, { ...produk, jumlah }]
    })
    catatInteraksi(produk)
  }

  const ubahJumlah = (id, jumlah) => {
    if (jumlah <= 0) setKeranjang((lama) => lama.filter((x) => x.id !== id))
    else setKeranjang((lama) => lama.map((x) => (x.id === id ? { ...x, jumlah } : x)))
  }

  const hapusDariKeranjang = (id) => setKeranjang((lama) => lama.filter((x) => x.id !== id))

  const toggleWishlist = (produk) => {
    setWishlist((lama) => {
      const ada = lama.some((x) => x.id === produk.id)
      if (ada) return lama.filter((x) => x.id !== produk.id)
      return [...lama, produk]
    })
    catatInteraksi(produk)
  }

  // Setiap interaksi (klik produk, add-to-cart, wishlist) memperbarui
  // barisan R: minat pengguna periode sekarang.
  const catatInteraksi = (produk) => {
    setRiwayat((lama) => {
      if (!lama.length) return [[produk.kategori]]
      const salin = [...lama]
      const terakhir = new Set(salin[salin.length - 1])
      terakhir.add(produk.kategori)
      salin[salin.length - 1] = [...terakhir]
      return salin
    })
  }

  const mulaiPeriodeBaru = () => {
    setRiwayat((lama) => [...lama, [...minat]])
  }

  const checkout = (data) => {
    const total = keranjang.reduce((s, x) => s + x.harga * x.jumlah, 0)
    setPesanan({ ...data, items: keranjang, total, waktu: new Date().toISOString() })
    setKeranjang([])
    return total
  }

  const nilai = {
    gelap,
    toggleGelap: () => setGelap((g) => !g),
    minat: keHimpunan(minat),
    minatArr: minat,
    ratingSuka: keHimpunan(ratingSuka),
    ratingSukaArr: ratingSuka,
    riwayat,
    kategoriTren,
    keranjang,
    wishlist,
    pesanan,
    ubahMinat,
    ubahRatingSuka,
    tambahKeKeranjang,
    ubahJumlah,
    hapusDariKeranjang,
    toggleWishlist,
    catatInteraksi,
    mulaiPeriodeBaru,
    checkout,
  }

  return <AppContext.Provider value={nilai}>{children}</AppContext.Provider>
}

export const useApp = () => useContext(AppContext)

export const formatRupiah = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
