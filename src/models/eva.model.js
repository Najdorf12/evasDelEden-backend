import mongoose, { Schema } from "mongoose";

const evaSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    location: {
      type: String,
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
      extendDescription : { type : String},
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
  }
);

export default mongoose.model("Eva", evaSchema);
