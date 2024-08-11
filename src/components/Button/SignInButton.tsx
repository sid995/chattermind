"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export const SignInButton = () => {
  const router = useRouter();

  return <Button onClick={() => router.push("/auth/signin")}>Sign In</Button>;
};
