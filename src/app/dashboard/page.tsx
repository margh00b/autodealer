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
  AVAILABLE: "#7f1d1d",
  RESERVED: "#6b7280",
  SOLD: "#b91c1c",
  PENDING: "#fbbf24",
  UNAVAILABLE: "#374151",
};

type StatusCount = { status: string; count: number };

type LeadStatus = "NEW" | "CONTACTED" | "CONVERTED" | "LOST";

export default function DashboardPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [leads, setLeads] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // --- Fetch data ---
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [vehiclesRes, leadsRes] = await Promise.all([
        fetch("/api/dashboard/findAllListings"),
        fetch("/api/leads"),
      ]);

      if (!vehiclesRes.ok || !leadsRes.ok)
        throw new Error("Failed to fetch dashboard data");

      const [vehiclesData, leadsData] = await Promise.all([
        vehiclesRes.json(),
        leadsRes.json(),
      ]);

      setVehicles(vehiclesData);
      setLeads(leadsData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // --- Vehicle Stats ---
  const vehiclesByStatus: StatusCount[] = Object.values(VehicleStatus).map(
    (status) => ({
      status,
      count: vehicles.filter((v) => v.status === status).length,
    })
  );

  const totalVehicles = vehicles.length;

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

  // --- Lead Stats ---
  const totalLeads = leads
    ? leads.vehicleAvailability.length +
      leads.tradeAppraisals.length +
      leads.financingForms.length
    : 0;

  const leadCategoryCounts = leads
    ? [
        {
          name: "Vehicle Availability",
          count: leads.vehicleAvailability.length,
        },
        { name: "Trade Appraisals", count: leads.tradeAppraisals.length },
        { name: "Financing Forms", count: leads.financingForms.length },
      ]
    : [];

  const allLeads = leads
    ? [
        ...leads.vehicleAvailability,
        ...leads.tradeAppraisals,
        ...leads.financingForms,
      ]
    : [];

  const leadsByStatus: { status: LeadStatus; count: number }[] = (
    ["NEW", "CONTACTED", "CONVERTED", "LOST"] as LeadStatus[]
  ).map((status) => ({
    status,
    count: allLeads.filter((l) => l.lead_status === status).length,
  }));

  const leadStatusColors: Record<LeadStatus, string> = {
    NEW: "#7f1d1d",
    CONTACTED: "#f59e0b",
    CONVERTED: "#15803d",
    LOST: "#9ca3af",
  };

  // --- Render ---
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <h1 className="text-4xl font-extrabold tracking-tight">Dashboard</h1>

      {loading ? (
        <div className="p-8 max-w-7xl mx-auto text-gray-600">
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="w-10 h-10 border-4 border-maroon border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 font-medium">Preparing your dashboard...</p>
          </div>

          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-64 bg-gray-200 rounded-2xl"></div>
              <div className="h-64 bg-gray-200 rounded-2xl"></div>
            </div>
            <div className="h-80 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {/* ========== Inventory Section ========== */}
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
                    <span>{totalVehicles}</span>
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
            <div className="bg-white shadow-lg rounded-2xl border border-gray-200 hover:shadow-xl transition">
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
                      label
                      labelLine={false}
                    >
                      {vehiclesByStatus.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={statusColors[entry.status as VehicleStatus]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ========== Lead Insights Section ========== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Lead Overview */}
            <div className="bg-white shadow-lg rounded-2xl border border-gray-200 hover:shadow-xl transition">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">
                  Lead Overview
                </h2>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex justify-between font-bold text-gray-800 pb-2 border-b">
                    <span>Total Leads</span>
                    <span>{totalLeads}</span>
                  </li>
                  {leadCategoryCounts.map((cat) => (
                    <li
                      key={cat.name}
                      className="flex justify-between items-center text-gray-700 border-b pb-2 last:border-none"
                    >
                      <span>{cat.name}</span>
                      <span className="px-3 py-0.5 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">
                        {cat.count}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Leads by Status Pie */}
            <div className="bg-white shadow-lg rounded-2xl border border-gray-200 hover:shadow-xl transition">
              <div className="px-4 py-3">
                <h2 className="text-lg font-bold">Leads by Status</h2>
              </div>
              <div className="p-4 h-72 border-t border-gray-100">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leadsByStatus}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                      labelLine={false}
                    >
                      {leadsByStatus.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={leadStatusColors[entry.status as LeadStatus]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ========== Top Models Chart ========== */}
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
