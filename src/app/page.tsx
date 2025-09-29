"use client";
import BrowseByBody from "@/components/BrowseByBody/BrowseByBody";
import Footer from "@/components/Footer/Footer";
import Hero from "@/components/Hero/Hero";
import Navbar from "@/components/Navbar/Navbar";
import SearchBar from "@/components/SearchBar/SearchBar";
import { Filters } from "@/components/VehicleFilterbar/VehicleFilterbar";
import VehicleInventory from "@/components/VehicleInventory/VehicleInventory";
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
  return (
    <div>
      <Navbar />
      <Hero />
      <SearchBar filters={filters} setFilters={setFilters} />
      <BrowseByBody />
      <div
        id="inventory"
        className=" flex flex-col items-center bg-thinGrey my-20 p-5"
      >
        <div className="text-2xl text-center font-bold mb-10">
          <h1>INVENTORY</h1>
        </div>
        <VehicleInventory numberOfListings={6} initialFilters={filters} />
      </div>
      <Footer />
    </div>
  );
}
