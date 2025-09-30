"use client";

import Hero from "@/components/Hero/Hero";
import Navbar from "@/components/Navbar/Navbar";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/inventory", label: "Inventory" },
    { href: "/leads", label: "Leads" },
    { href: "/testdrives", label: "Test Drives" },
  ];
  return (
    <div className="min-h-screen">
      <Navbar items={links} />
      <Hero />
      <header className="absolute z-99 top-0 right-0 flex justify-end px-6 py-2">
        <SignedIn>
          <div className="bg-thinGrey border-2 border-gray-400 w-fit p-2 rounded-full shadow">
            <UserButton showName={true} />
          </div>
        </SignedIn>
      </header>

      <main className="mt-[-100px] bg-white rounded-3xl mx-15 shadow-2xl">
        {children}
      </main>
    </div>
  );
}
