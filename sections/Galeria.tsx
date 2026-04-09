import { useState, useEffect, useRef } from "react"
import { useRestaurant } from "@/context/RestaurantContext"

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
      { image: "/images/image1.png",                 label: "Platos tradicionales"                      },
      { image: "/images/image2.png",                 label: "El sabor de la leña", caption: "Favorito"  },
    ],
  },
  {
    restaurant: "la-ronda",
    title: "La Ronda",
    subtitle: "La Ronda · Centro Histórico",
    badge: "La calle más emblemática",
    items: [
      { image: "/images/leña-quitena-laronda.webp", label: "La Ronda",          caption: "Patrimonio"    },
      { image: "/images/image3.png",                label: "Ambiente único"                              },
      { image: "/images/image4.png",                label: "Momentos únicos",  caption: "Buenas noches" },
    ],
  },
]

const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="20" height="20">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)
const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="20" height="20">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

// index en GALLERY_SECTIONS por clave de restaurante
const GALLERY_INDEX: Record<string, number> = {
  "san-marcos": 0,
  "la-ronda":   1,
}

export default function Galeria() {
  const { selectedRestaurant } = useRestaurant()
  const [current, setCurrent] = useState(0)
  const [inView,  setInView]  = useState(false)
  const sectionRef            = useRef<HTMLElement | null>(null)
  const total = GALLERY_SECTIONS.length

  // Sincronizar con restaurante seleccionado desde el Hero
  useEffect(() => {
    if (selectedRestaurant !== null) {
      const idx = GALLERY_INDEX[selectedRestaurant]
      if (idx !== undefined) setCurrent(idx)
    }
  }, [selectedRestaurant])

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const prev = () => setCurrent((c) => (c - 1 + total) % total)
  const next = () => setCurrent((c) => (c + 1) % total)

  // Obtenemos la sección actual para el título dinámico
  const currentSection = GALLERY_SECTIONS[current]

  return (
    <section
      ref={sectionRef}
      id="galeria"
      className={`relative w-full overflow-hidden py-24 md:py-32 transition-opacity duration-1000 ${
        inView ? "opacity-100" : "opacity-0 translate-y-8"
      }`}
      style={{ backgroundColor: "#FDFBF7", color: "#1A0B08" }}
    >
      {/* ── Header Editorial Dinámico ── */}
      <div className="mx-auto mb-20 max-w-4xl px-6 text-center">
        <span className="mb-4 inline-block text-[10px] uppercase tracking-[0.3em] text-gray-400">
          Galería
        </span>
        
        {/* El título principal se actualiza con el nombre del restaurante */}
        <h2 
          className="text-4xl leading-tight md:text-5xl lg:text-7xl font-light"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          LEÑA QUITEÑA <br className="hidden md:block" />
          <em 
            className="font-normal transition-colors duration-700" 
            style={{ 
              fontFamily: "'Cormorant Garamond', Georgia, serif", 
              color: "#8B2323", // Color rojo/vino
              fontStyle: "italic" 
            }}
          >
            {currentSection.title}
          </em>
        </h2>
        
        {/* Línea divisoria */}
        <div className="mx-auto mt-8 flex max-w-xs items-center justify-center gap-4 opacity-70">
          <div className="h-[1px] flex-1 bg-gray-300"></div>
          <span className="text-[9px] uppercase tracking-widest text-gray-500" style={{ fontFamily: "'Inter', sans-serif" }}>
            {currentSection.badge}
          </span>
          <div className="h-[1px] flex-1 bg-gray-300"></div>
        </div>
      </div>

      {/* ── Carousel Wrapper (Desplaza bloques enteros) ── */}
      <div className="relative mx-auto w-full max-w-[1400px]">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {GALLERY_SECTIONS.map((sec, idx) => (
              <div
                key={sec.restaurant}
                className="w-full shrink-0 px-6 md:px-12"
                aria-hidden={idx !== current}
              >
                
                {/* ── Grid Asimétrico Editorial (Se mantiene el estilo de revista) ── */}
                <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-8 lg:gap-12">
                  {sec.items.map((item, i) => {
                    let gridClasses = "";
                    let aspectClasses = "";
                    
                    if (i === 0) {
                      gridClasses = "md:col-span-7";
                      aspectClasses = "aspect-[4/3]";
                    } else if (i === 1) {
                      gridClasses = "md:col-span-5 md:mt-24";
                      aspectClasses = "aspect-[3/4]";
                    } else if (i === 2) {
                      gridClasses = "md:col-span-10 md:col-start-2 mt-4 md:mt-12";
                      aspectClasses = "aspect-[21/9]";
                    }

                    return (
                      <figure key={i} className={`group ${gridClasses}`}>
                        <div className={`relative w-full overflow-hidden bg-gray-200 ${aspectClasses}`}>
                          <img 
                            src={item.image} 
                            alt={item.label} 
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                          />
                        </div>
                        <figcaption className="mt-4 flex items-baseline justify-between border-b border-gray-200 pb-3">
                          <span 
                            className="text-xl md:text-2xl text-[#1A0B08]"
                            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}
                          >
                            {item.label}
                          </span>
                          {item.caption && (
                            <span 
                              className="text-[9px] uppercase tracking-[0.25em] text-gray-400"
                              style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                              {item.caption}
                            </span>
                          )}
                        </figcaption>
                      </figure>
                    );
                  })}
                </div>
                
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Navegación Compacta Inferior ── */}
      <div className="mx-auto mt-24 flex max-w-sm items-center justify-between px-6">
        <button
          type="button"
          onClick={prev}
          aria-label="Anterior"
          className="p-2 text-gray-400 transition-colors hover:text-[#1A0B08]"
        >
          <ChevronLeft />
        </button>

        <div className="flex items-center gap-8">
          {GALLERY_SECTIONS.map((sec, i) => (
            <button
              key={sec.restaurant}
              type="button"
              onClick={() => setCurrent(i)}
              className={`group flex flex-col items-center gap-2 transition-all duration-300 ${
                i === current ? "opacity-100" : "opacity-40 hover:opacity-70"
              }`}
            >
              <span 
                className="text-xs uppercase tracking-widest transition-colors"
                style={{ 
                  color: i === current ? "#8B2323" : "#1A0B08",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: i === current ? "600" : "400"
                }}
              >
                {sec.title}
              </span>
              <span 
                className={`h-[2px] transition-all duration-300 ${
                  i === current ? "w-full bg-[#8B2323]" : "w-0 bg-gray-400 group-hover:w-1/2"
                }`}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          aria-label="Siguiente"
          className="p-2 text-gray-400 transition-colors hover:text-[#1A0B08]"
        >
          <ChevronRight />
        </button>
      </div>
    </section>
  )
}