"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function SignOutPage() {
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  if (status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign out of your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Are you sure you want to sign out?
          </p>
        </div>
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={handleSignOut}
            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
          >
            Yes, sign me out
          </button>
          <Link
            href="/"
            className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-4 py-2 rounded-md text-sm font-medium"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
