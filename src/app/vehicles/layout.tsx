"use client";

import Hero from "@/components/Hero/Hero";
import Navbar from "@/components/Navbar/Navbar";
import { ReactNode } from "react";

export default function VehiclesLayout({ children }: { children: ReactNode }) {
  const links = [
    { href: "/", label: "Home" },
    { href: "/vehicles", label: "Inventory" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];
  return (
    <>
      <Navbar items={links} />
      <Hero />
      <div className="min-h-screen">
        <main className="">{children}</main>
      </div>
    </>
  );
}
