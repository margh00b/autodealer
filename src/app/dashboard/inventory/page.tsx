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
              className={`px-4 py-2 cursor-pointer rounded-full text-sm font-semibold transition 
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
        <div className="space-y-2">
          {filteredVehicles.map((v) => (
            <div
              key={v.id}
              className="flex justify-between items-center cursor-pointer bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition"
              onClick={() => setEditingVehicle(v)}
            >
              {/* Left: basic info */}
              <div className="flex flex-col gap-1 min-w-[180px]">
                <span className="font-semibold">
                  {v.make?.name} {v.model?.name}
                </span>
                <span className="text-xs text-gray-500">
                  {v.model_year} • Stock #{v.id}
                </span>
                {v.trim && (
                  <span className="text-xs text-gray-500">Trim: {v.trim}</span>
                )}
              </div>

              {/* Middle: stats */}
              <div className="flex flex-col gap-1 flex-grow">
                <span className="font-semibold text-blue-600">
                  {formatPrice(v.discounted_price)}
                </span>

                <div className="flex flex-wrap gap-2 text-xs text-gray-600 mt-1">
                  {v.odometer && (
                    <span>
                      <strong>Odometer:</strong> {formatOdometer(v.odometer)}
                    </span>
                  )}
                  {v.vin_number && (
                    <span>
                      <strong>VIN:</strong> {v.vin_number}
                    </span>
                  )}
                  {v.engine && (
                    <span>
                      <strong>Engine:</strong> {v.engine}
                    </span>
                  )}
                </div>
              </div>

              {/* Right: status + edit */}
              <div className="flex gap-15 items-center">
                <div className="w-24">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold block text-center ${
                      v.status === "AVAILABLE"
                        ? "bg-green-100 text-green-700"
                        : v.status === "RESERVED"
                        ? "bg-yellow-100 text-yellow-700"
                        : v.status === "SOLD"
                        ? "bg-red-100 text-red-700"
                        : v.status === "PENDING"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {v.status}
                  </span>
                </div>
                <button
                  onClick={() => setEditingVehicle(v)}
                  className="bg-maroon text-white text-xs px-6 py-3 rounded-full hover:bg-red transition cursor-pointer"
                >
                  Edit
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
