import { CLINIC_WEB_ASSETS } from '../data/clinicWebAssets'
import type { SiteAsset } from './api'

export type WebAssets = {
  doctorPortrait: string
  logoMark: string
  treatmentIcons: {
    ortodoncia: string
    implantes: string
    protesis: string
    cirugias: string
  }
  gallery: string[]
  people: {
    fran: string
    paciente: string
    ella: string
  }
}

function byKey(assets: SiteAsset[], key: string, fallback: string) {
  return assets.find((a) => a.key === key)?.url || fallback
}

export function mapAssetsFromApi(assets: SiteAsset[]): WebAssets {
  const fallback = CLINIC_WEB_ASSETS
  return {
    doctorPortrait: byKey(assets, 'doctorPortrait', fallback.doctorPortrait),
    logoMark: byKey(assets, 'logoMark', fallback.logoMark),
    treatmentIcons: {
      ortodoncia: byKey(assets, 'icon.ortodoncia', fallback.treatmentIcons.ortodoncia),
      implantes: byKey(assets, 'icon.implantes', fallback.treatmentIcons.implantes),
      protesis: byKey(assets, 'icon.protesis', fallback.treatmentIcons.protesis),
      cirugias: byKey(assets, 'icon.cirugias', fallback.treatmentIcons.cirugias),
    },
    gallery: [
      byKey(assets, 'gallery.0', fallback.gallery[0]),
      byKey(assets, 'gallery.1', fallback.gallery[1]),
      byKey(assets, 'gallery.2', fallback.gallery[2]),
      byKey(assets, 'gallery.3', fallback.gallery[3]),
      byKey(assets, 'gallery.4', fallback.gallery[4]),
      byKey(assets, 'gallery.5', fallback.gallery[5]),
    ],
    people: {
      fran: byKey(assets, 'people.fran', fallback.people.fran),
      paciente: byKey(assets, 'people.paciente', fallback.people.paciente),
      ella: byKey(assets, 'people.ella', fallback.people.ella),
    },
  }
}
