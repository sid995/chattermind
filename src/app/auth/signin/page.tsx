import { checkIsAuthenticated } from "@/lib/auth/checkIsAuthenticated";
import { redirect } from "next/navigation";
import { SignInPage } from "./signin";
import { v4 as uuidv4 } from "uuid";

export default async function Page() {
  const isAuthenticated = await checkIsAuthenticated();

  if (isAuthenticated) {
    redirect(`/chat/${uuidv4()}`);
  } else {
    return <SignInPage />;
  }
}
