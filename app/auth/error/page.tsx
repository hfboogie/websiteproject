"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function ErrorPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            There was an error during the authentication process. Please try again.
          </p>
        </div>
        <div className="mt-8 text-center">
          <a
            href="/auth/signin"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Return to sign in
          </a>
        </div>
      </div>
    </div>
  );
}
