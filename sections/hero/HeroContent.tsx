import Button          from "../../components/Button"
import { useLanguage } from "@/context/LanguageContext"

/* ── Ornamento de llama entre título y tagline ── */
const FlameDivider = () => (
  <div className="hero-flame-divider">
    <span className="hero-flame-line hero-flame-line--left"  aria-hidden="true" />
    <span className="hero-flame-icon" aria-hidden="true">🔥</span>
    <span className="hero-flame-line hero-flame-line--right" aria-hidden="true" />
  </div>
)

/* ── Links rápidos a los dos locales ── */
const LocaleLinks = () => {
  const { t } = useLanguage()

  const locales = [
    { label: t("hero.local.san_marcos"), href: "#locales" },
    { label: t("hero.local.la_ronda"),   href: "#locales" },
  ]

  return (
    <div className="hero-locale-links">
      {locales.map(({ label, href }) => (
        <a key={label} href={href} className="hero-locale-link">
          <span className="hero-locale-bullet" aria-hidden="true" />
          {label}
        </a>
      ))}
    </div>
  )
}

/* ── Contenido principal ── */
const HeroContent = () => {
  const { t } = useLanguage()

  const openReservationChat = () => {
    window.dispatchEvent(new CustomEvent("chatbot:open-reservation"))
  }

  return (
    <div className="hero-content padding-x">
      <div className="hero-content-inner">

        {/* Logo */}
        {/* Pre-label */}
        <span
          className="hero-prelabel"
          style={{ animationDelay: "0.3s" }}
        >
          {t("hero.prelabel")}
        </span>

        {/* Título principal */}
        <h1
          className="hero-title"
          style={{ animationDelay: "0.45s" }}
        >
          <span className="hero-title-leña">{t("hero.title.line1")}</span>
          <span className="hero-title-quiteña">{t("hero.title.line2")}</span>
        </h1>

        {/* Divider llama */}
        <div style={{ animationDelay: "0.6s" }} className="hero-fade-up">
          <FlameDivider />
        </div>

        {/* Tagline */}
        <p
          className="hero-tagline hero-fade-up"
          style={{ animationDelay: "0.75s" }}
        >
          {t("hero.tagline")}
        </p>

        {/* Sub-copy */}
        <p
          className="hero-subcopy hero-fade-up"
          style={{ animationDelay: "0.9s" }}
        >
          {t("hero.subcopy")}
        </p>

        {/* CTAs */}
        <div
          className="hero-cta-group hero-fade-up"
          style={{ animationDelay: "1.05s" }}
        >
          <Button href="#menu" variant="primary">
            {t("hero.cta.menu")}
          </Button>
          <Button variant="outline" onClick={openReservationChat}>
            {t("hero.cta.reserve")}
          </Button>
        </div>

        {/* Locales quick-links */}
        <div
          className="hero-fade-up"
          style={{ animationDelay: "1.2s" }}
        >
          <LocaleLinks />
        </div>

      </div>
    </div>
  )
}

export default HeroContent