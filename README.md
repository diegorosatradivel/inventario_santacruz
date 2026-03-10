# Inventario SantaCruz · Plantilla base Next.js

Este repositorio contiene una plantilla inicial de **Next.js + TypeScript** diseñada para empezar un proyecto con arquitectura ordenada, buenas prácticas y escalabilidad.

## Stack

- Next.js 14 (App Router)
- React 18
- TypeScript estricto
- ESLint + Prettier

## Estructura propuesta

```txt
src/
  app/                        # Rutas y layouts (App Router)
  components/
    ui/                       # Componentes reutilizables de UI
  features/
    inicio/                   # Módulo por dominio/feature
      components/
      constantes/
  lib/                        # Utilidades compartidas
```

## Registro de usuario con MongoDB Atlas (Data API)

Se integró una ruta de API para registrar usuarios con contraseña hasheada.

### Flujo implementado

1. El usuario completa el formulario en `/registro`.
2. Se hace `POST` a `src/app/api/auth/registro/route.ts`.
3. El servidor valida datos, verifica duplicados y guarda el usuario en Atlas.
4. La contraseña se guarda como hash + salt (nunca en texto plano).

### Variables de entorno

Copia `.env.example` a `.env.local` y completa:

- `MONGODB_ATLAS_DATA_API_URL`
- `MONGODB_ATLAS_DATA_API_KEY`
- `MONGODB_ATLAS_DATABASE`
- `MONGODB_ATLAS_COLECCION_USUARIOS`

### Importante para Atlas

- Debes habilitar **Data API** en tu proyecto de MongoDB Atlas.
- La API Key debe tener acceso de lectura/escritura sobre tu base/colección.

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

## Recomendación de crecimiento

1. Añadir login (`/api/auth/login`) y sesión (cookies/JWT).
2. Incorporar middleware para proteger rutas privadas.
3. Integrar testing con Vitest + Testing Library.
