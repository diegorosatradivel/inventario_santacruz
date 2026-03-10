export const PILARES_BASE = [
  {
    titulo: 'Arquitectura por dominios',
    descripcion:
      'Separación clara entre app, componentes compartidos, features y utilidades para crecer sin deuda técnica.'
  },
  {
    titulo: 'Calidad desde el día uno',
    descripcion:
      'TypeScript estricto, ESLint y Prettier para mantener un código consistente y sostenible.'
  },
  {
    titulo: 'Escalabilidad',
    descripcion:
      'Estructura preparada para añadir estado global, API clients, testing y CI/CD sin reestructurar todo el proyecto.'
  }
] as const;
