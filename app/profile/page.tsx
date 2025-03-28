"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/auth/signin");
    },
  });

  if (status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-start p-6 md:p-12 lg:p-24">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">User Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and preferences.</p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{session.user?.name || "Not provided"}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{session.user?.email}</dd>
              </div>
              {session.user?.image && (
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Profile image</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <img 
                      src={session.user.image} 
                      alt="Profile" 
                      className="h-20 w-20 rounded-full"
                    />
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Your Saved Decks</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <p className="text-gray-500">You don't have any saved decks yet.</p>
            <Link 
              href="/deck-builder" 
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create a Deck
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
