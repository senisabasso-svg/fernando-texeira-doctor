# Backend Consultorio (Railway + Postgres)

API Express + Prisma para:

- editar imágenes de `/web`
- guardar y listar preguntas del chat
- login de administrador

## Variables de entorno

Copiá `.env.example` a `.env`:

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Connection string de Postgres (Railway la inyecta) |
| `JWT_SECRET` | Secreto largo para tokens admin |
| `ADMIN_EMAIL` | Email del admin (se crea al arrancar) |
| `ADMIN_PASSWORD` | Contraseña inicial del admin |
| `CORS_ORIGIN` | Origen del frontend, ej. `https://tu-sitio.pages.dev` |
| `PUBLIC_BASE_URL` | URL pública de esta API (para links de uploads) |
| `PORT` | Railway lo define solo |

## Scripts

```bash
cd server
npm install
npx prisma db push
npm run dev
```

## Deploy en Railway

1. Creá un proyecto en Railway y agregá **PostgreSQL**.
2. Agregá un servicio desde este repo, root directory: `server`.
3. Conectá la variable `DATABASE_URL` del Postgres al servicio.
4. Seteá `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CORS_ORIGIN`, `PUBLIC_BASE_URL`.
5. Deploy. El start corre `prisma db push` y levanta la API. Al boot se crea el admin y los assets por defecto.
6. En el frontend (Cloudflare Pages) agregá `VITE_API_URL=https://tu-api.up.railway.app`.

### Uploads persistentes

Las imágenes subidas van a `/uploads`. En Railway conviene montar un **Volume** en `/app/uploads` (o la ruta de `UPLOADS_DIR`). Si no, también podés pegar URLs externas en el panel.

## Endpoints

- `GET /health`
- `GET /api/assets` (público)
- `POST /api/auth/login`
- `PUT /api/assets/:key` (admin)
- `POST /api/assets/:key/upload` (admin)
- `POST /api/chat-logs` (público)
- `GET /api/chat-logs` (admin)

Panel: `https://tu-frontend/admin`
