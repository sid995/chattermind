"use server";

import { redirect } from "next/navigation";
import { signOut } from "./authConfig";

export const handleSignOut = async () => {
  try {
    await signOut();
    redirect("/auth/sign-in");
  } catch (error) {
    throw error;
  }
};
