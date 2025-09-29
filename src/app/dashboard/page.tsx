"use client";

import VehicleEditModal from "@/components/VehicleEditModal/VehicleEditModal";
import { Vehicle } from "@/types/vehicle";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

enum VehicleStatus {
  AVAILABLE = "AVAILABLE",
  RESERVED = "RESERVED",
  SOLD = "SOLD",
  PENDING = "PENDING",
  UNAVAILABLE = "UNAVAILABLE",
}

const statusColors: Record<string, string> = {
  ALL: "bg-gray-200 text-gray-800",
  AVAILABLE: "bg-green-100 text-green-700",
  RESERVED: "bg-yellow-100 text-yellow-700",
  SOLD: "bg-red-100 text-red-700",
  PENDING: "bg-blue-100 text-blue-700",
  UNAVAILABLE: "bg-gray-100 text-gray-700",
};

export default function DashboardListings() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [activeStatus, setActiveStatus] = useState<"ALL" | VehicleStatus>(
    "ALL"
  );

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/findAllListings");
      if (!res.ok) throw new Error("Failed to fetch vehicles");
      const data = await res.json();
      setVehicles(data);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleSave = async (id: number, editedData: Partial<Vehicle>) => {
    try {
      const {
        id: _id,
        make,
        model,
        images,
        availabilityForms,
        ...updateData
      } = editedData;

      const filteredUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(
          ([_, value]) => value !== undefined && value !== null
        )
      );

      const res = await fetch(`/api/dashboard/updateVehicle/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filteredUpdateData),
      });

      if (!res.ok) throw new Error("Failed to update vehicle");
      const updated = await res.json();
      setVehicles((prev) => prev.map((v) => (v.id === id ? updated : v)));
      setEditingVehicle(null);
      toast.success("Vehicle updated successfully! 🎉");
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unknown error occurred");
      }
      throw err;
    }
  };

  const formatPrice = (value?: number) =>
    value ? `$${value.toLocaleString()}` : "-";
  const formatOdometer = (value?: number) =>
    value ? `${value.toLocaleString()} km` : "-";
  const formatFuel = (value?: number) =>
    value ? `${value.toFixed(1)} L/100km` : "-";

  // Group vehicles by status
  const vehiclesByStatus = Object.values(VehicleStatus).reduce(
    (acc, status) => {
      acc[status] = vehicles.filter((v) => v.status === status);
      return acc;
    },
    {} as Record<VehicleStatus, Vehicle[]>
  );

  const filteredVehicles =
    activeStatus === "ALL" ? vehicles : vehiclesByStatus[activeStatus] || [];

  return (
    <div className="p-6 max-w-full mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold ">Dealer Dashboard</h1>
        <Link
          href="/dashboard/create"
          className="inline-flex items-center gap-2 bg-maroon hover:bg-red text-white px-5 py-2.5 rounded-lg font-semibold shadow transition"
        >
          <span className="text-lg">+</span> Create Vehicle
        </Link>
      </div>
      {/* Status Pills */}
      <div className="flex flex-wrap gap-3 mb-8">
        {["ALL", ...Object.values(VehicleStatus)].map((status) => {
          const count =
            status === "ALL"
              ? vehicles.length
              : vehiclesByStatus[status as VehicleStatus]?.length || 0;

          return (
            <button
              key={status}
              onClick={() => setActiveStatus(status as "ALL" | VehicleStatus)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition 
                ${
                  activeStatus === status
                    ? `${statusColors[status]} ring-2 ring-offset-2 ring-blue-400`
                    : `${statusColors[status]} hover:opacity-80`
                }`}
            >
              {status} ({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <p>Loading vehicles...</p>
      ) : filteredVehicles.length === 0 ? (
        <p className="text-gray-500">No vehicles found for {activeStatus}.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredVehicles.map((v) => (
            <div
              key={v.id}
              className="bg-white border rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 hover:scale-[1.02] flex flex-col overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={"/car-placeholder.png"}
                  alt={`${v.make?.name} ${v.model?.name}`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                {/* Status badge */}
                <span
                  className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold rounded-full ${
                    v.status === "AVAILABLE"
                      ? "bg-green-600 text-white"
                      : v.status === "RESERVED"
                      ? "bg-yellow-500 text-white"
                      : v.status === "SOLD"
                      ? "bg-red-600 text-white"
                      : "bg-gray-400 text-white"
                  }`}
                >
                  {v.status}
                </span>
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold">
                  {v.make?.name} {v.model?.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {v.model_year} • {v.trim}
                </p>

                <p className="text-2xl font-bold text-blue-600 mb-1">
                  {formatPrice(v.discounted_price)}
                </p>
                <p className="text-sm text-gray-400 line-through mb-3">
                  {formatPrice(v.listed_price)}
                </p>

                <div className="mt-auto space-y-1 text-sm text-gray-600">
                  <p>
                    <strong>Odometer:</strong> {formatOdometer(v.odometer)}
                  </p>
                  <p>
                    <strong>VIN:</strong> {v.vin_number}
                  </p>
                  <p>
                    <strong>Engine:</strong> {v.engine || "N/A"}
                  </p>
                  <p>
                    <strong>Fuel:</strong> {formatFuel(v.combined_fuel)}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 border-t">
                <button
                  onClick={() => setEditingVehicle(v)}
                  className="w-full bg-maroon text-white py-2 rounded-lg font-semibold hover:bg-red transition"
                >
                  View / Edit Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingVehicle && (
        <VehicleEditModal
          vehicle={editingVehicle}
          onSave={handleSave}
          onClose={() => setEditingVehicle(null)}
        />
      )}
    </div>
  );
}
