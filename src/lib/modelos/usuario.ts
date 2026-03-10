import { Schema, model, models } from 'mongoose';

const esquemaUsuario = new Schema(
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

export const ModeloUsuario = models.Usuario || model('Usuario', esquemaUsuario);
