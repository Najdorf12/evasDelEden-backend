import mongoose, { Schema } from "mongoose";

const modeloSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    eva: {
      type: Schema.Types.ObjectId,
      ref: "Eva",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Modelo", modeloSchema);