import { useState, useEffect, useRef } from "react"
import { useLanguage } from "@/context/LanguageContext"
import { ChevronLeft, ChevronRight } from "lucide-react"

type RestaurantKey = "san-marcos" | "la-ronda"

interface MenuItem {
  name: string
  desc: string
  price: string
  badge?: string
}

interface MenuCategory {
  title: string
  items: MenuItem[]
}

const RESTAURANTS: { key: RestaurantKey; label: string; subtitle: string }[] = [
  {
    key: "san-marcos",
    label: "San Marcos",
    subtitle: "Juan Pío Montúfar N4-14 · Barrio San Marcos",
  },
  {
    key: "la-ronda",
    label: "La Ronda",
    subtitle: "Calle Guayaquil S1-76 · La Ronda",
  },
]

const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") || "http://localhost:3001"

export default function Menu() {
  const { t } = useLanguage()
  const [activeRestaurant, setActiveRestaurant] = useState<RestaurantKey>("san-marcos")
  const [active, setActive]         = useState(0)
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const tabsContainerRef            = useRef<HTMLDivElement>(null)

  const currentRestaurant = RESTAURANTS.find((r) => r.key === activeRestaurant)!

  const scrollTabs = (direction: "left" | "right") => {
    if (!tabsContainerRef.current) return
    tabsContainerRef.current.scrollBy({
      left: direction === "left" ? -200 : 200,
      behavior: "smooth",
    })
  }

  const formatPrice = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return "$0"
    return trimmed.startsWith("$") ? trimmed : `$${trimmed}`
  }

  const loadMenu = async () => {
    try {
      const res  = await fetch(`${API_BASE_URL}/api/menu`)
      const data = await res.json()
      setCategories(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error al cargar el menu: ", error)
    }
  }

  useEffect(() => { loadMenu() }, [])

  useEffect(() => {
    const id = setInterval(loadMenu, 8000)
    return () => clearInterval(id)
  }, [])

  // Reset active tab when switching restaurant
  useEffect(() => { setActive(0) }, [activeRestaurant])

  if (categories.length === 0) {
    return (
      <section id="menu" className="menu-section">
        <p style={{ textAlign: "center", color: "rgba(245,237,216,0.4)" }}>{t("menu.loading")}</p>
      </section>
    )
  }

  const activeIndex = Math.min(active, categories.length - 1)
  const hasScrollableItems = categories[activeIndex].items.length > 3

  return (
    <section id="menu" className="menu-section">
      {/* Header */}
      <div className="section-header">
        <span className="section-label testimonios-label">{t("menu.section.label")}</span>
        <h2 className="section-title testimonios-title">
          {t("menu.section.title")}
        </h2>
        <div className="ornament-line">
          <div className="ornament-dot ornament-dot--naranja" />
        </div>
      </div>

      {/* Selector de restaurante */}
      <div className="menu-restaurant-selector">
        {RESTAURANTS.map((restaurant) => (
          <button
            key={restaurant.key}
            type="button"
            className={`menu-restaurant-btn${activeRestaurant === restaurant.key ? " menu-restaurant-btn--active" : ""}`}
            onClick={() => setActiveRestaurant(restaurant.key)}
          >
            <span className="menu-restaurant-dot" aria-hidden="true" />
            <span className="menu-restaurant-label">{restaurant.label}</span>
          </button>
        ))}
      </div>

      {/* Subtítulo del local activo */}
      <p className="menu-restaurant-subtitle">{currentRestaurant.subtitle}</p>

      {/* Card-style menu */}
      <div className="menu-card">
        <h3 className="menu-card-title">{t("menu.card.title")} · {currentRestaurant.label}</h3>

        {/* Category tabs */}
        <div className="menu-tabs-wrapper">
          <button
            onClick={() => scrollTabs("left")}
            className="tab-nav-btn"
            aria-label="Desplazar pestañas a la izquierda"
            type="button"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="menu-tabs" ref={tabsContainerRef}>
            {categories.map((cat, i) => (
              <button
                key={cat.title}
                className={`menu-tab${i === activeIndex ? " menu-tab--active" : ""}`}
                onClick={() => setActive(i)}
              >
                {cat.title}
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollTabs("right")}
            className="tab-nav-btn"
            aria-label="Desplazar pestañas a la derecha"
            type="button"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Divider */}
        <div className="menu-card-divider" />

        {/* Items list */}
        <div className={`menu-items${hasScrollableItems ? " menu-items--scroll" : ""}`}>
          {categories[activeIndex].items.map((item) => (
            <div key={item.name} className="menu-item">
              <div className="menu-item-left">
                <div className="menu-item-header">
                  <span className="menu-item-name">{item.name}</span>
                  {item.badge && <span className="menu-item-badge">{item.badge}</span>}
                </div>
                <span className="menu-item-desc">{item.desc}</span>
              </div>
              <div className="menu-item-dots" />
              <span className="menu-item-price">{formatPrice(item.price)}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="menu-note">{t("menu.note")}</p>
    </section>
  )
}
