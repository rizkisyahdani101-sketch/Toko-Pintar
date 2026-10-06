/**
 * Background dashboard — "kertas grafik observatorium".
 *
 * Layer tetap di belakang seluruh aplikasi:
 *   1. Base ink navy (#0B1020) dengan gradien halus.
 *   2. Aurora: dua blob radial besar violet/indigo, sangat rendah kontrasnya,
 *      satu di antaranya bergerak sangat lambat (float 7s). Tidak mencolok.
 *   3. Kertas grafik: garis 1px tipis + titik halus, opacity ~4-6%.
 *      Grid "graf" mencerminkan domain: himpunan, skor, dan barisan.
 *
 * Semua elemen purely dekoratif (aria-hidden) dan berada di belakang konten
 * (z-index terpisah) sehingga kontras teks tidak terpengaruh.
 */
export default function Latar() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Base navy dengan sedikit variasi arah cahaya */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_800px_at_85%_-10%,#1A1440_0%,#0B1020_55%,#070B18_100%)]" />

      {/* Aurora blob — kontras sangat rendah, gerak lambat */}
      <div className="absolute -top-40 right-[-10%] h-[560px] w-[560px] rounded-full bg-violet-600/[0.13] blur-[120px] animate-float" />
      <div className="absolute bottom-[-20%] left-[-8%] h-[480px] w-[480px] rounded-full bg-indigo-500/[0.10] blur-[120px]" />

      {/* Kertas grafik: garis + titik */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(148,163,184,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.5) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(rgba(196,181,253,0.55) 1px, transparent 1.5px)',
          backgroundSize: '22px 22px',
        }}
      />

      {/* Vignette lembut agar tepi senyap */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_40%,transparent_55%,rgba(7,11,24,0.55)_100%)]" />
    </div>
  )
}
