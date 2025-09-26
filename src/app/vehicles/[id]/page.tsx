"use client";

import Hero from "@/components/Hero/Hero";
import Navbar from "@/components/Navbar/Navbar";
import VehiclePricing from "@/components/VehicleListing/VehiclePricing/VehiclePricing";
import VehicleSummary from "@/components/VehicleListing/VehicleSummary/VehicleSummary";
import { notFound } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function VehicleDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await fetch(`/api/vehicles/${id}`, {
          cache: "no-store",
        });
        if (!res.ok) {
          // You could handle different error codes here
          return notFound();
        }
        const data = await res.json();
        setVehicle(data);
      } catch (error) {
        // Log the error for debugging, then show a not found page
        console.error("Failed to fetch vehicle:", error);
        return notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  if (loading) {
    return <div className="max-w-6xl mx-auto p-6">Loading...</div>;
  }

  if (!vehicle) {
    return notFound();
  }
  const pricing = {
    listedPrice: vehicle.listed_price,
    discountedPrice: vehicle.discounted_price,
  };
  return (
    <div>
      <Navbar />
      <Hero />
      <div className="flex w-3/4 mx-auto mt-[-70px]">
        <VehicleSummary vehicle={vehicle} />
        <VehiclePricing pricing={pricing} vehicle={vehicle} />
      </div>
    </div>
  );
}
