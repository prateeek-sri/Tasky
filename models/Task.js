import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
    },
    description: {
      type: String, // This will be stored as an AES encrypted string
      required: [true, "Please provide a description"],
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Search index
TaskSchema.index({ title: "text" });

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
