import { useEffect, useState } from "react"
import { useLanguage } from "@/context/LanguageContext"

interface Testimonio {
  text: string
  autor: string
  local: string
  avatar?: string
}

export default function Resenas() {
  const { t } = useLanguage()
  const TESTIMONIOS: Testimonio[] = [
    {
      text: t("resenas.item1.text"),
      autor: t("resenas.item1.author"),
      local: t("resenas.item1.place"),
      avatar: "VI",
    },
    {
      text: t("resenas.item2.text"),
      autor: t("resenas.item2.author"),
      local: t("resenas.item2.place"),
      avatar: "VG",
    },
    {
      text: t("resenas.item3.text"),
      autor: t("resenas.item3.author"),
      local: t("resenas.item3.place"),
      avatar: "TT",
    },
  ]

  const total = TESTIMONIOS.length
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)

  const nextTestimonio = () => {
    setActiveIndex((prev) => (prev + 1) % total)
  }

  const prevTestimonio = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total)
  }

  useEffect(() => {
    if (isPaused) return
    const timerId = window.setInterval(() => {
      nextTestimonio()
    }, 4500)
    return () => window.clearInterval(timerId)
  }, [isPaused])

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const getRelativeOffset = (index: number) => {
    let offset = index - activeIndex
    if (offset > total / 2) offset -= total
    if (offset < -total / 2) offset += total
    return offset
  }

  return (
    <section
      id="resenas"
      // ✅ FIX 1: Quitado overflow-hidden — permitía cortar las tarjetas laterales
      className="relative min-h-170 px-4 pb-28 pt-16 text-amber-50 md:min-h-190 md:px-8 md:pb-36 md:pt-28"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label={t("resenas.aria.carousel")}
    >
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_20%_20%,rgba(180,83,9,0.28),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(127,29,29,0.25),transparent_40%),linear-gradient(135deg,#17120f_0%,#241915_45%,#1b1411_100%)]" />

      <div className="pointer-events-none absolute inset-0 -z-10 opacity-20 mix-blend-soft-light [background:repeating-linear-gradient(120deg,rgba(251,191,36,0.12)_0_2px,transparent_2px_16px)]" />

      <div className="pointer-events-none absolute inset-0 -z-10">
        {[...Array(12)].map((_, i) => (
          <span
            key={`spark-${i}`}
            className="absolute h-1 w-1 rounded-full bg-amber-300/60 blur-[1px] animate-pulse"
            style={{
              left: `${8 + i * 7}%`,
              top: `${10 + ((i * 9) % 75)}%`,
              animationDuration: `${2.2 + (i % 5) * 0.8}s`,
              animationDelay: `${(i % 4) * 0.35}s`,
            }}
          />
        ))}
        {[...Array(4)].map((_, i) => (
          <span
            key={`smoke-${i}`}
            className="absolute rounded-full bg-zinc-200/10 blur-3xl animate-pulse"
            style={{
              width: `${150 + i * 40}px`,
              height: `${90 + i * 20}px`,
              left: `${12 + i * 22}%`,
              top: `${18 + i * 14}%`,
              animationDuration: `${6 + i * 1.5}s`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div className="mx-auto mb-8 max-w-5xl text-center md:mb-10">
        <span className="inline-block rounded-full border border-amber-300/30 bg-amber-200/10 px-4 py-1 text-xs uppercase tracking-[0.2em] text-amber-200">
          {t("resenas.badge")}
        </span>
        <h2 className="mt-4 text-[34px] font-semibold tracking-tight text-amber-50 md:text-5xl">
          {t("resenas.title")}
        </h2>
        <div className="mx-auto mt-4 h-px w-40 bg-linear-to-r from-transparent via-amber-300/70 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-6xl px-2 md:px-16 lg:px-20">
        <div className="relative h-98 md:h-108">
          {TESTIMONIOS.map((t, index) => {
            const offset = getRelativeOffset(index)
            const isCenter = offset === 0

            const visualState =
              isMobile
                ? offset === 0
                  ? { x: "0%", scale: 1, opacity: 1, zIndex: 30 }
                  : { x: "0%", scale: 0.96, opacity: 0, zIndex: 10 }
                : offset === 0
                  ? { x: "0%", scale: 1, opacity: 1, zIndex: 30 }
                  : offset === -1
                    ? { x: "-78%", scale: 0.9, opacity: 0.8, zIndex: 20 }
                    : offset === 1
                      ? { x: "78%", scale: 0.9, opacity: 0.8, zIndex: 20 }
                      : { x: "0%", scale: 0.84, opacity: 0, zIndex: 10 }

            return (
              <article
                key={`${t.autor}-${index}`}
                className={`group absolute left-1/2 top-0 h-full w-full max-w-[95vw] md:max-w-126 overflow-hidden rounded-2xl border p-5 md:p-6 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isCenter
                    ? "border-amber-300/55 bg-linear-to-b from-amber-100/95 via-amber-50/92 to-orange-100/90 text-zinc-900 shadow-[0_24px_55px_-18px_rgba(251,191,36,0.6)]"
                    : "border-amber-200/25 bg-linear-to-b from-amber-50/75 via-orange-50/70 to-amber-100/65 text-zinc-800 shadow-[0_18px_40px_-25px_rgba(0,0,0,0.5)]"
                }`}
                style={{
                  transform: `translateX(calc(-50% + ${visualState.x})) scale(${visualState.scale})`,
                  opacity: visualState.opacity,
                  zIndex: visualState.zIndex,
                }}
                aria-current={isCenter}
              >
                <div className="pointer-events-none absolute inset-0 opacity-20 [background:repeating-linear-gradient(0deg,rgba(120,53,15,0.13)_0_1px,transparent_1px_9px)]" />

                <div className="relative z-10 flex h-full flex-col">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-700/30 bg-linear-to-br from-amber-200 to-orange-200 text-xs font-bold tracking-wide text-amber-900">
                      {t.avatar ?? t.autor.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-4xl leading-none text-amber-700/70 md:text-5xl">"</span>
                  </div>

                  <p className={`text-[15px] leading-relaxed md:text-base ${isCenter ? "md:text-lg" : "md:text-[17px]"}`}>
                    {t.text}
                  </p>

                  <div className="mt-4 border-t border-amber-700/15 pt-3">
                    <div className="text-lg tracking-[0.15em] text-amber-600 md:text-xl">★★★★★</div>
                    <p className="mt-2 text-sm font-semibold text-zinc-900 md:text-base">{t.autor}</p>
                    <p className="text-xs text-zinc-600 md:text-sm">{t.local}</p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <button
          type="button"
          className="absolute -bottom-13 left-[calc(50%-64px)] z-40 flex h-10 w-10 items-center justify-center rounded-full border border-amber-300/40 bg-zinc-900/70 text-xl text-amber-100 backdrop-blur transition hover:bg-zinc-800/90 md:h-11 md:w-11 md:-left-4 md:top-1/2 md:bottom-auto md:-translate-y-1/2 lg:-left-8"
          onClick={prevTestimonio}
          aria-label={t("resenas.aria.prev")}
        >
          ‹
        </button>

        <button
          type="button"
          className="absolute -bottom-13 left-[calc(50%+24px)] z-40 flex h-10 w-10 items-center justify-center rounded-full border border-amber-300/40 bg-zinc-900/70 text-xl text-amber-100 backdrop-blur transition hover:bg-zinc-800/90 md:h-11 md:w-11 md:-right-4 md:top-1/2 md:bottom-auto md:left-auto md:-translate-y-1/2 lg:-right-8"
          onClick={nextTestimonio}
          aria-label={t("resenas.aria.next")}
        >
          ›
        </button>
      </div>

      <div className="mt-14 flex justify-center gap-2 md:mt-8" role="tablist" aria-label="Seleccionar reseña">
        {TESTIMONIOS.map((_, i) => (
          <button
            key={`dot-${i}`}
            type="button"
            role="tab"
            aria-selected={i === activeIndex}
            className={`h-2.5 rounded-full transition-all ${
              i === activeIndex ? "w-8 bg-amber-300" : "w-2.5 bg-amber-200/45 hover:bg-amber-200/70"
            }`}
            onClick={() => setActiveIndex(i)}
          >
            <span className="sr-only">Ver reseña {i + 1}</span>
          </button>
        ))}
      </div>
    </section>
  )
}