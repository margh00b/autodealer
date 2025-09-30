"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Lead = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  lead_status: "NEW" | "CONTACTED" | "CONVERTED" | "LOST";
  createdAt: string;
  vehicle: {
    model_year: number;
    make: { name: string };
    model: { name: string };
  };
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<{ vehicleAvailability: Lead[] } | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      const res = await fetch("/api/leads");
      const data = await res.json();
      setLeads(data);
      setLoading(false);
    };
    fetchLeads();
  }, []);

  const updatelead_status = async (
    leadId: number,
    newStatus: Lead["lead_status"]
  ) => {
    if (!leads) return;

    // Optimistic UI update
    const updatedLeads = leads.vehicleAvailability.map((l) =>
      l.id === leadId ? { ...l, lead_status: newStatus } : l
    );
    setLeads({ ...leads, vehicleAvailability: updatedLeads });

    try {
      const res = await fetch("/api/leads/updateStatus", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      toast.success(`Lead status updated to "${newStatus}"`);
    } catch (error) {
      console.error(error);

      // Revert UI if failed
      const revertedLeads = leads.vehicleAvailability.map((l) =>
        l.id === leadId ? { ...l, lead_status: l.lead_status } : l
      );
      setLeads({ ...leads, vehicleAvailability: revertedLeads });

      toast.error("Failed to update lead status. Try again.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading leads...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Leads</h1>

      {/* Vehicle Availability Leads */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          Vehicle Availability
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-sm tracking-wider">
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Vehicle</th>
                <th className="px-4 py-3 text-left">Created</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {leads?.vehicleAvailability.map((lead, idx) => (
                <tr
                  key={lead.id}
                  className={`${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100 transition`}
                >
                  <td className="px-4 py-3">
                    {lead.firstName} {lead.lastName}
                  </td>
                  <td className="px-4 py-3">{lead.email}</td>
                  <td className="px-4 py-3">{lead.phone}</td>
                  <td className="px-4 py-3">
                    {lead.vehicle.model_year} {lead.vehicle.make.name}{" "}
                    {lead.vehicle.model.name}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={lead.lead_status}
                      onChange={(e) =>
                        updatelead_status(
                          lead.id,
                          e.target.value as Lead["lead_status"]
                        )
                      }
                      className="border rounded px-3 py-1 text-sm text-gray-700  cursor-pointer"
                    >
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="CONVERTED">CONVERTED</option>
                      <option value="LOST">LOST</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
