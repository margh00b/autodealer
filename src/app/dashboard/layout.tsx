"use client";

import { SignedIn, UserButton } from "@clerk/nextjs";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="flex justify-end px-6 py-2">
        <SignedIn>
          <div className="bg-thinGrey border-2 border-gray-400 w-fit p-2 rounded-full shadow">
            <UserButton showName={true} />
          </div>
        </SignedIn>
      </header>
      <main className="mt-2">{children}</main>
    </div>
  );
}
