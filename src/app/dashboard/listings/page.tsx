"use client";

import VehicleEditModal from "@/components/VehicleEditModal/VehicleEditModal";
import { Vehicle } from "@/types/vehicle";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

export default function DashboardListings() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/findAllListings");
      if (!res.ok) throw new Error("Failed to fetch vehicles");
      const data = await res.json();
      setVehicles(data);
    } catch (err: any) {
      toast.error(err.message);
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
          ([, value]) => value !== undefined && value !== null
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
    } catch (err: any) {
      toast.error(err.message);
      throw err;
    }
  };

  const formatPrice = (value?: number) =>
    value ? `$${value.toLocaleString()}` : "-";
  const formatOdometer = (value?: number) =>
    value ? `${value.toLocaleString()} km` : "-";
  const formatFuel = (value?: number) =>
    value ? `${value.toFixed(1)} L/100km` : "-";

  return (
    <div className="p-6 max-w-full mx-auto">
      <h1 className="text-3xl font-bold mb-6">Vehicle Listings</h1>

      {loading ? (
        <p>Loading vehicles...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="bg-white border rounded-lg shadow hover:shadow-lg transition duration-200 flex flex-col"
            >
              <div className="p-4 flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    #{v.id}
                    <h2 className="text-xl font-semibold leading-tight">
                      {v.make?.name || "Unknown Make"}{" "}
                      {v.model?.name || "Unknown Model"}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {v.model_year} • {v.trim}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      v.status === "AVAILABLE"
                        ? "bg-green-100 text-green-800"
                        : v.status === "RESERVED"
                        ? "bg-yellow-100 text-yellow-800"
                        : v.status === "SOLD"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {v.status}
                  </span>
                </div>

                <p className="text-2xl font-bold my-2 text-blue-600">
                  {formatPrice(v.discounted_price)}
                </p>
                <p className="text-sm text-gray-400 line-through">
                  {formatPrice(v.listed_price)}
                </p>

                <div className="mt-3 space-y-1 text-sm text-gray-600">
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
                    <strong>Fuel Econ:</strong> {formatFuel(v.combined_fuel)}
                  </p>
                  <p>
                    <strong>Images:</strong> {v.images?.length}
                  </p>
                </div>
              </div>

              <div className="p-4 border-t">
                <button
                  onClick={() => setEditingVehicle(v)}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
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
