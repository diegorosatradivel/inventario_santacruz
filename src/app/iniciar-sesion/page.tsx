'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

type EstadoFormulario = {
  cargando: boolean;
  mensaje: string;
};

const estadoInicial: EstadoFormulario = {
  cargando: false,
  mensaje: ''
};

export default function IniciarSesionPage() {
  const [estado, setEstado] = useState<EstadoFormulario>(estadoInicial);
  const router = useRouter();

  async function manejarInicioSesion(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const formData = new FormData(evento.currentTarget);
    const nombre = String(formData.get('nombre') ?? '');
    const contrasena = String(formData.get('contrasena') ?? '');

    setEstado({ cargando: true, mensaje: '' });

    const respuesta = await fetch('/api/auth/iniciar-sesion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, contrasena })
    });

    const data = (await respuesta.json()) as { mensaje?: string };

    if (respuesta.ok) {
      router.push(`/sesion-iniciada?nombre=${encodeURIComponent(nombre)}`);
      return;
    }

    setEstado({
      cargando: false,
      mensaje: data.mensaje ?? 'No se pudo iniciar sesión.'
    });
  }

  return (
    <main className="contenedor" style={{ paddingBlock: '3rem' }}>
      <section style={{ maxWidth: 460, marginInline: 'auto', background: 'white', borderRadius: 16, padding: 24 }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: 8 }}>Iniciar sesión</h1>
        <p style={{ color: 'var(--texto-suave)', marginBottom: 20 }}>
          Inicia sesión con el nombre que hayas registrado previamente.
        </p>

        <form onSubmit={manejarInicioSesion} style={{ display: 'grid', gap: 12 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            Nombre
            <input name="nombre" minLength={4} required style={{ padding: '0.7rem', borderRadius: 10, border: '1px solid var(--borde)' }} />
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
            {estado.cargando ? 'Validando...' : 'Entrar'}
          </button>
        </form>

        {estado.mensaje ? <p style={{ marginTop: 12, color: '#b91c1c' }}>{estado.mensaje}</p> : null}
      </section>
    </main>
  );
}
