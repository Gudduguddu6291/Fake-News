import mongoose from "mongoose";
const historySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    verdict: {
      type: String,
      required: true,
    },

    confidence: {
      type: Number,
      required: true,
    },

    real_probability: Number,
    fake_probability: Number,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Response", historySchema);