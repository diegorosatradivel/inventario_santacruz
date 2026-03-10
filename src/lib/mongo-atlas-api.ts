const urlBaseAtlas = process.env.MONGODB_ATLAS_DATA_API_URL;
const apiKeyAtlas = process.env.MONGODB_ATLAS_DATA_API_KEY;
const baseDeDatosAtlas = process.env.MONGODB_ATLAS_DATABASE ?? 'inventario_santacruz';
const coleccionUsuarios = process.env.MONGODB_ATLAS_COLECCION_USUARIOS ?? 'usuarios';

function validarConfiguracionAtlas() {
  if (!urlBaseAtlas || !apiKeyAtlas) {
    throw new Error('Falta configurar MONGODB_ATLAS_DATA_API_URL o MONGODB_ATLAS_DATA_API_KEY');
  }
}

async function llamarAtlas<T>(accion: string, body: Record<string, unknown>): Promise<T> {
  validarConfiguracionAtlas();

  const respuesta = await fetch(`${urlBaseAtlas}/action/${accion}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKeyAtlas as string
    },
    body: JSON.stringify({
      dataSource: 'Cluster0',
      database: baseDeDatosAtlas,
      collection: coleccionUsuarios,
      ...body
    }),
    cache: 'no-store'
  });

  if (!respuesta.ok) {
    const errorTexto = await respuesta.text();
    throw new Error(`Error Atlas Data API (${respuesta.status}): ${errorTexto}`);
  }

  return respuesta.json() as Promise<T>;
}

type UsuarioAtlas = {
  usuario: string;
  contrasenaHash: string;
  contrasenaSalt: string;
  creadoEn: string;
};

export async function buscarUsuarioPorNombre(usuario: string) {
  const data = await llamarAtlas<{ document?: UsuarioAtlas }>('findOne', {
    filter: { usuario }
  });

  return data.document;
}

export async function crearUsuario(usuario: string, contrasenaHash: string, contrasenaSalt: string) {
  return llamarAtlas<{ insertedId: string }>('insertOne', {
    document: {
      usuario,
      contrasenaHash,
      contrasenaSalt,
      creadoEn: new Date().toISOString()
    }
  });
}
