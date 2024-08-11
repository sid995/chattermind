import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sessionToken: { type: String, unique: true },
  expires: Date,
});

export const Session =
  mongoose.models.Session || mongoose.model("Session", SessionSchema);
