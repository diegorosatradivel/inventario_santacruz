import { TarjetaResumen } from '@/features/inicio/components/tarjeta-resumen';
import { PILARES_BASE } from '@/features/inicio/constantes/pilares';
import { obtenerAnioActual } from '@/lib/utilidades';

export default function HomePage() {
  return (
    <main className="contenedor" style={{ paddingBlock: '3rem' }}>
      <section
        style={{
          display: 'grid',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <span style={{ fontSize: '0.875rem', color: 'var(--texto-suave)', fontWeight: 600 }}>
          BASE INICIAL NEXT.JS
        </span>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', lineHeight: 1.15 }}>
          Plantilla profesional para arrancar con una base sólida
        </h1>
        <p style={{ color: 'var(--texto-suave)', maxWidth: '65ch' }}>
          Proyecto preparado para crecer por módulos y mantener buenas prácticas desde el inicio.
        </p>
        <div>
          <a
            href="/registro"
            style={{
              display: 'inline-block',
              borderRadius: '0.75rem',
              padding: '0.75rem 1rem',
              background: 'var(--primario)',
              color: 'white',
              fontWeight: 600
            }}
          >
            Ir al registro
          </a>
        </div>
      </section>

      <section
        style={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          marginBottom: '2rem'
        }}
      >
        {PILARES_BASE.map((pilar) => (
          <TarjetaResumen key={pilar.titulo} titulo={pilar.titulo} descripcion={pilar.descripcion} />
        ))}
      </section>

      <footer style={{ color: 'var(--texto-suave)', fontSize: '0.9rem' }}>
        © {obtenerAnioActual()} Inventario SantaCruz · Arquitectura base lista
      </footer>
    </main>
  );
}
