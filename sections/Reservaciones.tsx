import { useState } from "react"
import { useLanguage } from "@/context/LanguageContext"

export default function Reservaciones() {
  const { t } = useLanguage()
  const [enviado, setEnviado] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setEnviado(true)
  }

  return (
    <section id="reservaciones" className="reservaciones-section">
      <div className="section-header">
        <span className="section-label">{t("reservas.section.label")}</span>
        <h2 className="section-title">
          {t("reservas.section.title")}
        </h2>
        <div className="ornament-line">
          <div className="ornament-dot" />
        </div>
      </div>

      <div className="reserva-container">
        <p className="reserva-intro">
          {t("reservas.intro")}
        </p>

        {enviado ? (
          <div className="reserva-confirmacion">
            <span className="reserva-confirmacion-icon">✓</span>
            <p>
              {t("reservas.success.title")} {t("reservas.success.body")}
            </p>
          </div>
        ) : (
          <form className="reserva-grid" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{t("reservas.field.full_name")}</label>
              <input type="text" placeholder={t("reservas.placeholder.name")} required />
            </div>
            <div className="form-group">
              <label>{t("reservas.field.phone")}</label>
              <input type="tel" placeholder={t("reservas.placeholder.phone")} required />
            </div>
            <div className="form-group">
              <label>{t("reservas.field.email")}</label>
              <input type="email" placeholder={t("reservas.placeholder.email")} required />
            </div>
            <div className="form-group">
              <label>{t("reservas.field.location")}</label>
              <select required defaultValue="">
                <option value="" disabled>
                  {t("reservas.placeholder.location")}
                </option>
                <option>{t("reservas.option.location.san_marcos")}</option>
                <option>{t("reservas.option.location.la_ronda")}</option>
              </select>
            </div>
            <div className="form-group">
              <label>{t("reservas.field.date")}</label>
              <input type="date" required />
            </div>
            <div className="form-group">
              <label>{t("reservas.field.guests")}</label>
              <select required defaultValue="">
                <option value="" disabled>
                  {t("reservas.placeholder.guests")}
                </option>
                <option>{t("reservas.option.guests.1_2")}</option>
                <option>{t("reservas.option.guests.3_4")}</option>
                <option>{t("reservas.option.guests.5_6")}</option>
                <option>{t("reservas.option.guests.7_plus")}</option>
              </select>
            </div>
            <div className="form-group full">
              <label>{t("reservas.field.message")}</label>
              <textarea
                placeholder={t("reservas.placeholder.message")}
                rows={4}
              />
            </div>
            <div className="reserva-submit">
              <button type="submit" className="btn-primary">
                {t("reservas.submit")}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
