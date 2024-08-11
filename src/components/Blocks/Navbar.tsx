import { checkIsAuthenticated } from "@/lib/auth/checkIsAuthenticated";
import { SignInButton } from "../Button/SignInButton";
import { SignOutButton } from "../Button/SignoutButton";
import { NewChatButton } from "../Button/NewChatButton";

export default async function Navbar() {
  const isAuthenticated = await checkIsAuthenticated();

  return (
    <nav className="bg-white shadow-md w-full h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <NavbarIcon />
            <span className="ml-2 text-xl font-semibold text-gray-900">
              ChatterMind
            </span>
          </div>
          <div className="flex gap-2 items-center">
            {isAuthenticated && <NewChatButton />}
            <div>{isAuthenticated ? <SignOutButton /> : <SignInButton />}</div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavbarIcon() {
  return (
    <svg
      className="h-8 w-8 text-indigo-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
      />
    </svg>
  );
}
