import { CLINIC_INFO } from '../data/clinicContext'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <img src="/logo.png" alt="" width={36} height={36} />
        <div>
          <strong>{CLINIC_INFO.doctor}</strong>
          <span>{CLINIC_INFO.address}</span>
        </div>
      </div>
      <div className="footer-links">
        <a href={`tel:${CLINIC_INFO.phone}`}>Tel. {CLINIC_INFO.phoneDisplay}</a>
        <a href={`mailto:${CLINIC_INFO.email}`}>{CLINIC_INFO.email}</a>
        <a href={CLINIC_INFO.instagramUrl} target="_blank" rel="noreferrer">
          {CLINIC_INFO.instagram}
        </a>
      </div>
    </footer>
  )
}
