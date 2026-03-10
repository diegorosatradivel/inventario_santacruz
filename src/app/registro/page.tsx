'use client';

import { FormEvent, useState } from 'react';

type EstadoFormulario = {
  cargando: boolean;
  mensaje: string;
  exito: boolean;
};

const estadoInicial: EstadoFormulario = {
  cargando: false,
  mensaje: '',
  exito: false
};

export default function RegistroPage() {
  const [estado, setEstado] = useState<EstadoFormulario>(estadoInicial);

  async function manejarRegistro(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const formData = new FormData(evento.currentTarget);
    const usuario = String(formData.get('usuario') ?? '');
    const contrasena = String(formData.get('contrasena') ?? '');

    setEstado({ cargando: true, mensaje: '', exito: false });

    const respuesta = await fetch('/api/auth/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, contrasena })
    });

    const data = (await respuesta.json()) as { mensaje?: string };

    setEstado({
      cargando: false,
      mensaje: data.mensaje ?? 'No se pudo completar el registro.',
      exito: respuesta.ok
    });

    if (respuesta.ok) {
      evento.currentTarget.reset();
    }
  }

  return (
    <main className="contenedor" style={{ paddingBlock: '3rem' }}>
      <section style={{ maxWidth: 460, marginInline: 'auto', background: 'white', borderRadius: 16, padding: 24 }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: 8 }}>Registro de usuario</h1>
        <p style={{ color: 'var(--texto-suave)', marginBottom: 20 }}>
          Crea tu cuenta con usuario y contraseña. El registro se guardará en MongoDB Atlas.
        </p>

        <form onSubmit={manejarRegistro} style={{ display: 'grid', gap: 12 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            Usuario
            <input name="usuario" minLength={4} required style={{ padding: '0.7rem', borderRadius: 10, border: '1px solid var(--borde)' }} />
          </label>

          <label style={{ display: 'grid', gap: 6 }}>
            Contraseña
            <input
              type="password"
              name="contrasena"
              minLength={8}
              required
              style={{ padding: '0.7rem', borderRadius: 10, border: '1px solid var(--borde)' }}
            />
          </label>

          <button
            type="submit"
            disabled={estado.cargando}
            style={{
              border: 'none',
              borderRadius: '0.75rem',
              padding: '0.75rem 1rem',
              background: 'var(--primario)',
              color: 'white',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {estado.cargando ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>

        {estado.mensaje ? (
          <p style={{ marginTop: 12, color: estado.exito ? '#166534' : '#b91c1c' }}>{estado.mensaje}</p>
        ) : null}
      </section>
    </main>
  );
}
