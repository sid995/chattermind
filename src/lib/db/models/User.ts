import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
      sparse: true, // This allows null values and maintains uniqueness for non-null values
    },
    emailVerified: Date,
    image: String,
    accounts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
      },
    ],
    sessions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
      },
    ],
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields
  }
);

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
