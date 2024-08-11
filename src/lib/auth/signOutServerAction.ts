"use server";

import { redirect } from "next/navigation";
import { signOut } from "./authConfig";

export const handleSignOut = async () => {
  console.log("Sign out initiated");
  try {
    await signOut();
    console.log("Sign out successful, redirecting...");
    redirect("/auth/sign-in");
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
};
