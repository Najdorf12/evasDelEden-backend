import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    eva: {
      type: Schema.Types.ObjectId,
      ref: "Eva",
      required: true,
      index: true,
    },
    name: { type: String, trim: true, maxlength: 60, default: "Anónimo" },
    text: { type: String, required: true, trim: true, maxlength: 500 },
    hidden: { type: Boolean, default: false }, // para que el admin pueda ocultar sin borrar
  },
  { timestamps: true },
);

export default mongoose.model("Comment", commentSchema);