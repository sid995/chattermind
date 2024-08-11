import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: String,
  provider: String,
  providerAccountId: String,
  access_token: String,
  token_type: String,
  scope: String,
});

AccountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

export const Account =
  mongoose.models.Account || mongoose.model("Account", AccountSchema);
