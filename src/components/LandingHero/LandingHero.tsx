"use client";

import Image from "next/image";
import Link from "next/link";

export default function LandingHero() {
  return (
    <section className="relative h-[90vh] flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-24 bg-white text-gray-900 overflow-hidden">
      {/* Hero Text */}
      <div className="z-10 flex-1 space-y-6 text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-red-600">
          Find your <span className="text-red-800">dream car</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto md:mx-0">
          Explore the best deals and financing options tailored for you. Drive
          away in your perfect car today.
        </p>

        <Link
          href="/vehicles"
          className="mt-4 px-6 py-3 bg-red text-white font-semibold rounded-lg shadow-md hover:bg-maroon transition-all"
        >
          View Inventory
        </Link>
      </div>

      {/* Fixed Car Image */}
      <div className="absolute top-0 right-0 w-[60%] md:w-[50%] lg:w-[45%] pointer-events-none select-none">
        <Image
          src="/car.png"
          alt="Car illustration"
          width={1200}
          height={800}
          className="w-full h-full object-contain"
          priority
        />
      </div>
    </section>
  );
}
