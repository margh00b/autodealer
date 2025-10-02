"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type VehicleLead = {
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

type TradeAppraisal = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  make: string;
  model: string;
  year: number | null;
  trim: string | null;
  odometer: number | null;
  bodyType: string | null;
  lead_status: "NEW" | "CONTACTED" | "CONVERTED" | "LOST";
  createdAt: string;
};

type FinancingLead = {
  id: number;
  salutation: string | null;
  gender: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  maritalStatus: string;
  birthDate: string;
  sin: string | null;
  currentAddress: string;
  currentCity: string;
  currentProvince: string;
  currentPostalCode: string;
  currentDurationYear: number;
  currentDurationMonth: number;
  homeStatus: string;
  monthlyPayment: number | null;
  prevAddress: string | null;
  prevCity: string | null;
  prevProvince: string | null;
  prevPostalCode: string | null;
  prevDurationYear: number | null;
  prevDurationMonth: number | null;
  employmentType: string;
  employer: string;
  occupation: string;
  employmentAddress: string;
  employmentCity: string;
  employmentProvince: string;
  employmentPostalCode: string;
  employmentPhone: string | null;
  employmentDurationYear: number;
  employmentDurationMonth: number;
  grossIncome: number;
  prevEmployer: string | null;
  prevEmploymentPhone: string | null;
  prevEmploymentDurationYear: number | null;
  prevEmploymentDurationMonth: number | null;
  bankruptcy: string | null;
  repossession: string | null;
  coSignerAvailable: string | null;
  creditRating: string | null;
  vehicleId: number;
  vehicle: {
    model_year: number;
    make: { name: string };
    model: { name: string };
  };
  lead_status: "NEW" | "CONTACTED" | "CONVERTED" | "LOST";
  createdAt: string;
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<{
    vehicleAvailability: VehicleLead[];
    tradeAppraisals: TradeAppraisal[];
    financingForms: FinancingLead[];
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"vehicle" | "trade" | "financing">(
    "vehicle"
  );
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const toggleRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch("/api/leads");
        const data = await res.json();
        setLeads(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch leads.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const updateLeadStatus = async (
    type: "vehicle" | "trade" | "financing",
    leadId: number,
    newStatus:
      | VehicleLead["lead_status"]
      | TradeAppraisal["lead_status"]
      | FinancingLead["lead_status"]
  ) => {
    if (!leads) return;
    const key =
      type === "vehicle"
        ? "vehicleAvailability"
        : type === "trade"
        ? "tradeAppraisals"
        : "financingForms";

    const updatedLeads = leads[key].map((l) =>
      l.id === leadId ? { ...l, lead_status: newStatus } : l
    );
    setLeads({ ...leads, [key]: updatedLeads });

    try {
      const res = await fetch("/api/leads/updateStatus", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, status: newStatus, type }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      toast.success(`Lead status updated to "${newStatus}"`);
    } catch (error) {
      console.error(error);
      // revert UI
      const revertedLeads = leads[key].map((l) =>
        l.id === leadId ? { ...l, lead_status: l.lead_status } : l
      );
      setLeads({ ...leads, [key]: revertedLeads });
      toast.error("Failed to update lead status. Try again.");
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading leads...</p>;

  // Lead data based on selected tab
  const currentLeads =
    activeTab === "vehicle"
      ? leads?.vehicleAvailability
      : activeTab === "trade"
      ? leads?.tradeAppraisals
      : leads?.financingForms;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Leads</h1>

      {/* Pills for lead categories */}
      <div className="flex space-x-2 mb-6">
        {[
          { key: "vehicle", label: "Vehicle Availability" },
          { key: "trade", label: "Trade Appraisals" },
          { key: "financing", label: "Financing" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 cursor-pointer rounded-full font-medium transition ${
              activeTab === tab.key
                ? "bg-maroon text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-sm tracking-wider">
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              {activeTab === "vehicle" && (
                <th className="px-4 py-3 text-left">Vehicle</th>
              )}
              {activeTab === "trade" && (
                <>
                  <th className="px-4 py-3 text-left">Vehicle</th>
                  <th className="px-4 py-3 text-left">Trim</th>
                  <th className="px-4 py-3 text-left">Odometer</th>
                  <th className="px-4 py-3 text-left">Body Type</th>
                </>
              )}
              {activeTab === "financing" && (
                <th className="px-4 py-3 text-left">Vehicle</th>
              )}
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentLeads?.map((lead: any, idx) => {
              const isExpanded = expandedRows.includes(lead.id);
              return (
                <React.Fragment key={lead.id}>
                  {/* Main Row */}
                  <tr
                    className={`${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100 cursor-pointer transition`}
                    onClick={() =>
                      activeTab === "financing" ? toggleRow(lead.id) : undefined
                    }
                  >
                    <td className="px-4 py-3">
                      {lead.firstName} {lead.lastName}
                    </td>
                    <td className="px-4 py-3">{lead.email}</td>
                    <td className="px-4 py-3">{lead.phone}</td>

                    {activeTab === "vehicle" && (
                      <td className="px-4 py-3">
                        {lead.vehicle.model_year} {lead.vehicle.make.name}{" "}
                        {lead.vehicle.model.name}
                      </td>
                    )}

                    {activeTab === "trade" && (
                      <>
                        <td className="px-4 py-3">
                          {lead.year || "N/A"} {lead.make} {lead.model}
                        </td>
                        <td className="px-4 py-3">{lead.trim || "N/A"}</td>
                        <td className="px-4 py-3">{lead.odometer || "N/A"}</td>
                        <td className="px-4 py-3">{lead.bodyType || "N/A"}</td>
                      </>
                    )}

                    {activeTab === "financing" && (
                      <td className="px-4 py-3 flex items-center">
                        {lead.vehicle?.model_year} {lead.vehicle?.make.name}{" "}
                        {lead.vehicle?.model.name}
                        <div className="px-2 py-1 ml-2 bg-maroon text-white w-fit rounded-lg hover:bg-red">
                          <Link
                            href={`/vehicles/${lead.vehicle?.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    )}

                    <td className="px-4 py-3">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={lead.lead_status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          updateLeadStatus(
                            activeTab,
                            lead.id,
                            e.target.value as
                              | "NEW"
                              | "CONTACTED"
                              | "CONVERTED"
                              | "LOST"
                          )
                        }
                        className="border rounded px-3 py-1 text-sm text-gray-700 cursor-pointer"
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="CONVERTED">CONVERTED</option>
                        <option value="LOST">LOST</option>
                      </select>
                    </td>
                  </tr>

                  {/* Financing expanded rows */}
                  {activeTab === "financing" && isExpanded && (
                    <tr
                      className={`${
                        idx % 2 === 0 ? "bg-gray-100" : "bg-gray-50"
                      } transition-all duration-300 ease-in-out`}
                    >
                      <td colSpan={6} className="px-4 py-0">
                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            isExpanded ? "max-h-[2000px] py-4" : "max-h-0"
                          }`}
                        >
                          <div className="space-y-4">
                            {/* Vehicle Details Section */}
                            <div className="bg-white shadow rounded-lg p-4">
                              <h3 className="font-semibold text-gray-800 mb-2 border-b pb-1">
                                Vehicle Details
                              </h3>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
                                <div>
                                  <strong>Year:</strong>{" "}
                                  {lead.vehicle?.model_year || "N/A"}
                                </div>
                                <div>
                                  <strong>Make:</strong>{" "}
                                  {lead.vehicle?.make?.name || "N/A"}
                                </div>
                                <div>
                                  <strong>Model:</strong>{" "}
                                  {lead.vehicle?.model?.name || "N/A"}
                                </div>
                                <div>
                                  <strong>Listed Price:</strong>{" "}
                                  {lead.vehicle?.listed_price
                                    ? `$${lead.vehicle.listed_price.toLocaleString()}`
                                    : "N/A"}
                                </div>
                                <div>
                                  <strong>Stock #:</strong>{" "}
                                  {lead.vehicle?.id || "N/A"}{" "}
                                  {/* you can add trim, color, mileage etc */}
                                </div>
                              </div>
                            </div>

                            {/* Personal Section */}
                            <div className="bg-white shadow rounded-lg p-4">
                              <h3 className="font-semibold text-gray-800 mb-2 border-b pb-1">
                                Personal Info
                              </h3>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
                                <div>
                                  <strong>Salutation:</strong>{" "}
                                  {lead.salutation || "N/A"}
                                </div>
                                <div>
                                  <strong>Gender:</strong>{" "}
                                  {lead.gender || "N/A"}
                                </div>
                                <div>
                                  <strong>First Name:</strong> {lead.firstName}
                                </div>
                                <div>
                                  <strong>Last Name:</strong> {lead.lastName}
                                </div>
                                <div>
                                  <strong>Phone:</strong> {lead.phone}
                                </div>
                                <div>
                                  <strong>Email:</strong> {lead.email}
                                </div>
                                <div>
                                  <strong>Marital Status:</strong>{" "}
                                  {lead.maritalStatus}
                                </div>
                                <div>
                                  <strong>Birth Date:</strong> {lead.birthDate}
                                </div>
                                <div>
                                  <strong>SIN:</strong> {lead.sin || "N/A"}
                                </div>
                              </div>
                            </div>

                            {/* Current Address Section */}
                            <div className="bg-white shadow rounded-lg p-4">
                              <h3 className="font-semibold text-gray-800 mb-2 border-b pb-1">
                                Current Address
                              </h3>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
                                <div>
                                  <strong>Address:</strong>{" "}
                                  {lead.currentAddress}
                                </div>
                                <div>
                                  <strong>City:</strong> {lead.currentCity}
                                </div>
                                <div>
                                  <strong>Province:</strong>{" "}
                                  {lead.currentProvince}
                                </div>
                                <div>
                                  <strong>Postal Code:</strong>{" "}
                                  {lead.currentPostalCode}
                                </div>
                                <div>
                                  <strong>Duration:</strong>{" "}
                                  {lead.currentDurationYear} yrs{" "}
                                  {lead.currentDurationMonth} mos
                                </div>
                                <div>
                                  <strong>Home Status:</strong>{" "}
                                  {lead.homeStatus}
                                </div>
                                <div>
                                  <strong>Monthly Payment:</strong>{" "}
                                  {lead.monthlyPayment || "N/A"}
                                </div>
                              </div>
                            </div>

                            {/* Previous Address Section */}
                            <div className="bg-white shadow rounded-lg p-4">
                              <h3 className="font-semibold text-gray-800 mb-2 border-b pb-1">
                                Previous Address
                              </h3>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
                                <div>
                                  <strong>Address:</strong>{" "}
                                  {lead.prevAddress || "N/A"}
                                </div>
                                <div>
                                  <strong>City:</strong>{" "}
                                  {lead.prevCity || "N/A"}
                                </div>
                                <div>
                                  <strong>Province:</strong>{" "}
                                  {lead.prevProvince || "N/A"}
                                </div>
                                <div>
                                  <strong>Postal Code:</strong>{" "}
                                  {lead.prevPostalCode || "N/A"}
                                </div>
                                <div>
                                  <strong>Duration:</strong>{" "}
                                  {lead.prevDurationYear || 0} yrs{" "}
                                  {lead.prevDurationMonth || 0} mos
                                </div>
                              </div>
                            </div>

                            {/* Employment Section */}
                            <div className="bg-white shadow rounded-lg p-4">
                              <h3 className="font-semibold text-gray-800 mb-2 border-b pb-1">
                                Employment
                              </h3>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
                                <div>
                                  <strong>Type:</strong> {lead.employmentType}
                                </div>
                                <div>
                                  <strong>Employer:</strong> {lead.employer}
                                </div>
                                <div>
                                  <strong>Occupation:</strong> {lead.occupation}
                                </div>
                                <div>
                                  <strong>Address:</strong>{" "}
                                  {lead.employmentAddress}
                                </div>
                                <div>
                                  <strong>City:</strong> {lead.employmentCity}
                                </div>
                                <div>
                                  <strong>Province:</strong>{" "}
                                  {lead.employmentProvince}
                                </div>
                                <div>
                                  <strong>Postal Code:</strong>{" "}
                                  {lead.employmentPostalCode}
                                </div>
                                <div>
                                  <strong>Phone:</strong>{" "}
                                  {lead.employmentPhone || "N/A"}
                                </div>
                                <div>
                                  <strong>Duration:</strong>{" "}
                                  {lead.employmentDurationYear} yrs{" "}
                                  {lead.employmentDurationMonth} mos
                                </div>
                                <div>
                                  <strong>Gross Income:</strong> $
                                  {lead.grossIncome}
                                </div>
                              </div>
                            </div>

                            {/* Financial Section */}
                            <div className="bg-white shadow rounded-lg p-4">
                              <h3 className="font-semibold text-gray-800 mb-2 border-b pb-1">
                                Financial
                              </h3>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
                                <div>
                                  <strong>Previous Employer:</strong>{" "}
                                  {lead.prevEmployer || "N/A"}
                                </div>
                                <div>
                                  <strong>Previous Employment Phone:</strong>{" "}
                                  {lead.prevEmploymentPhone || "N/A"}
                                </div>
                                <div>
                                  <strong>Previous Employment Duration:</strong>{" "}
                                  {lead.prevEmploymentDurationYear || 0} yrs{" "}
                                  {lead.prevEmploymentDurationMonth || 0} mos
                                </div>
                                <div>
                                  <strong>Bankruptcy:</strong>{" "}
                                  {lead.bankruptcy || "N/A"}
                                </div>
                                <div>
                                  <strong>Repossession:</strong>{" "}
                                  {lead.repossession || "N/A"}
                                </div>
                                <div>
                                  <strong>Co-Signer Available:</strong>{" "}
                                  {lead.coSignerAvailable || "N/A"}
                                </div>
                                <div>
                                  <strong>Credit Rating:</strong>{" "}
                                  {lead.creditRating || "N/A"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
