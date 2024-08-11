import { checkIsAuthenticated } from "@/lib/auth/checkIsAuthenticated";
import { redirect } from "next/navigation";
import { SignInPage } from "./signin";

export default async function Page() {
  const isAuthenticated = await checkIsAuthenticated();

  if (isAuthenticated) {
    redirect("/chat");
  } else {
    return <SignInPage />;
  }
}
