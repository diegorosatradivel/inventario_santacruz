import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);

export async function crearHashContrasena(contrasena: string) {
  const salt = randomBytes(16).toString('hex');
  const hashBuffer = (await scrypt(contrasena, salt, 64)) as Buffer;

  return {
    salt,
    hash: hashBuffer.toString('hex')
  };
}

export async function verificarContrasena({
  contrasena,
  salt,
  hashGuardado
}: {
  contrasena: string;
  salt: string;
  hashGuardado: string;
}) {
  const hashBuffer = (await scrypt(contrasena, salt, 64)) as Buffer;
  const hashActual = Buffer.from(hashBuffer.toString('hex'), 'hex');
  const hashOriginal = Buffer.from(hashGuardado, 'hex');

  if (hashActual.length !== hashOriginal.length) {
    return false;
  }

  return timingSafeEqual(hashActual, hashOriginal);
}
