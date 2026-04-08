import { useState, useEffect, useRef } from "react"
import type { CSSProperties } from "react"

type RestaurantKey = "san-marcos" | "la-ronda"

interface GalleryItem {
  image: string
  label: string
  caption?: string
}

interface GallerySection {
  restaurant: RestaurantKey
  title: string
  subtitle: string
  badge: string
  items: GalleryItem[]
}

const GALLERY_SECTIONS: GallerySection[] = [
  {
    restaurant: "san-marcos",
    title: "San Marcos",
    subtitle: "Barrio San Marcos · Centro Histórico",
    badge: "Barrio más antiguo de Quito",
    items: [
      { image: "/images/lena-quitena-sanmarcos.jpg", label: "El local histórico", caption: "Desde 2019" },
      { image: "/images/image1.png",                 label: "Platos tradicionales"                       },
      { image: "/images/image2.png",                 label: "El sabor de la leña", caption: "Favorito"  },
    ],
  },
  {
    restaurant: "la-ronda",
    title: "La Ronda",
    subtitle: "La Ronda · Centro Histórico",
    badge: "La calle más emblemática",
    items: [
      { image: "/images/leña-quitena-laronda.webp", label: "La Ronda",         caption: "Patrimonio"    },
      { image: "/images/image3.png",                label: "Ambiente único"                              },
      { image: "/images/image4.png",                label: "Momentos únicos",  caption: "Buenas noches" },
    ],
  },
]

const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" width="16" height="16">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)
const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" width="16" height="16">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

export default function Galeria() {
  const [current, setCurrent] = useState(0)
  const [inView,  setInView]  = useState(false)
  const sectionRef            = useRef<HTMLElement | null>(null)
  const total = GALLERY_SECTIONS.length

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const prev = () => setCurrent((c) => (c - 1 + total) % total)
  const next = () => setCurrent((c) => (c + 1) % total)

  return (
    <section
      ref={sectionRef}
      id="galeria"
      className={`galeria-section${inView ? " galeria-section--visible" : ""}`}
    >
      {/* Header */}
      <div className="section-header">
        <span className="section-label">Galería</span>
        <h2 className="section-title">
          Momentos que <em>Saben</em>
        </h2>
        <div className="ornament-line">
          <div className="ornament-dot" />
        </div>
      </div>

      {/* Carousel */}
      <div className="galeria-carousel-outer">
        <div className="galeria-track-viewport">
          <div
            className="galeria-track"
            style={{ "--slide-offset": `${current * -100}%` } as CSSProperties}
          >
            {GALLERY_SECTIONS.map((sec, idx) => (
              <div
                key={sec.restaurant}
                className={`galeria-slide${idx === current ? " galeria-slide--active" : ""}`}
                aria-hidden={idx !== current}
              >
                {/* Cabecera */}
                <div className="galeria-slide-info">
                  <span className="galeria-slide-badge">{sec.badge}</span>
                  <h3 className="galeria-slide-title">
                    Leña Quiteña <em>{sec.title}</em>
                  </h3>
                  <p className="galeria-slide-subtitle">{sec.subtitle}</p>
                </div>

                {/* Fotos */}
                <div className="galeria-photo-grid">
                  {sec.items.map((item, i) => (
                    <figure
                      key={i}
                      className="galeria-photo-card"
                      style={{ "--card-delay": `${i * 0.1}s` } as CSSProperties}
                    >
                      <div className="galeria-photo-frame">
                        <img src={item.image} alt={item.label} loading="lazy" />
                        <div className="galeria-photo-overlay">
                          <span>{item.label}</span>
                          {item.caption && <em>{item.caption}</em>}
                        </div>
                      </div>
                    </figure>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navegación compacta: ← dots → */}
      <div className="galeria-indicators">
        <button
          type="button"
          className="galeria-nav-arrow"
          onClick={prev}
          aria-label="Restaurante anterior"
        >
          <ChevronLeft />
        </button>

        {GALLERY_SECTIONS.map((sec, i) => (
          <button
            key={sec.restaurant}
            type="button"
            className={`galeria-indicator${i === current ? " galeria-indicator--active" : ""}`}
            onClick={() => setCurrent(i)}
            aria-label={`Ver galería de ${sec.title}`}
          >
            <span className="galeria-indicator-dot" aria-hidden="true" />
            <span className="galeria-indicator-label">{sec.title}</span>
          </button>
        ))}

        <button
          type="button"
          className="galeria-nav-arrow"
          onClick={next}
          aria-label="Siguiente restaurante"
        >
          <ChevronRight />
        </button>
      </div>
    </section>
  )
}
