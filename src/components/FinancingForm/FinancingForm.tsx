"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";

export default function FinancingForm() {
  const searchParams = useSearchParams();
  const vehicleIdFromUrl = searchParams.get("vehicleId") || "";
  const vehicleMake = searchParams.get("make") || "";
  const vehicleModel = searchParams.get("model") || "";

  const [formData, setFormData] = useState({
    salutation: "",
    gender: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    maritalStatus: "",
    birthDate: "",
    sin: "",
    currentAddress: "",
    currentCity: "",
    currentProvince: "",
    currentPostalCode: "",
    currentDurationYear: "",
    currentDurationMonth: "",
    homeStatus: "",
    monthlyPayment: "",
    prevAddress: "",
    prevCity: "",
    prevProvince: "",
    prevPostalCode: "",
    prevDurationYear: "",
    prevDurationMonth: "",
    employmentType: "",
    employer: "",
    occupation: "",
    employmentAddress: "",
    employmentCity: "",
    employmentProvince: "",
    employmentPostalCode: "",
    employmentPhone: "",
    employmentDurationYear: "",
    employmentDurationMonth: "",
    grossIncome: "",
    prevEmployer: "",
    prevEmploymentPhone: "",
    prevEmploymentDurationYear: "",
    prevEmploymentDurationMonth: "",
    bankruptcy: "",
    repossession: "",
    coSignerAvailable: "",
    creditRating: "",
    vehicleId: vehicleIdFromUrl, // pre-fill vehicleId
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
      const res = await fetch("/api/forms/financing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("✅ Financing form submitted successfully!");
        setFormData(
          Object.fromEntries(
            Object.keys(formData).map((k) => [k, ""])
          ) as typeof formData
        );
      } else {
        toast.error("❌ Failed to submit financing form.");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    label: string,
    name: string,
    type: string = "text",
    placeholder?: string,
    required: boolean = false
  ) => (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name as keyof typeof formData]}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );

  const renderSelect = (
    label: string,
    name: string,
    options: string[],
    required: boolean = false
  ) => (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        name={name}
        value={formData[name as keyof typeof formData]}
        onChange={handleChange}
        required={required}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Financing Form{" "}
          {vehicleMake && vehicleModel && (
            <>
              for{" "}
              <Link
                href={`/vehicles/${vehicleIdFromUrl}`}
                className=" hover:text-blue-800"
              >
                {vehicleMake} {vehicleModel}
              </Link>
            </>
          )}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderSelect("Salutation", "salutation", [
              "Mr.",
              "Ms.",
              "Mrs.",
              "Dr.",
            ])}
            {renderSelect("Gender", "gender", ["Male", "Female", "Other"])}
            {renderInput("First Name", "firstName", "text", undefined, true)}
            {renderInput("Last Name", "lastName", "text", undefined, true)}
            {renderInput("Phone", "phone", "tel", undefined, true)}
            {renderInput("Email", "email", "email", undefined, true)}
            {renderSelect(
              "Marital Status",
              "maritalStatus",
              ["Single", "Married", "Divorced", "Widowed"],
              true
            )}
            {renderInput("Birth Date", "birthDate", "date", undefined, true)}
            {renderInput("SIN", "sin")}
          </div>

          {/* Current Address */}
          <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-3 gap-4">
            <h2 className="col-span-3 text-xl font-semibold mb-2">
              Current Address
            </h2>
            {renderInput("Address", "currentAddress", "text", undefined, true)}
            {renderInput("City", "currentCity", "text", undefined, true)}
            {renderInput(
              "Province",
              "currentProvince",
              "text",
              undefined,
              true
            )}
            {renderInput(
              "Postal Code",
              "currentPostalCode",
              "text",
              undefined,
              true
            )}
            {renderInput(
              "Duration (Years)",
              "currentDurationYear",
              "number",
              undefined,
              true
            )}
            {renderInput(
              "Duration (Months)",
              "currentDurationMonth",
              "number",
              undefined,
              true
            )}
            {renderInput("Home Status", "homeStatus", "text", undefined, true)}
            {renderInput("Monthly Payment", "monthlyPayment", "number")}
          </div>

          {/* Previous Address */}
          <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-3 gap-4">
            <h2 className="col-span-3 text-xl font-semibold mb-2">
              Previous Address
            </h2>
            {renderInput("Address", "prevAddress")}
            {renderInput("City", "prevCity")}
            {renderInput("Province", "prevProvince")}
            {renderInput("Postal Code", "prevPostalCode")}
            {renderInput("Duration (Years)", "prevDurationYear", "number")}
            {renderInput("Duration (Months)", "prevDurationMonth", "number")}
          </div>

          {/* Current Employment */}
          <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-3 gap-4">
            <h2 className="col-span-3 text-xl font-semibold mb-2">
              Current Employment
            </h2>
            {renderSelect(
              "Type",
              "employmentType",
              ["Full-time", "Part-time", "Contract"],
              true
            )}
            {renderInput("Employer", "employer", "text", undefined, true)}
            {renderInput("Occupation", "occupation", "text", undefined, true)}
            {renderInput(
              "Employment Address",
              "employmentAddress",
              "text",
              undefined,
              true
            )}
            {renderInput("City", "employmentCity", "text", undefined, true)}
            {renderInput(
              "Province",
              "employmentProvince",
              "text",
              undefined,
              true
            )}
            {renderInput(
              "Postal Code",
              "employmentPostalCode",
              "text",
              undefined,
              true
            )}
            {renderInput("Phone", "employmentPhone", "tel")}
            {renderInput(
              "Duration (Years)",
              "employmentDurationYear",
              "number",
              undefined,
              true
            )}
            {renderInput(
              "Duration (Months)",
              "employmentDurationMonth",
              "number",
              undefined,
              true
            )}
            {renderInput(
              "Gross Income",
              "grossIncome",
              "number",
              undefined,
              true
            )}
          </div>

          {/* Previous Employment */}
          <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-3 gap-4">
            <h2 className="col-span-3 text-xl font-semibold mb-2">
              Previous Employment
            </h2>
            {renderInput("Previous Employer", "prevEmployer")}
            {renderInput("Phone", "prevEmploymentPhone")}
            {renderInput(
              "Duration (Years)",
              "prevEmploymentDurationYear",
              "number"
            )}
            {renderInput(
              "Duration (Months)",
              "prevEmploymentDurationMonth",
              "number"
            )}
          </div>

          {/* Other Information */}
          <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-3 gap-4">
            <h2 className="col-span-3 text-xl font-semibold mb-2">
              Other Information
            </h2>
            {renderSelect("Previous Bankruptcy?", "bankruptcy", ["Yes", "No"])}
            {renderSelect("Previous Repossession?", "repossession", [
              "Yes",
              "No",
            ])}
            {renderSelect("Is Co-signer Available?", "coSignerAvailable", [
              "Yes",
              "No",
            ])}
            {renderSelect("Rate Your Credit", "creditRating", [
              "Excellent",
              "Good",
              "Fair",
              "Poor",
            ])}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-maroon text-white py-2 rounded-lg font-semibold hover:bg-red transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Financing Form"}
          </button>
        </form>
      </div>
    </Suspense>
  );
}
