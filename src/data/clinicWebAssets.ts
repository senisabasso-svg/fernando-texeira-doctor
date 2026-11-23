/** Imágenes tomadas del sitio oficial drfernandotexeira.com.uy */
const BASE = 'https://drfernandotexeira.com.uy'

export const CLINIC_WEB_ASSETS = {
  doctorPortrait: `${BASE}/wp-content/uploads/2017/06/cropped-dr-fernando-texeira-nu%C3%B1ez.jpg`,
  logoMark: `${BASE}/wp-content/uploads/2017/06/16387074_1488495661184949_1401406315210410457_n.png`,
  treatmentIcons: {
    ortodoncia: `${BASE}/images/img1.png`,
    implantes: `${BASE}/images/img2.png`,
    protesis: `${BASE}/images/img3.png`,
    cirugias: `${BASE}/images/img4.png`,
  },
  gallery: [
    `${BASE}/wp-content/uploads/2017/06/ortodoncia.jpg`,
    `${BASE}/wp-content/uploads/2017/06/ortodoncia2.jpg`,
    `${BASE}/wp-content/uploads/2017/06/ortodoncia3.jpg`,
    `${BASE}/wp-content/uploads/2017/06/ortodoncia4.jpg`,
    `${BASE}/wp-content/uploads/2017/06/1.jpg`,
    `${BASE}/wp-content/uploads/2017/06/17800036_10212908492446627_968496154874771958_n.jpg`,
  ],
  people: {
    fran: `${BASE}/wp-content/uploads/2017/06/fran.jpg`,
    paciente: `${BASE}/wp-content/uploads/2017/06/paciente.jpg`,
    ella: `${BASE}/wp-content/uploads/2017/06/ella.jpg`,
  },
} as const
