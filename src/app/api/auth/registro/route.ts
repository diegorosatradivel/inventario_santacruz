import { NextResponse } from 'next/server';
import { buscarUsuarioPorNombre, crearUsuario } from '@/lib/mongo-atlas-api';
import { crearHashContrasena } from '@/lib/seguridad';

const LONGITUD_MINIMA_USUARIO = 4;
const LONGITUD_MINIMA_CONTRASENA = 8;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const usuario = String(body?.usuario ?? '').trim().toLowerCase();
    const contrasena = String(body?.contrasena ?? '').trim();

    if (usuario.length < LONGITUD_MINIMA_USUARIO) {
      return NextResponse.json(
        { mensaje: `El usuario debe tener mínimo ${LONGITUD_MINIMA_USUARIO} caracteres.` },
        { status: 400 }
      );
    }

    if (contrasena.length < LONGITUD_MINIMA_CONTRASENA) {
      return NextResponse.json(
        { mensaje: `La contraseña debe tener mínimo ${LONGITUD_MINIMA_CONTRASENA} caracteres.` },
        { status: 400 }
      );
    }

    const existente = await buscarUsuarioPorNombre(usuario);

    if (existente) {
      return NextResponse.json({ mensaje: 'Ese usuario ya existe.' }, { status: 409 });
    }

    const { hash, salt } = await crearHashContrasena(contrasena);
    await crearUsuario(usuario, hash, salt);

    return NextResponse.json({ mensaje: 'Usuario registrado correctamente.' }, { status: 201 });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error inesperado';

    return NextResponse.json(
      {
        mensaje:
          'No se pudo registrar el usuario. Verifica las variables de entorno de MongoDB Atlas Data API.',
        detalle: mensaje
      },
      { status: 500 }
    );
  }
}
