"use client";

import Footer from "@/components/Footer/Footer";
import Hero from "@/components/Hero/Hero";
import Navbar from "@/components/Navbar/Navbar";
import { ReactNode } from "react";

export default function FormsLayout({ children }: { children: ReactNode }) {
  const links = [
    { href: "/", label: "Home" },
    { href: "/vehicles", label: "Inventory" },
    { href: "/forms/tradeappraisal", label: "Trade-in" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];
  return (
    <div className="min-h-screen">
      <Navbar items={links} />
      <Hero />
      <main className="mt-[-100px] bg-white rounded-3xl mx-15 shadow-2xl">
        {children}
      </main>
      <Footer />
    </div>
  );
}
