import { useLanguage }    from "@/context/LanguageContext"
import { useRestaurant, type RestaurantKey } from "@/context/RestaurantContext"
import { logoSanMarcos, logoLaRonda } from "@/assets/logo"

/* ── Ornamento de llama entre título y tagline ── */
const FlameDivider = () => (
  <div className="hero-flame-divider">
    <span className="hero-flame-line hero-flame-line--left"  aria-hidden="true" />
    <span className="hero-flame-icon" aria-hidden="true">🔥</span>
    <span className="hero-flame-line hero-flame-line--right" aria-hidden="true" />
  </div>
)

const RESTAURANT_CARDS: {
  key: RestaurantKey
  logo: string
  logoAlt: string
  nameKey: string
  zoneName: string
}[] = [
  {
    key:      "san-marcos",
    logo:     logoSanMarcos,
    logoAlt:  "Logo San Marcos",
    nameKey:  "hero.local.san_marcos",
    zoneName: "San Marcos",
  },
  {
    key:      "la-ronda",
    logo:     logoLaRonda,
    logoAlt:  "Logo La Ronda",
    nameKey:  "hero.local.la_ronda",
    zoneName: "La Ronda",
  },
]

/* ── Contenido principal ── */
const HeroContent = () => {
  const { t } = useLanguage()
  const { selectedRestaurant, selectRestaurant } = useRestaurant()

  const handleSelect = (key: RestaurantKey) => {
    selectRestaurant(key)
    // Scroll suave a la sección de historia
    setTimeout(() => {
      document.getElementById("historia")?.scrollIntoView({ behavior: "smooth" })
    }, 80)
  }

  return (
    <div className="hero-content padding-x">
      <div className="hero-content-inner flex flex-col items-center text-center">

        {/* Título principal: Leña Quiteña */}
        <h1
          className="hero-title"
          style={{ animationDelay: "0.2s" }}
        >
          <span className="hero-title-leña">{t("hero.title.line1")}</span>
          <span className="hero-title-quiteña">{t("hero.title.line2")}</span>
        </h1>

        {/* Frase / Tagline */}
        <p
          className="hero-tagline hero-fade-up mt-4 md:mt-6"
          style={{ animationDelay: "0.4s" }}
        >
          {t("hero.tagline")}
        </p>

        {/* ── Sección de Selección de Restaurante ── */}
        <div
          className="hero-fade-up mt-12 md:mt-16 flex flex-col items-center w-full"
          style={{ animationDelay: "0.6s" }}
        >
          {/* Título Superior */}
          <h2 className="text-[#D1B894] text-base md:text-lg uppercase tracking-[0.2em] mb-10 font-serif font-light">
            Elige un Restaurante
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 w-full max-w-3xl">

            {RESTAURANT_CARDS.map((card, idx) => {
              const isSelected = selectedRestaurant === card.key
              return (
                <>
                  {idx === 1 && (
                    /* Divisor vertical sutil */
                    <div key="divider" className="hidden md:block h-56 w-[1px] bg-gradient-to-b from-transparent via-[#F5EDD8]/10 to-transparent" />
                  )}

                  <button
                    key={card.key}
                    type="button"
                    onClick={() => handleSelect(card.key)}
                    className={[
                      "group relative flex flex-col items-center justify-between",
                      "w-56 md:w-60 h-[300px] p-6 rounded-xl",
                      "transition-all duration-300 ease-out",
                      "backdrop-blur-md",
                      isSelected
                        ? "bg-[#1A0A06]/70 shadow-[0_20px_50px_rgba(209,184,148,0.2)] -translate-y-3 ring-1 ring-[#D1B894]/40"
                        : "bg-[#1A0A06]/40 shadow-[0_10px_40px_rgba(0,0,0,0.5)] hover:-translate-y-3 hover:bg-[#1A0A06]/60 hover:shadow-[0_20px_50px_rgba(209,184,148,0.1)]",
                    ].join(" ")}
                    aria-pressed={isSelected}
                  >
                    {/* Indicador seleccionado */}
                    {isSelected && (
                      <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-[#D1B894] animate-pulse" />
                    )}

                    {/* Logo en círculo blanco sutil */}
                    <div className="flex-1 flex items-center justify-center w-full mt-2">
                      <div
                        className={[
                          "flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-white p-2 shadow-inner",
                          "transition-transform duration-300",
                          isSelected ? "scale-110" : "group-hover:scale-105",
                        ].join(" ")}
                      >
                        <img
                          src={card.logo}
                          alt={card.logoAlt}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    </div>

                    {/* Textos de la tarjeta */}
                    <div className="w-full flex flex-col items-center gap-1.5 mb-2 text-[#F5EDD8]">
                      <span className="text-lg md:text-xl uppercase tracking-widest font-serif leading-tight text-center">
                        Leña<br />Quiteña
                      </span>
                      <span
                        className={[
                          "text-xs md:text-sm uppercase tracking-[0.25em] transition-colors duration-300",
                          isSelected ? "text-[#F5EDD8]" : "text-[#D1B894]",
                        ].join(" ")}
                      >
                        {card.zoneName}
                      </span>

                      {/* Texto de acción */}
                      <span
                        className={[
                          "text-[10px] uppercase tracking-[0.2em] mt-1 transition-opacity duration-300",
                          isSelected ? "text-[#D1B894] opacity-100" : "text-[#F5EDD8]/40 opacity-0 group-hover:opacity-100",
                        ].join(" ")}
                      >
                        {isSelected ? "✓ Seleccionado" : "Ver restaurante"}
                      </span>
                    </div>
                  </button>
                </>
              )
            })}

          </div>

          {/* Indicador de scroll cuando hay selección */}
          {selectedRestaurant && (
            <p className="mt-8 text-[#D1B894]/60 text-[11px] uppercase tracking-widest animate-pulse">
              Desplázate para ver el contenido
            </p>
          )}
        </div>

      </div>
    </div>
  )
}

export default HeroContent
