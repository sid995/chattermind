"use client";

import { Button } from "../ui/button";
import { handleSignOut } from "@/lib/auth/signOutServerAction";

export const SignOutButton = () => {
  return <Button onClick={() => handleSignOut()}>Sign Out</Button>;
};
