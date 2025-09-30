"use client";

import { Vehicle } from "@/types/vehicle";
import { useEffect, useState, useCallback } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { toast } from "sonner";

enum VehicleStatus {
  AVAILABLE = "AVAILABLE",
  RESERVED = "RESERVED",
  SOLD = "SOLD",
  PENDING = "PENDING",
  UNAVAILABLE = "UNAVAILABLE",
}

const statusColors: Record<VehicleStatus, string> = {
  AVAILABLE: "#7f1d1d", // deep maroon
  RESERVED: "#6b7280", // medium gray
  SOLD: "#b91c1c", // brighter red-maroon
  PENDING: "#fbbf24", // golden
  UNAVAILABLE: "#374151", // dark gray-blue
};

type StatusCount = {
  status: string;
  count: number;
};

export default function DashboardPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/findAllListings");
      if (!res.ok) throw new Error("Failed to fetch vehicles");
      const data = await res.json();
      setVehicles(data);
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const vehiclesByStatus: StatusCount[] = Object.values(VehicleStatus).map(
    (status) => ({
      status,
      count: vehicles.filter((v) => v.status === status).length,
    })
  );

  const total = vehicles.length;

  // Top 5 models by count
  const modelCounts = Object.entries(
    vehicles.reduce((acc: Record<string, number>, v) => {
      const makeName = v.make?.name ?? "Unknown Make";
      const modelName = v.model?.name ?? "Unknown Model";
      const key = `${makeName} ${modelName}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([model, count]) => ({ model, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 ">
      <h1 className="text-4xl font-extrabold tracking-tight">Dashboard</h1>

      {loading ? (
        <p className="text-gray-500">Loading dashboard...</p>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Inventory Overview */}
            <div className="bg-white shadow-lg rounded-2xl border border-gray-200 hover:shadow-xl transition">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">
                  Inventory Overview
                </h2>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex justify-between font-bold text-gray-800 pb-2 border-b">
                    <span>Total Vehicles</span>
                    <span>{total}</span>
                  </li>
                  {vehiclesByStatus.map((item) => (
                    <li
                      key={item.status}
                      className="flex justify-between items-center text-gray-700 border-b pb-2 last:border-none"
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-gray-300"
                          style={{
                            backgroundColor:
                              statusColors[item.status as VehicleStatus],
                          }}
                        />
                        <span className="font-medium">{item.status}</span>
                      </span>
                      <span className="px-3 py-0.5 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">
                        {item.count}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Inventory Pie */}
            <div className="bg-white  shadow-lg rounded-2xl border border-gray-200 hover:shadow-xl transition">
              <div className="px-4 py-3">
                <h2 className="text-lg font-bold">Inventory by Status</h2>
              </div>
              <div className="p-4 h-72 border-t border-gray-100">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={vehiclesByStatus}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      legendType="circle"
                      label={{
                        position: "middle",
                        fill: "#fff",
                        fontSize: 10,
                      }}
                      labelLine={false}
                    >
                      {vehiclesByStatus.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={statusColors[entry.status as VehicleStatus]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Additional Insights: Top Models */}
          <div className="bg-white shadow-lg rounded-2xl border border-gray-200 hover:shadow-xl transition">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">
                Top 5 Popular Models
              </h2>
            </div>
            <div className="p-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={modelCounts}
                  margin={{ top: 20, right: 30, left: 0, bottom: 50 }}
                  barSize={40}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="model"
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-35}
                    textAnchor="end"
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#7f1d1d" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
