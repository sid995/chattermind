"use server";

import { signIn } from "@/lib/auth/authConfig";

export const handleGithubSignIn = async () => {
  try {
    await signIn("github", { redirectTo: "/chat" });
  } catch (error) {
    throw error;
  }
};
