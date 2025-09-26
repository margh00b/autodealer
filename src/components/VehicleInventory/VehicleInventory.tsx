// components/VehicleListing/VehicleListing.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { Vehicle } from "@/types/vehicle";
import VehicleCard from "../VehicleCard/VehicleCard";
import VehicleFilterbar, {
  Filters,
} from "../VehicleFilterbar/VehicleFilterbar";
import VehicleAppliedfilters from "../VehicleAppliedfilters/VehicleAppliedfilters";
import VehicleModal from "../VehicleModal/VehicalModal";

interface VehicleListingProps {
  initialFilters?: Filters;
  numberOfListings?: number;
}

export default function VehicleInventory({
  initialFilters,
  numberOfListings,
}: VehicleListingProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>(
    initialFilters ?? {
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
    }
  );
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Fetch vehicles when component mounts
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch("/api/vehicles/findAll");
        const data = await res.json();
        setVehicles(data);
      } catch (err) {
        console.error("Failed to fetch vehicles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // Filter vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const price = v.discounted_price ?? 0;

      if (filters.make && v.make?.name !== filters.make) return false;
      if (filters.model && v.model?.name !== filters.model) return false;
      if (filters.year && v.model_year.toString() !== filters.year)
        return false;
      if (price < filters.price[0]) return false;
      if (filters.price[1] !== 100000 && price > filters.price[1]) return false;
      if (filters.mileage && v.odometer > filters.mileage) return false;
      if (filters.bodyType && v.body_type !== filters.bodyType) return false;
      if (filters.engine && v.engine !== filters.engine) return false;
      if (filters.driveType && v.drive_type !== filters.driveType) return false;
      if (filters.exteriorColor && v.exterior_color !== filters.exteriorColor)
        return false;
      if (filters.interiorColor && v.interior_color !== filters.interiorColor)
        return false;

      return true;
    });
  }, [vehicles, filters]);

  const clearFilter = (key: keyof Filters) => {
    if (key === "price")
      setFilters((prev) => ({ ...prev, price: [0, 100000] }));
    else if (key === "mileage") setFilters((prev) => ({ ...prev, mileage: 0 }));
    else setFilters((prev) => ({ ...prev, [key]: "" }));
  };
  const vehiclesToShow = numberOfListings
    ? filteredVehicles.slice(0, numberOfListings)
    : filteredVehicles;

  if (loading) return <p>Loading vehicles...</p>;

  return (
    <div className="flex flex-col lg:flex-row gap-10">
      {/* Filter Sidebar */}
      <VehicleFilterbar
        filters={filters}
        onChange={setFilters}
        vehicles={vehicles}
      />

      {/* Vehicle Listing */}
      <div className="flex-1">
        <VehicleAppliedfilters filters={filters} onClear={clearFilter} />
        <p className="text-sm font-bold my-3">{`Total Listings: ${filteredVehicles.length} `}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {vehiclesToShow.length ? (
            vehiclesToShow.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onCheckAvailability={setSelectedVehicle}
              />
            ))
          ) : (
            <p>No vehicles found matching your filters.</p>
          )}
        </div>
      </div>

      {/* Vehicle Modal */}
      {selectedVehicle && (
        <VehicleModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}
    </div>
  );
}
