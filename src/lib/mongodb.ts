import mongoose from 'mongoose';

const uriMongoDb = process.env.MONGODB_URI;
const nombreBaseDatos = process.env.MONGODB_NOMBRE_BD;

type CacheMongoose = {
  conexion: typeof mongoose | null;
  promesa: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var cacheMongooseGlobal: CacheMongoose | undefined;
}

const cache = global.cacheMongooseGlobal ?? { conexion: null, promesa: null };

if (!global.cacheMongooseGlobal) {
  global.cacheMongooseGlobal = cache;
}

export async function conectarMongoDb() {
  if (!uriMongoDb) {
    throw new Error('Falta configurar la variable MONGODB_URI');
  }

  if (cache.conexion) {
    return cache.conexion;
  }

  if (!cache.promesa) {
    cache.promesa = mongoose.connect(uriMongoDb, {
      dbName: nombreBaseDatos
    });
  }

  cache.conexion = await cache.promesa;

  return cache.conexion;
}
