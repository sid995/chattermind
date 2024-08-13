"use client";

import { GithubButton } from "@/components/Button/GithubButton";
import {
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { handleGithubSignIn } from "@/lib/auth/githubSigninServerAction";

export const SignInPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="max-w-[350px]">
        <CardHeader>
          <CardTitle>Sign in to ChatterMind</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mt-4">
            <GithubButton onClick={() => handleGithubSignIn()}>
              Sign in with GitHub
            </GithubButton>
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
};
