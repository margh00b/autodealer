"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/Hero/Hero";
import { Vehicle } from "@/types/vehicle";
import VehicleInventory from "@/components/VehicleInventory/VehicleInventory";

export default function AllVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const res = await fetch("/api/vehicles/findAll");
        const data = await res.json();
        setVehicles(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchVehicles();
  }, []);

  if (loading) return <p>Loading vehicles...</p>;

  return (
    <div>
      <Navbar />
      <Hero />
      <div className="bg-white rounded-3xl shadow-2xl max-w-7xl mx-auto p-4 mt-[-100px] ">
        <div className="text-2xl text-center font-bold mb-10">
          <h1>INVENTORY</h1>
        </div>
        <VehicleInventory />
      </div>
    </div>
  );
}
