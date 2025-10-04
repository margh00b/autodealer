"use client";
import BrowseByBody from "@/components/BrowseByBody/BrowseByBody";
import Footer from "@/components/Footer/Footer";
import Hero from "@/components/Hero/Hero";
import LandingHero from "@/components/LandingHero/LandingHero";
import NavbarHome from "@/components/Navbar/NavbarHome";
import SearchBar from "@/components/SearchBar/SearchBar";
import { Filters } from "@/components/VehicleFilterbar/VehicleFilterbar";
import VehicleInventory from "@/components/VehicleInventory/VehicleInventory";
import ViewInventory from "@/components/ViewInventory/ViewInventory";
import { useState } from "react";

export default function Home() {
  const [filters, setFilters] = useState<Filters>({
    make: "",
    model: "",
    year: "",
    price: [0, 100000],
    bodyType: "",
    mileage: 0,
    engine: "",
    driveType: "",
    exteriorColor: "",
    interiorColor: "",
  });
  const links = [
    { href: "/", label: "Home" },
    { href: "/vehicles", label: "Inventory" },
    { href: "/forms/tradeappraisal", label: "Trade-in" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];
  return (
    <div>
      <NavbarHome items={links} />
      {/* <Hero /> */}
      <LandingHero />
      <SearchBar filters={filters} setFilters={setFilters} />
      <BrowseByBody filters={filters} setFilters={setFilters} />

      {/* <div
        id="inventory"
        className=" flex flex-col items-center bg-thinGrey mt-20 p-5"
      >
        <div className="text-2xl text-center font-bold mb-10">
          <h1>INVENTORY</h1>
        </div>
        <VehicleInventory numberOfListings={6} initialFilters={filters} />
      </div> */}

      <ViewInventory />
      <Footer />
    </div>
  );
}
