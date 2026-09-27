export default function FotoProduk({ item, gambar = item.gambar, className = '' }) {
  return (
    <img
      src={gambar}
      alt={`Foto ${item.nama}`}
      className={`bg-slate-100 object-cover dark:bg-slate-700 ${className}`}
      loading="lazy"
    />
  )
}
