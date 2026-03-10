type PropsTarjetaResumen = {
  titulo: string;
  descripcion: string;
};

export function TarjetaResumen({ titulo, descripcion }: PropsTarjetaResumen) {
  return (
    <article
      style={{
        background: 'var(--superficie)',
        border: '1px solid var(--borde)',
        borderRadius: '1rem',
        padding: '1.25rem',
        boxShadow: '0 8px 20px rgb(15 23 42 / 0.04)'
      }}
    >
      <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{titulo}</h3>
      <p style={{ color: 'var(--texto-suave)' }}>{descripcion}</p>
    </article>
  );
}
