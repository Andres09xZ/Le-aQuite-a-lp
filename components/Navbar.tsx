import { useState, useEffect } from "react"
import { logoRestaurante, hamburguer } from "../assets/logo"
import NAV_LINKS from "../assets/constants/Navlinks"
import { LanguageDropdown } from "./LanguageDropdown"
import { useLanguage } from "@/context/LanguageContext"

const navKeys: Record<string, string> = {
  "#historia": "nav.historia",
  "#menu":     "nav.menu",
  "#galeria":  "nav.galeria",
  "#resenas":  "nav.resenas",
  "#locales":  "nav.locales",
}

const Navbar = () => {
  const [scrolled,   setScrolled]   = useState(false)
  const [hidden,     setHidden]     = useState(false)
  const [menuOpen,   setMenuOpen]   = useState(false)
  const [activeHref, setActiveHref] = useState("")
  const { t } = useLanguage()

  /* ── Detectar scroll: shrink + hide/show ── */
  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 60)
      setHidden(y > 300 && y > lastY)
      lastY = y
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  /* ── Detectar sección activa ── */
  useEffect(() => {
    const onScroll = () => {
      for (const link of [...NAV_LINKS].reverse()) {
        const el = document.querySelector(link.href)
        if (!el) continue
        if (el.getBoundingClientRect().top <= 100) {
          setActiveHref(link.href)
          return
        }
      }
      setActiveHref("")
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  /* ── Bloquear scroll del body cuando el menú está abierto ── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  const openReservationChat = () => {
    window.dispatchEvent(new CustomEvent("chatbot:open-reservation"))
  }

  const openOrderChat = () => {
    window.dispatchEvent(new CustomEvent("chatbot:open-order"))
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      {/* ── Header ── */}
      <header className={`navbar-header${scrolled ? " navbar-header--scrolled" : ""}${hidden ? " navbar-header--hidden" : ""}`}>
        
        {/* Agregamos flex y justify-between para separar los extremos */}
        <div className="navbar-inner flex w-full items-center justify-between">

          {/* ── GRUPO IZQUIERDA: Logo + Navlinks ── */}
          <div className="flex items-center gap-8 lg:gap-12">
            {/* Logo */}
            <a href="#hero" className="navbar-logo flex items-center gap-4" onClick={closeMenu}>
              <img src={logoRestaurante} alt="Leña Quiteña" width={100} height={100} className="rounded-full" />
              <span className="navbar-logo-text hidden sm:block">{t("brand.name")}</span>
            </a>

            {/* Links desktop */}
            <ul className="navbar-links flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`navbar-link${activeHref === link.href ? " navbar-link--active" : ""}`}
                  >
                    {t(navKeys[link.href])}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── GRUPO DERECHA: Controles + Botón Hamburguesa ── */}
          <div className="flex items-center gap-4">
            
            <div className="navbar-controls flex items-center gap-4">
              <LanguageDropdown />
              
              

              {/* Icono del Carrito (Color blanco, alineado junto a reservas) */}
              <button 
                type="button" 
                onClick={openOrderChat} 
                className="text-white hover:text-[#D1B894] transition-colors flex items-center justify-center p-2"
                aria-label="Ver carrito"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="21" r="1"/>
                  <circle cx="19" cy="21" r="1"/>
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                </svg>
              </button>

              <button
                type="button"
                className="navbar-cta navbar-cta--reservas"
                onClick={openReservationChat}
              >
                {t("nav.cta.reservas")}
              </button>
            </div>

            {/* Botón hamburguesa */}
            <button
              className="navbar-hamburger"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? t("nav.mobile.close") : t("nav.mobile.open")}
              aria-expanded={menuOpen}
              aria-controls="mobile-drawer"
            >
              <img
                src={hamburguer}
                alt=""
                aria-hidden="true"
                width={25}
                height={25}
                style={{
                  transition: "opacity 0.25s, transform 0.25s",
                  opacity:    menuOpen ? 0 : 1,
                  transform:  menuOpen ? "rotate(90deg) scale(0.7)" : "rotate(0deg) scale(1)",
                  position:   "absolute",
                }}
              />
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                width={25}
                height={25}
                aria-hidden="true"
                style={{
                  color:      "#F5EDD8",
                  transition: "opacity 0.25s, transform 0.25s",
                  opacity:    menuOpen ? 1 : 0,
                  transform:  menuOpen ? "rotate(0deg) scale(1)" : "rotate(-90deg) scale(0.7)",
                  position:   "absolute",
                }}
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

        </div>
      </header>

      {/* ── Backdrop ── */}
      <div
        className={`mobile-backdrop${menuOpen ? " mobile-backdrop--open" : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* ── Drawer móvil ── */}
      <nav
        id="mobile-drawer"
        className={`mobile-drawer${menuOpen ? " mobile-drawer--open" : ""}`}
        aria-label="Menú móvil"
      >
        <ul className="mobile-links">
          {NAV_LINKS.map((link) => (
            <li key={link.href} className="mobile-link-item">
              <a
                href={link.href}
                onClick={closeMenu}
                className={`mobile-link${activeHref === link.href ? " mobile-link--active" : ""}`}
              >
                <span className="mobile-link-bullet" aria-hidden="true" />
                {t(navKeys[link.href])}
              </a>
            </li>
          ))}
        </ul>

        <div className="mobile-cta-group">
          <button
            type="button"
            onClick={() => { closeMenu(); openOrderChat() }}
            className="mobile-cta mobile-cta--pedidos"
          >
            {t("nav.cta.pedidos")}
          </button>
          <button
            type="button"
            onClick={() => { closeMenu(); openReservationChat() }}
            className="mobile-cta mobile-cta--reservas"
          >
            {t("nav.cta.reservas")}
          </button>
        </div>

        <p className="mobile-tagline">{t("nav.tagline")}</p>
      </nav>
    </>
  )
}

export default Navbar