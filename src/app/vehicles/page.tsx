"use client";

import { useEffect, useState } from "react";
import { Vehicle } from "@/types/vehicle";
import VehicleInventory from "@/components/VehicleInventory/VehicleInventory";

export default function AllVehicles() {
  return (
    <div>
      <div className="bg-white rounded-3xl shadow-2xl max-w-7xl mx-auto p-4 mt-[-100px]">
        <div className="text-2xl text-center font-bold mb-10">
          <h1>INVENTORY</h1>
        </div>
        <VehicleInventory />
      </div>
    </div>
  );
}
