import { NextResponse } from 'next/server';
import { conectarMongoDb } from '@/lib/mongodb';
import { ModeloUsuario, UsuarioPersistido } from '@/lib/modelos/usuario';
import { crearHashContrasena } from '@/lib/seguridad';

const LONGITUD_MINIMA_NOMBRE = 4;
const LONGITUD_MINIMA_CONTRASENA = 8;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nombre = String(body?.nombre ?? '').trim().toLowerCase();
    const contrasena = String(body?.contrasena ?? '').trim();

    if (nombre.length < LONGITUD_MINIMA_NOMBRE) {
      return NextResponse.json(
        { mensaje: `El nombre debe tener mínimo ${LONGITUD_MINIMA_NOMBRE} caracteres.` },
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

    const existeUsuario = await ModeloUsuario.findOne({ nombre }).lean<UsuarioPersistido>().exec();

    if (existeUsuario) {
      return NextResponse.json({ mensaje: 'Ese nombre ya existe.' }, { status: 409 });
    }

    const hashEmpaquetado = await crearHashContrasena(contrasena);

    await ModeloUsuario.create({
      nombre,
      contrasena: hashEmpaquetado
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
