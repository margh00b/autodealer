"use client";

import Hero from "@/components/Hero/Hero";
import Navbar from "@/components/Navbar/Navbar";
import { ReactNode } from "react";

export default function VehiclesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <Hero />
      <div className="min-h-screen">
        <main className="">{children}</main>
      </div>
    </>
  );
}
