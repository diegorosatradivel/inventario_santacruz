import { NextResponse } from 'next/server';
import { conectarMongoDb } from '@/lib/mongodb';
import { ModeloUsuario, UsuarioPersistido } from '@/lib/modelos/usuario';
import { verificarContrasena } from '@/lib/seguridad';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nombre = String(body?.nombre ?? '').trim().toLowerCase();
    const contrasena = String(body?.contrasena ?? '').trim();

    if (!nombre || !contrasena) {
      return NextResponse.json({ mensaje: 'Nombre y contraseña son obligatorios.' }, { status: 400 });
    }

    await conectarMongoDb();

    const usuarioGuardado = await ModeloUsuario.findOne({ nombre }).lean<UsuarioPersistido>().exec();

    if (!usuarioGuardado) {
      return NextResponse.json({ mensaje: 'Credenciales inválidas.' }, { status: 401 });
    }

    const contrasenaValida = await verificarContrasena({
      contrasena,
      hashEmpaquetado: String(usuarioGuardado.contrasena)
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
