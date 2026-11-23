import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { CLINIC_INFO } from '../data/clinicContext'
import { fetchAssets } from '../lib/api'
import { mapAssetsFromApi, type WebAssets } from '../lib/webAssets'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const WA_MSG = `${CLINIC_INFO.whatsappLink}?text=${encodeURIComponent(
  'Hola, quisiera coordinar una consulta con el Dr. Fernando Texeira Núñez.',
)}`

const MARQUEE = [
  'Ortodoncia',
  'Implantes',
  'Prótesis',
  'Cirugía oral',
  'Evaluación sin costo',
  'Salto, Uruguay',
  'Cosalco · Mercado Pago',
]

const MANIFESTO =
  'Cada consulta empieza con una evaluación honesta, criterio clínico y un trato cercano en el centro de Salto.'

function buildTreatments(IMG: WebAssets) {
  return [
    {
      title: 'Ortodoncia',
      body: 'Brackets autoligantes bucales y linguales para alinear con precisión y menos molestias.',
      image: IMG.gallery[0],
    },
    {
      title: 'Implantes',
      body: 'Raíces de titanio que se integran al hueso y recuperan función masticatoria y estética.',
      image: IMG.gallery[1],
    },
    {
      title: 'Prótesis',
      body: 'Completas o parciales, pensadas para masticar bien y verse naturales en el día a día.',
      image: IMG.gallery[2],
    },
    {
      title: 'Cirugía',
      body: 'Extracciones, dientes retenidos y correcciones mandibulares con protocolo claro.',
      image: IMG.gallery[3],
    },
  ]
}

function buildStackCards(IMG: WebAssets) {
  return [
    { name: 'Fran', text: 'Responsabilidad. El mejor.', photo: IMG.people.fran },
    { name: 'Jenny', text: 'Buena onda en cada visita.', photo: IMG.people.paciente },
    { name: 'Anto', text: 'Ortodoncia para niños: confianza total.', photo: IMG.people.ella },
    { name: 'Kevin', text: 'Seguimos el tratamiento. Diez puntos.', photo: IMG.gallery[5] },
  ]
}

