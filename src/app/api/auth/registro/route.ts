import { NextResponse } from 'next/server';
import { conectarMongoDb } from '@/lib/mongodb';
import { ModeloUsuario } from '@/lib/modelos/usuario';
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

    await conectarMongoDb();

    const existeUsuario = await ModeloUsuario.findOne({ usuario }).lean();

    if (existeUsuario) {
      return NextResponse.json({ mensaje: 'Ese usuario ya existe.' }, { status: 409 });
    }

    const { hash, salt } = await crearHashContrasena(contrasena);

    await ModeloUsuario.create({
      usuario,
      contrasenaHash: hash,
      contrasenaSalt: salt
    });

    return NextResponse.json({ mensaje: 'Usuario registrado correctamente.' }, { status: 201 });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error inesperado';

    return NextResponse.json(
      {
        mensaje: 'No se pudo registrar el usuario. Verifica la configuración de MongoDB Atlas.',
        detalle: mensaje
      },
      { status: 500 }
    );
  }
}
