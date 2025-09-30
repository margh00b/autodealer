"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function TradeAppraisal() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    make: "",
    model: "",
    year: "",
    trim: "",
    odometer: "",
    bodyType: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/forms/tradeAppraisal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData }),
      });

      if (res.ok) {
        toast.success("✅ Request submitted successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          make: "",
          model: "",
          year: "",
          trim: "",
          odometer: "",
          bodyType: "",
        });
      } else {
        toast.error("❌ Failed to submit request.");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-center">
        Trade Appraisal / Vehicle Info
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Personal Info */}
        {["firstName", "lastName", "email", "phone"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type={field === "email" ? "email" : "text"}
              name={field}
              value={formData[field as keyof typeof formData]}
              onChange={handleChange}
              placeholder={field === "phone" ? "(123) 456-7890" : undefined}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        ))}

        {/* Vehicle Info */}
        {[
          { name: "make", placeholder: "Toyota, Honda..." },
          { name: "model", placeholder: "Camry, Civic..." },
          { name: "year", placeholder: "2022", type: "number" },
          { name: "trim", placeholder: "LE, XLE..." },
          { name: "odometer", placeholder: "50000", type: "number" },
          { name: "bodyType", placeholder: "Sedan, SUV..." },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {field.name.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type={field.type || "text"}
              name={field.name}
              value={formData[field.name as keyof typeof formData]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        ))}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-maroon text-white py-2 rounded-lg font-semibold hover:bg-red transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}
