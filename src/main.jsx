import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// Trigger orkestrasi animasi page-load: .anim-naik hanya berjalan saat
// .is-mounted dipasang (fallback: tanpa JS, semua elemen tetap terlihat).
document.getElementById('root').classList.add('is-mounted')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
