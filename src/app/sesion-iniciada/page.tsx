export default function SesionIniciadaPage({
  searchParams
}: {
  searchParams: { usuario?: string };
}) {
  const usuario = searchParams.usuario ?? 'usuario';

  return (
    <main className="contenedor" style={{ paddingBlock: '3rem' }}>
      <section style={{ maxWidth: 560, marginInline: 'auto', background: 'white', borderRadius: 16, padding: 24 }}>
        <h1 style={{ fontSize: '2rem', color: '#166534', marginBottom: 8 }}>✅ Inicio de sesión correcto</h1>
        <p style={{ color: 'var(--texto-suave)', marginBottom: 16 }}>
          Has iniciado sesión correctamente como <strong>{usuario}</strong>.
        </p>
        <a
          href="/"
          style={{
            display: 'inline-block',
            borderRadius: '0.75rem',
            padding: '0.75rem 1rem',
            background: 'var(--primario)',
            color: 'white',
            fontWeight: 600
          }}
        >
          Volver al inicio
        </a>
      </section>
    </main>
  );
}
