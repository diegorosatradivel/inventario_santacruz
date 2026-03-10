type PropsBotonPrimario = {
  etiqueta: string;
};

export function BotonPrimario({ etiqueta }: PropsBotonPrimario) {
  return (
    <button
      type="button"
      style={{
        border: 'none',
        borderRadius: '0.75rem',
        padding: '0.75rem 1rem',
        background: 'var(--primario)',
        color: 'white',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'background 150ms ease'
      }}
      onMouseEnter={(evento) => {
        evento.currentTarget.style.background = 'var(--primario-oscuro)';
      }}
      onMouseLeave={(evento) => {
        evento.currentTarget.style.background = 'var(--primario)';
      }}
    >
      {etiqueta}
    </button>
  );
}
