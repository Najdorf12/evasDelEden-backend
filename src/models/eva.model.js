import mongoose, { Schema } from "mongoose";

const evaSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    detailLocation: {
      province: { type: String },
      region: { type: String },
      city: { type: String },
    },
    isActive: {
      type: Boolean,
    },
    category: {
      type: String,
    },
    wttp: {
      type: String,
      unique: true,
    },
    description: {
      edad: { type: String },
      altura: { type: String },
      peso: { type: String },
      medidas: { type: String },
      depilacion: { type: String },
      servicio: { type: String },
      horario: { type: String },
      extendDescription: { type: String },
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Modelo",
      default: null,
    },
    status: {
      type: String,
      enum: ["approved", "pending"],
      default: "approved", // lo que carga el admin entra directo; lo que carguen ellas, no
    },
    images: [
      {
        public_id: { type: String },
        secure_url: { type: String },
      },
    ],
    videos: [
      {
        public_id: { type: String },
        secure_url: { type: String },
      },
    ],
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Eva", evaSchema);
