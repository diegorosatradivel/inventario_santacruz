import { Model, Schema, model, models } from 'mongoose';

export type UsuarioPersistido = {
  usuario: string;
  contrasenaHash: string;
  contrasenaSalt: string;
  creadoEn?: Date;
  actualizadoEn?: Date;
};

const esquemaUsuario = new Schema<UsuarioPersistido>(
  {
    usuario: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    contrasenaHash: {
      type: String,
      required: true
    },
    contrasenaSalt: {
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
