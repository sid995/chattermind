"use client";

import { GithubButton } from "@/components/Button/GithubButton";
import { Button } from "@/components/ui/button";
import {
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { handleGithubSignIn } from "@/lib/auth/githubSigninServerAction";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";

export const SignInPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="max-w-[350px]">
        <CardHeader>
          <CardTitle>Sign in to ChatterMind</CardTitle>
        </CardHeader>
        <CardContent>
          {/* <form action={signInWithCredentials} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form> */}
          <div className="mt-4">
            <GithubButton onClick={() => handleGithubSignIn()}>
              Sign in with GitHub
            </GithubButton>
          </div>
        </CardContent>
        <CardFooter>
          {/* <p className="text-sm text-center w-full">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-500 hover:underline">
              Register here
            </Link>
          </p> */}
        </CardFooter>
      </Card>
    </div>
  );
};
