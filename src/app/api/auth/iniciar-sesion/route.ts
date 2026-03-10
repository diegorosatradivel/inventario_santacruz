import { NextResponse } from 'next/server';
import { conectarMongoDb } from '@/lib/mongodb';
import { ModeloUsuario } from '@/lib/modelos/usuario';
import { verificarContrasena } from '@/lib/seguridad';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const usuario = String(body?.usuario ?? '').trim().toLowerCase();
    const contrasena = String(body?.contrasena ?? '').trim();

    if (!usuario || !contrasena) {
      return NextResponse.json({ mensaje: 'Usuario y contraseña son obligatorios.' }, { status: 400 });
    }

    await conectarMongoDb();

    const usuarioGuardado = await ModeloUsuario.findOne({ usuario }).lean();

    if (!usuarioGuardado) {
      return NextResponse.json({ mensaje: 'Credenciales inválidas.' }, { status: 401 });
    }

    const contrasenaValida = await verificarContrasena({
      contrasena,
      salt: String(usuarioGuardado.contrasenaSalt),
      hashGuardado: String(usuarioGuardado.contrasenaHash)
    });

    if (!contrasenaValida) {
      return NextResponse.json({ mensaje: 'Credenciales inválidas.' }, { status: 401 });
    }

    return NextResponse.json({ mensaje: 'Inicio de sesión correcto.' }, { status: 200 });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error inesperado';

    return NextResponse.json(
      {
        mensaje: 'No se pudo iniciar sesión. Verifica la configuración de MongoDB Atlas.',
        detalle: mensaje
      },
      { status: 500 }
    );
  }
}
