# Asistente — Dr. Fernando Texeira Núñez

Chat con IA (Gemini) para el Consultorio Odontológico: consultas rápidas y pestaña de recomendaciones (ortodoncia, prótesis, post extracción, horarios).

## Arranque

```bash
npm install
cp .env.example .env
# Editá .env y pegá tu VITE_GEMINI_API_KEY
npm run dev
```

## Scripts

- `npm run dev` — desarrollo
- `npm run build` — build de producción
- `npm run preview` — preview del build

## Contexto de Gemini

El prompt del sistema está en `src/data/clinicContext.ts`. Las cards de la pestaña **Recomendaciones** están en `src/data/recommendations.ts`.

## Datos del consultorio

- WhatsApp: 099119522
- Tel: 47334971
- Dirección: Uruguay 1580 — Salto
- Instagram: [@drfernandotexeiranunez](https://www.instagram.com/drfernandotexeiranunez/)
