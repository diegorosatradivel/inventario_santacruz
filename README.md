# Inventario SantaCruz · Plantilla base Next.js

Este repositorio contiene una plantilla inicial de **Next.js + TypeScript** diseñada para empezar un proyecto con arquitectura ordenada, buenas prácticas y escalabilidad.

## Stack

- Next.js 14 (App Router)
- React 18
- TypeScript estricto
- ESLint + Prettier
- MongoDB Atlas + Mongoose

## Registro de usuario con MongoDB Atlas

Se integró un flujo de registro con usuario y contraseña usando conexión directa a MongoDB Atlas (`mongodb+srv`).

### Flujo implementado

1. El usuario completa el formulario en `/registro`.
2. Se hace `POST` a `src/app/api/auth/registro/route.ts`.
3. El servidor valida datos, se conecta a MongoDB Atlas, revisa duplicados y guarda el nuevo usuario.
4. La contraseña se guarda como hash + salt (nunca en texto plano).

### Variables de entorno

Copia `.env.example` a `.env.local` y completa:

- `MONGODB_URI`
- `MONGODB_NOMBRE_BD`

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run type-check
npm run formato
npm run formato:verificar
```
