import { useLanguage } from "@/context/LanguageContext"
import { logoRestaurante } from "../assets/logo"

interface Testimonio {
  text: string
  autor: string
  local: string
}

export default function Resenas() {
  const { t } = useLanguage()
  const TESTIMONIOS: Testimonio[] = [
    {
      text: t("resenas.item1.text"),
      autor: t("resenas.item1.author"),
      local: t("resenas.item1.place"),
    },
    {
      text: t("resenas.item2.text"),
      autor: t("resenas.item2.author"),
      local: t("resenas.item2.place"),
    },
    {
      text: t("resenas.item3.text"),
      autor: t("resenas.item3.author"),
      local: t("resenas.item3.place"),
    },
  ]

  // Duplicamos las tarjetas para cubrir pantallas anchas
  const extendedItems = Array(6).fill(TESTIMONIOS).flat()

  return (
    <section
      id="resenas"
      className="relative py-20 md:py-28 overflow-hidden"
      style={{ background: "var(--color-cafe)" }}
      aria-label={t("resenas.aria.carousel")}
    >
      {/* ── Estilos CSS integrados para la animación continua ── */}
      <style>{`
        @keyframes scroll-infinito {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); } 
        }
        .carrusel-continuo {
          display: flex;
          width: max-content;
          /* Puedes ajustar los 40s para que vaya más rápido o más lento */
          animation: scroll-infinito 40s linear infinite; 
        }
        
      `}</style>

      {/* Section header */}
      {/* Section header */}
      <div className="mx-auto mb-12 max-w-3xl px-6 text-center md:mb-40">
        {/* ── Línea decorativa superior ── */}
        <div
          className="mx-auto mb-6 h-px w-48 md:w-64"
          style={{ 
            background: "linear-gradient(90deg, transparent, var(--color-dorado), transparent)", 
            opacity: 0.6 
          }}
        />

        <span
          className="mb-3 inline-block text-xs uppercase tracking-[0.25em]"
          style={{ color: "var(--color-dorado)", fontFamily: "'Cinzel', serif" }}
        >
          {t("resenas.badge")}
        </span>
        
        <h2
          className="text-3xl font-semibold md:text-4xl lg:text-5xl"
          style={{ color: "var(--color-crema)", fontFamily: "'Cinzel', serif" }}
        >
          {t("resenas.title")}
        </h2>

        {/* ── Línea decorativa inferior ── */}
        <div
          className="mx-auto mt-6 h-px w-48 md:w-64"
          style={{ 
            background: "linear-gradient(90deg, transparent, var(--color-dorado), transparent)", 
            opacity: 0.6 
          }}
        />
      </div>

      {/* ── Multi-card sliding carousel ── */}
      <div className="pt-2 -mt-2 pb-2">
        <div className="carrusel-continuo">
          {extendedItems.map((testimonio, index) => (
            <div
              key={`card-${index}`}
              // Mantenemos anchos fijos, pero los hacemos más anchos
              // para simular el aspecto original
              className="w-[85vw] sm:w-[400px] md:w-[500px] shrink-0 px-3 md:px-5"
            >
              <article
                className="mx-auto h-full flex flex-col overflow-hidden rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(212,161,59,0.15)] hover:border-[rgba(212,161,59,0.3)] cursor-default"
                style={{
                  background: "#2A1610",
                  border: "1px solid rgba(90, 50, 30, 0.5)",
                }}
              >
                {/* ── Top: Logo + Review text ── */}
                <div className="flex items-center gap-5 p-6 pb-5 md:p-8 md:pb-6 flex-1">
                  {/* Logo in white square (Más grande) */}
                  <div
                    className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md md:h-28 md:w-28"
                    style={{ background: "#ffffff" }}
                  >
                    <img
                      src={logoRestaurante}
                      alt="Leña Quiteña"
                      className="h-16 w-16 object-contain md:h-[6rem] md:w-[6rem]"
                    />
                  </div>

                  {/* Review text */}
                  <p
                    className="flex-1 text-lg leading-relaxed md:text-xl md:leading-relaxed"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontStyle: "italic",
                      color: "var(--color-crema)",
                      opacity: 0.9,
                    }}
                  >
                    {testimonio.text}
                  </p>
                </div>

                {/* ── Divider ── */}
                <div
                  className="mx-6 h-px md:mx-8"
                  style={{ background: "var(--color-vino)" }}
                />

                {/* ── Bottom: Author + Stars (Restaurando estilos originales) ── */}
                <div className="flex items-end justify-between px-6 py-4 md:px-8 md:py-5">
                  <div>
                    <p
                      className="text-sm font-bold md:text-base"
                      style={{
                        fontFamily: "'Nunito Variable', 'Inter', sans-serif",
                        color: "var(--color-crema)",
                      }}
                    >
                      {testimonio.autor}
                    </p>
                    <p
                      className="mt-0.5 text-sm"
                      style={{
                        fontFamily: "'Nunito Variable', 'Inter', sans-serif",
                        color: "var(--color-crema)",
                        opacity: 0.5,
                      }}
                    >
                      {testimonio.local}
                    </p>
                  </div>
                  {/* Stars (Restaurando tamaño original) */}
                  {/* Badge con Icono User-Star */}
                  <div
                    className="flex items-center justify-center rounded-full border px-3 py-1.5 transition-colors duration-300"
                    style={{
                      borderColor: "rgba(212, 161, 59, 0.4)",
                      
                      color: "var(--color-dorado)",
                    }}
                    title="Reseña Destacada"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 md:h-6 md:w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16.051 12.616a1 1 0 0 1 1.909.024l.737 1.452a1 1 0 0 0 .737.535l1.634.256a1 1 0 0 1 .588 1.806l-1.172 1.168a1 1 0 0 0-.282.866l.259 1.613a1 1 0 0 1-1.541 1.134l-1.465-.75a1 1 0 0 0-.912 0l-1.465.75a1 1 0 0 1-1.539-1.133l.258-1.613a1 1 0 0 0-.282-.866l-1.156-1.153a1 1 0 0 1 .572-1.822l1.633-.256a1 1 0 0 0 .737-.535z" />
                      <path d="M8 15H7a4 4 0 0 0-4 4v2" />
                      <circle cx="10" cy="7" r="4" />
                    </svg>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}