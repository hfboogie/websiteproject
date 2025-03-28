"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function NewUserPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Welcome to MTG Assistant!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your account has been successfully created.
          </p>
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Start exploring
          </Link>
        </div>
      </div>
    </div>
  );
}
