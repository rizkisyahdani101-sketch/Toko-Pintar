import { useState } from 'react'

// Syntax highlighting sederhana yang aman: proses per baris, string dimask
// dengan placeholder agar regex berikutnya tidak mengubah HTML yang sudah dibuat.
const KEYWORDS =
  'export|const|let|return|if|for|of|in|new|function|else|delete|import|from'

const highlightLine = (baris) => {
  const esc = baris
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Pisahkan kode dan komentar (asumsi: '//' tidak di dalam string pada kode ini)
  let kode = esc
  let komentar = ''
  const idxKomen = esc.indexOf('//')
  if (idxKomen !== -1) {
    kode = esc.slice(0, idxKomen)
    komentar = esc.slice(idxKomen)
  }

  // Mask string dengan placeholder
  const strings = []
  kode = kode.replace(/(&#39;|')([^'\n]*)(')/g, (m) => {
    strings.push(m)
    return `\u0000${strings.length - 1}\u0000`
  })

  // Angka DULU, baru keyword — agar regex angka tidak mencocokkan angka
  // di dalam nama class hasil replacement keyword (mis. text-fuchsia-400)
  kode = kode.replace(/\b(\d+\.?\d*)\b/g, '<span class="text-amber-300">$1</span>')
  kode = kode.replace(
    new RegExp(`\\b(${KEYWORDS})\\b`, 'g'),
    '<span class="text-fuchsia-400">$1</span>'
  )

  // Pulihkan string sebagai span hijau
  kode = kode.replace(/\u0000(\d+)\u0000/g, (_, i) => {
    return `<span class="text-emerald-400">${strings[Number(i)]}</span>`
  })

  const komentarHtml = komentar
    ? `<span class="text-slate-500 italic">${komentar}</span>`
    : ''

  return kode + komentarHtml
}

export default function CodeBlock({ kode, judul }) {
  const [tersalin, setTersalin] = useState(false)

  const salin = async () => {
    try {
      await navigator.clipboard.writeText(kode)
      setTersalin(true)
      setTimeout(() => setTersalin(false), 1500)
    } catch {
      /* clipboard tidak tersedia */
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-400"></span>
          <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
          <span className="h-3 w-3 rounded-full bg-green-400"></span>
          {judul && <span className="ml-2 text-xs font-medium text-slate-400">{judul}</span>}
        </div>
        <button
          onClick={salin}
          className="rounded-md bg-slate-700 px-3 py-1 text-xs font-medium text-slate-200 transition hover:bg-slate-600"
        >
          {tersalin ? '✓ Tersalin!' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
        <code className="font-mono text-slate-200">
          {kode.split('\n').map((baris, i) => (
            <div key={i} dangerouslySetInnerHTML={{ __html: highlightLine(baris) || '&nbsp;' }} />
          ))}
        </code>
      </pre>
    </div>
  )
}
