"use server";

import { signIn } from "@/lib/auth/authConfig";
import { v4 as uuidv4 } from "uuid";

export const handleGithubSignIn = async () => {
  try {
    await signIn("github", { redirectTo: `/chat/${uuidv4()}` });
  } catch (error) {
    throw error;
  }
};
