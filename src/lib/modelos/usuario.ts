import { Model, Schema, model, models } from 'mongoose';

export type UsuarioPersistido = {
  nombre: string;
  contrasena: string;
  creadoEn?: Date;
  actualizadoEn?: Date;
};

const esquemaUsuario = new Schema<UsuarioPersistido>(
  {
    nombre: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    contrasena: {
      type: String,
      required: true
    }
  },
  {
    timestamps: { createdAt: 'creadoEn', updatedAt: 'actualizadoEn' },
    versionKey: false
  }
);

export const ModeloUsuario: Model<UsuarioPersistido> =
  (models.Usuario as Model<UsuarioPersistido> | undefined) || model<UsuarioPersistido>('Usuario', esquemaUsuario);