export function ClinicWeb() {
  const rootRef = useRef<HTMLElement>(null)
  const [openAccordion, setOpenAccordion] = useState(0)
  const [IMG, setIMG] = useState<WebAssets>(() => mapAssetsFromApi([]))
  const TREATMENTS = buildTreatments(IMG)
  const STACK_CARDS = buildStackCards(IMG)

  useEffect(() => {
    let cancelled = false
    fetchAssets()
      .then((assets) => {
        if (!cancelled && assets.length) setIMG(mapAssetsFromApi(assets))
      })
      .catch(() => {
        /* fallback estático */
      })
    return () => {
      cancelled = true
    }
  }, [])

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return

      const words = root.querySelectorAll('.cw-scrub-word')
      gsap.set(words, { opacity: 0.12 })
      gsap.to(words, {
        opacity: 1,
        stagger: 0.08,
        ease: 'none',
        scrollTrigger: {
          trigger: '.cw-desire',
          start: 'top 70%',
          end: 'center 35%',
          scrub: true,
        },
      })

      const cards = gsap.utils.toArray<HTMLElement>('.cw-stack-card')
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 120 + i * 40, scale: 0.92, opacity: 0.35 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              end: 'top 45%',
              scrub: true,
            },
          },
        )
      })

      gsap.utils.toArray<HTMLElement>('.cw-scale-img').forEach((img) => {
        gsap.fromTo(
          img,
          { scale: 0.82, opacity: 0.45 },
          {
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: img,
              start: 'top 85%',
              end: 'top 40%',
              scrub: true,
            },
          },
        )
      })
    },
    { scope: rootRef },
  )

  useLayoutEffect(() => {
    document.documentElement.classList.add('clinic-web-active')
    return () => document.documentElement.classList.remove('clinic-web-active')
  }, [])

  return (
    <main ref={rootRef} className="clinic-web">
      <a className="cw-skip" href="#inicio">
        Ir al contenido
      </a>
      <div className="cw-grain" aria-hidden="true" />

      <header className="cw-nav-wrap">
        <div className="cw-nav-pill">
          <a className="cw-brand" href="#inicio">
            <img src={IMG.logoMark} alt="Logo del consultorio" width={36} height={36} />
            <strong>{CLINIC_INFO.doctor}</strong>
          </a>
          <nav className="cw-links" aria-label="Navegación">
            <a href="#tratamientos">Tratamientos</a>
            <a href="#experiencia">Experiencia</a>
            <a href="#contacto">Contacto</a>
            <Link to="/">Asistente</Link>
          </nav>
          <a className="cw-nav-cta" href={WA_MSG} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </div>
      </header>

      <section className="cw-hero" id="inicio">
        <figure className="cw-hero-banner">
          <img
            src={IMG.doctorPortrait}
            alt={CLINIC_INFO.doctor}
            width={1920}
            height={560}
          />
          <figcaption className="cw-hero-banner-veil" aria-hidden="true" />
        </figure>

        <div className="cw-hero-lower">
          <div className="cw-hero-copy">
            <p className="cw-hero-clinic">{CLINIC_INFO.name}</p>
            <h1 className="cw-hero-title">{CLINIC_INFO.doctor}</h1>
            <p className="cw-hero-lead">
              Ortodoncia, implantes y cirugía oral con evaluación sin costo en el centro de Salto.
            </p>
            <div className="cw-hero-ctas">
              <a className="cw-btn cw-btn-solid" href={WA_MSG} target="_blank" rel="noreferrer">
                Escribir por WhatsApp
              </a>
              <a className="cw-btn cw-btn-ghost" href="#tratamientos">
                Ver tratamientos
              </a>
            </div>
          </div>
          <div className="cw-hero-float">
            <div className="cw-hero-float-frame group">
              <img
                className="cw-hero-photo"
                src={IMG.gallery[5]}
                alt="Sonrisa tratada en el consultorio"
                width={960}
                height={960}
              />
            </div>
          </div>
        </div>
      </section>

      {/* INTEREST — Marquee + Bento + Horizontal Accordions */}
      <section className="cw-marquee-band" aria-hidden="true">
        <div className="cw-marquee-track">
          {[...MARQUEE, ...MARQUEE].map((item, i) => (
            <span key={`${item}-${i}`}>{item}</span>
          ))}
        </div>
      </section>

      <section className="cw-interest" id="tratamientos">
        <h2 className="cw-section-title">
          Cuidamos tu sonrisa
          <span
            className="cw-inline-pill"
            style={{ backgroundImage: `url(${IMG.gallery[5]})` }}
            aria-hidden="true"
          />
          con ciencia y calma
        </h2>

        <div className="cw-bento">
          <a className="cw-bento-cell cw-bento-a group" href={WA_MSG} target="_blank" rel="noreferrer">
            <img
              className="cw-bento-img"
              src={IMG.gallery[0]}
              alt="Equipo y pacientes en el consultorio"
            />
            <div className="cw-bento-overlay">
              <h3>Ortodoncia</h3>
              <p>Brackets autoligantes bucales y linguales.</p>
            </div>
          </a>
          <div className="cw-bento-cell cw-bento-b">
            <h3>Evaluación sin costo</h3>
            <p>
              Primera visita para diagnosticar con claridad. Lun y vie 10–16 hs; mar a jue 14–19 hs.
              Uruguay 1580, Barrio Centro.
            </p>
            <a className="cw-text-link" href={WA_MSG} target="_blank" rel="noreferrer">
              Coordinar turno
            </a>
          </div>
          <a className="cw-bento-cell cw-bento-c group" href={WA_MSG} target="_blank" rel="noreferrer">
            <img className="cw-bento-img" src={IMG.gallery[1]} alt="Caso de ortodoncia" />
            <div className="cw-bento-overlay">
              <h3>Implantes</h3>
            </div>
          </a>
          <a className="cw-bento-cell cw-bento-d group" href={WA_MSG} target="_blank" rel="noreferrer">
            <img className="cw-bento-img" src={IMG.gallery[2]} alt="Tratamiento en el consultorio" />
            <div className="cw-bento-overlay">
              <h3>Cirugía</h3>
            </div>
          </a>
        </div>

        <ul className="cw-icon-row" aria-label="Áreas de atención">
          {(
            [
              ['Ortodoncia', IMG.treatmentIcons.ortodoncia],
              ['Implantes', IMG.treatmentIcons.implantes],
              ['Prótesis', IMG.treatmentIcons.protesis],
              ['Cirugía', IMG.treatmentIcons.cirugias],
            ] as const
          ).map(([label, src]) => (
            <li key={label}>
              <img src={src} alt="" width={72} height={72} />
              <span>{label}</span>
            </li>
          ))}
        </ul>

        <div className="cw-accordion" role="list">
          {TREATMENTS.map((t, i) => {
            const open = openAccordion === i
            return (
              <button
                key={t.title}
                type="button"
                role="listitem"
                className={`cw-acc-slice${open ? ' is-open' : ''}`}
                aria-expanded={open}
                onClick={() => setOpenAccordion(i)}
                onMouseEnter={() => setOpenAccordion(i)}
              >
                <span className="cw-acc-title">{t.title}</span>
                <div className="cw-acc-body">
                  <img src={t.image} alt={`Detalle de ${t.title.toLowerCase()}`} className="cw-acc-img" />
                  <p>{t.body}</p>
                  <a href={WA_MSG} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                    Consultar por WhatsApp
                  </a>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* DESIRE — Scrubbing text + Card stacking */}
      <section className="cw-desire" id="experiencia">
        <p className="cw-scrub">
          {MANIFESTO.split(' ').map((word, i) => (
            <span key={`${word}-${i}`} className="cw-scrub-word">
              {word}{' '}
            </span>
          ))}
        </p>

        <div className="cw-stack">
          {STACK_CARDS.map((card) => (
            <article key={card.name} className="cw-stack-card">
              <img src={card.photo} alt={`Paciente ${card.name}`} className="cw-stack-photo" />
              <blockquote>
                <p>{card.text}</p>
                <cite>{card.name}</cite>
              </blockquote>
            </article>
          ))}
        </div>

        <div className="cw-gallery-strip">
          {IMG.gallery.slice(0, 4).map((src, i) => (
            <div key={src} className="cw-gallery-frame group">
              <img className="cw-scale-img" src={src} alt={`Caso clínico ${i + 1}`} />
            </div>
          ))}
        </div>
      </section>

      {/* ACTION */}
      <section className="cw-action" id="contacto">
        <div className="cw-action-panel">
          <h2>Tu próxima consulta empieza en un mensaje</h2>
          <p>
            Escribinos por WhatsApp. {CLINIC_INFO.address}. Tel. {CLINIC_INFO.phoneDisplay}. Lun y
            vie 10–16 hs · mar a jue 14–19 hs.
          </p>
          <a className="cw-btn cw-btn-solid cw-btn-xl" href={WA_MSG} target="_blank" rel="noreferrer">
            Abrir WhatsApp
          </a>
        </div>
      </section>

      <footer className="cw-footer">
        <div className="cw-footer-brand">
          <img src={IMG.logoMark} alt="Logo del consultorio" width={44} height={44} />
          <div>
            <strong>{CLINIC_INFO.doctor}</strong>
            <span>{CLINIC_INFO.specialties}</span>
          </div>
        </div>
        <div className="cw-footer-meta">
          <a href={WA_MSG} target="_blank" rel="noreferrer">
            {CLINIC_INFO.whatsapp}
          </a>
          <a href={`tel:${CLINIC_INFO.phone}`}>{CLINIC_INFO.phoneDisplay}</a>
          <a href={`mailto:${CLINIC_INFO.email}`}>{CLINIC_INFO.email}</a>
          <span>{CLINIC_INFO.address}</span>
        </div>
        <div className="cw-footer-links">
          <Link to="/">Asistente</Link>
          <a href={CLINIC_INFO.instagramUrl} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href={CLINIC_INFO.website} target="_blank" rel="noreferrer">
            Sitio original
          </a>
        </div>
      </footer>

      <a className="cw-fab" href={WA_MSG} target="_blank" rel="noreferrer" aria-label="WhatsApp">
        WhatsApp
      </a>
    </main>
  )
}
