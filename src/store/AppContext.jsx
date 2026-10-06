import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { PRODUK, USER_DEFAULT, hitungKategoriTren } from '../lib/dataProduk'
import { keHimpunan } from '../lib/rekomendasi'
import { ambilIdPerangkat, muatServer, simpanServer } from '../lib/penyimpanan'

const AppContext = createContext(null)

// State disimpan per perangkat di MySQL (via API Laragon) dan di-cache ke
// localStorage agar tampilan instan saat reload & tetap jalan saat offline.
// Kunci lama tp_minat/tp_keranjang/... dipensiunkan: satu JSON `tp_state`.
const KUNCI_CACHE = 'tp_state'

const muatCache = () => {
  try {
    const v = localStorage.getItem(KUNCI_CACHE)
    return v ? JSON.parse(v) : null
  } catch {
    return null
  }
}

const simpanCache = (state) => {
  try {
    localStorage.setItem(KUNCI_CACHE, JSON.stringify(state))
  } catch {
    /* abaikan */
  }
}

// Migrasi satu kali: angkat data dari kunci-kunci lama ke cache baru
const migrasiLama = () => {
  try {
    const lama = {}
    for (const k of ['tp_minat', 'tp_rating', 'tp_keranjang', 'tp_wishlist', 'tp_riwayat', 'tp_pesanan']) {
      const v = localStorage.getItem(k)
      if (v) {
        lama[k.slice(3)] = JSON.parse(v)
        localStorage.removeItem(k)
      }
    }
    return Object.keys(lama).length ? lama : null
  } catch {
    return null
  }
}

export function AppProvider({ children }) {
  const idRef = useRef(ambilIdPerangkat())

  const [gelap, setGelap] = useState(() => {
    try {
      const v = localStorage.getItem('tp_gelap')
      return v ? JSON.parse(v) : false
    } catch {
      return false
    }
  })

  // State awal dibaca SEKALI: cache `tp_state` → migrasi kunci lama →
  // default "mulai kosong" (kunjungan pertama tanpa pilihan awal apa pun).
  const [awal] = useState(() => {
    const cache = muatCache() ?? migrasiLama()
    return {
      minat: cache?.minat ?? USER_DEFAULT.minat,
      ratingSuka: cache?.ratingSuka ?? USER_DEFAULT.ratingSuka,
      keranjang: cache?.keranjang ?? [],
      wishlist: cache?.wishlist ?? [],
      riwayat: cache?.riwayat ?? USER_DEFAULT.riwayat,
      pesanan: cache?.pesanan ?? null,
    }
  })

  const [minat, setMinat] = useState(awal.minat)
  const [ratingSuka, setRatingSuka] = useState(awal.ratingSuka)
  const [keranjang, setKeranjang] = useState(awal.keranjang)
  const [wishlist, setWishlist] = useState(awal.wishlist)
  // Barisan R: riwayat minat per sesi interaksi
  const [riwayat, setRiwayat] = useState(awal.riwayat)
  const [pesanan, setPesanan] = useState(awal.pesanan)

  const kategoriTren = useMemo(() => hitungKategoriTren(PRODUK), [])

  // Simpan cache + kirim ke MySQL setiap ada perubahan (debounce ringan)
  useEffect(() => {
    const state = { minat, ratingSuka, keranjang, wishlist, riwayat, pesanan }
    simpanCache(state)
    const t = setTimeout(() => simpanServer(idRef.current, state), 400)
    return () => clearTimeout(t)
  }, [minat, ratingSuka, keranjang, wishlist, riwayat, pesanan])
    // Muat state dari server saat mount — menimpa cache bila ada data tersimpan
  useEffect(() => {
    let batal = false
    muatServer(idRef.current).then((data) => {
      if (batal || !data) return
      if (Array.isArray(data.minat)) setMinat(data.minat)
      if (Array.isArray(data.ratingSuka)) setRatingSuka(data.ratingSuka)
      if (Array.isArray(data.keranjang)) setKeranjang(data.keranjang)
      if (Array.isArray(data.wishlist)) setWishlist(data.wishlist)
      if (Array.isArray(data.riwayat)) setRiwayat(data.riwayat)
      if (data.pesanan !== undefined) setPesanan(data.pesanan)
    })
    return () => {
      batal = true
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', gelap)
    localStorage.setItem('tp_gelap', JSON.stringify(gelap))
  }, [gelap])

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

  const hapusRiwayat = (index) => {
    setRiwayat((lama) => lama.filter((_, i) => i !== index))
  }

  const hapusSemuaRiwayat = () => {
    setRiwayat([])
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
    hapusRiwayat,
    hapusSemuaRiwayat,
    checkout,
  }

  return <AppContext.Provider value={nilai}>{children}</AppContext.Provider>
}

export const useApp = () => useContext(AppContext)

export const formatRupiah = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
