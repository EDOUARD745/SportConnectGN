import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToHash() {
  const location = useLocation()

  useEffect(() => {
    const hash = location.hash

    // Laisse le temps au DOM de se rendre (SPA)
    window.requestAnimationFrame(() => {
      if (hash) {
        const el = document.querySelector(hash)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          return
        }
      }

      // Pas de hash: remonte en haut sur navigation de page
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }, [location.pathname, location.hash])

  return null
}

