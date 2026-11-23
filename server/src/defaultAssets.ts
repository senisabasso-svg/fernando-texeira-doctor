const BASE = 'https://drfernandotexeira.com.uy'

export const DEFAULT_ASSETS: Array<{ key: string; label: string; url: string; sortOrder: number }> = [
  {
    key: 'doctorPortrait',
    label: 'Banner / retrato del doctor',
    url: `${BASE}/wp-content/uploads/2017/06/cropped-dr-fernando-texeira-nu%C3%B1ez.jpg`,
    sortOrder: 10,
  },
  {
    key: 'logoMark',
    label: 'Logo',
    url: `${BASE}/wp-content/uploads/2017/06/16387074_1488495661184949_1401406315210410457_n.png`,
    sortOrder: 20,
  },
  {
    key: 'icon.ortodoncia',
    label: 'Ícono ortodoncia',
    url: `${BASE}/images/img1.png`,
    sortOrder: 30,
  },
  {
    key: 'icon.implantes',
    label: 'Ícono implantes',
    url: `${BASE}/images/img2.png`,
    sortOrder: 31,
  },
  {
    key: 'icon.protesis',
    label: 'Ícono prótesis',
    url: `${BASE}/images/img3.png`,
    sortOrder: 32,
  },
  {
    key: 'icon.cirugias',
    label: 'Ícono cirugía',
    url: `${BASE}/images/img4.png`,
    sortOrder: 33,
  },
  {
    key: 'gallery.0',
    label: 'Galería 1',
    url: `${BASE}/wp-content/uploads/2017/06/ortodoncia.jpg`,
    sortOrder: 40,
  },
  {
    key: 'gallery.1',
    label: 'Galería 2',
    url: `${BASE}/wp-content/uploads/2017/06/ortodoncia2.jpg`,
    sortOrder: 41,
  },
  {
    key: 'gallery.2',
    label: 'Galería 3',
    url: `${BASE}/wp-content/uploads/2017/06/ortodoncia3.jpg`,
    sortOrder: 42,
  },
  {
    key: 'gallery.3',
    label: 'Galería 4',
    url: `${BASE}/wp-content/uploads/2017/06/ortodoncia4.jpg`,
    sortOrder: 43,
  },
  {
    key: 'gallery.4',
    label: 'Galería 5',
    url: `${BASE}/wp-content/uploads/2017/06/1.jpg`,
    sortOrder: 44,
  },
  {
    key: 'gallery.5',
    label: 'Galería 6 / sonrisa',
    url: `${BASE}/wp-content/uploads/2017/06/17800036_10212908492446627_968496154874771958_n.jpg`,
    sortOrder: 45,
  },
  {
    key: 'people.fran',
    label: 'Testimonio Fran',
    url: `${BASE}/wp-content/uploads/2017/06/fran.jpg`,
    sortOrder: 50,
  },
  {
    key: 'people.paciente',
    label: 'Testimonio Jenny',
    url: `${BASE}/wp-content/uploads/2017/06/paciente.jpg`,
    sortOrder: 51,
  },
  {
    key: 'people.ella',
    label: 'Testimonio Anto',
    url: `${BASE}/wp-content/uploads/2017/06/ella.jpg`,
    sortOrder: 52,
  },
]
