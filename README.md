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

1. Añadir capa de servicios (`src/services`) para llamadas HTTP.
2. Incorporar testing con Vitest + Testing Library.
3. Integrar un pipeline CI para lint, type-check y build.
