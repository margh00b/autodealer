"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SignedIn, UserButton } from "@clerk/nextjs";
interface Make {
  id: number;
  name: string;
}

interface Model {
  id: number;
  name: string;
}
export default function VehicleDashboard() {
  const [images, setImages] = useState<File[]>([]);
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedMake, setSelectedMake] = useState<number | null>(null);

  const vehicleStatuses = [
    "AVAILABLE",
    "RESERVED",
    "SOLD",
    "PENDING",
    "UNAVAILABLE",
  ];
  const bodyTypes = [
    "CONVERTIBLE",
    "COUPE",
    "HATCHBACK",
    "MINIVAN",
    "SEDAN",
    "SUV",
    "TRUCK",
    "WAGON",
  ];
  const driveTypes = ["FWD", "RWD", "AWD", "FOURWD"];
  const transmissions = ["AUTOMATIC", "MANUAL"];
  const fuelTypes = ["PETROL", "DIESEL", "ELECTRIC"];

  useEffect(() => {
    fetch("/api/makes")
      .then((res) => res.json())
      .then(setMakes)
      .catch(console.error);
  }, []);
  useEffect(() => {
    if (!selectedMake) {
      setModels([]);
      return;
    }

    fetch(`/api/models?makeId=${selectedMake}`)
      .then((res) => res.json())
      .then(setModels);
  }, [selectedMake]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget; // save the form element

    const formData = new FormData(form);
    images.forEach((file) => formData.append("images", file));

    await toast.promise(
      (async () => {
        const res = await fetch("/api/dashboard/create", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create vehicle");

        form.reset();
        setImages([]);
        setSelectedMake(null);
        setModels([]);

        return data;
      })(),
      {
        loading: "🚗 Creating vehicle...",
        success: "✅ Vehicle created successfully!",
        error: (err) => `❌ ${err.message}`,
      }
    );
  };

  const removeFile = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <SignedIn>
        <div className="bg-red-300 w-fit p-2 rounded-full justify-self-end mb-6 shadow">
          <UserButton showName={true} />
        </div>
      </SignedIn>

      <h1 className="text-3xl font-extrabold mb-6 text-gray-800">
        Create Vehicle
      </h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white shadow-lg p-8 rounded-2xl border border-gray-100"
      >
        {/* Mandatory Fields */}
        <div className="md:col-span-2 mb-2">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">
            Basic Information
          </h2>
        </div>

        <label className="flex flex-col">
          VIN Number *
          <input
            type="text"
            name="vin_number"
            required
            className="border p-2"
          />
        </label>

        <label className="flex flex-col">
          Model Year *
          <input
            type="number"
            name="model_year"
            required
            className="border p-2"
          />
        </label>

        <label className="flex flex-col">
          Odometer *
          <input
            type="number"
            name="odometer"
            required
            className="border p-2"
          />
        </label>

        <label className="flex flex-col">
          Listed Price *
          <input
            type="number"
            step="0.01"
            name="listed_price"
            required
            className="border p-2"
          />
        </label>

        <label className="flex flex-col">
          Discounted Price *
          <input
            type="number"
            step="0.01"
            name="discounted_price"
            className="border p-2"
          />
        </label>

        {/* Make Dropdown */}
        <label className="flex flex-col">
          Make *
          <select
            name="makeId"
            onChange={(e) => setSelectedMake(Number(e.target.value))}
            className="border p-2"
            required
          >
            <option value="">-- Select Make --</option>
            {makes.map((make) => (
              <option key={make.id} value={make.id}>
                {make.name}
              </option>
            ))}
          </select>
        </label>

        {/* Model Dropdown */}
        <label className="flex flex-col">
          Model *
          <select name="modelId" className="border p-2" required>
            <option value="">-- Select Model --</option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </label>

        {/* Optional Fields */}
        <div className="md:col-span-2 mt-4 mb-2">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Details</h2>
        </div>

        <label className="flex flex-col">
          Trim
          <input type="text" name="trim" className="border p-2" />
        </label>

        <label className="flex flex-col col-span-2">
          Description
          <textarea name="description" rows={3} className="border p-2" />
        </label>

        {/* ENUM DROPDOWNS */}
        <label className="flex flex-col">
          Status
          <select name="status" className="border p-2">
            <option value="">-- Select --</option>
            {vehicleStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col">
          Body Type
          <select name="body_type" className="border p-2">
            <option value="">-- Select --</option>
            {bodyTypes.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col">
          Doors
          <input type="number" name="doors" className="border p-2" />
        </label>

        <label className="flex flex-col">
          Drive Type
          <select name="drive_type" className="border p-2">
            <option value="">-- Select --</option>
            {driveTypes.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col">
          Transmission
          <select name="transmission" className="border p-2">
            <option value="">-- Select --</option>
            {transmissions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col">
          Engine
          <input type="text" name="engine" className="border p-2" />
        </label>

        <label className="flex flex-col">
          Horse Power
          <input type="number" name="horse_power" className="border p-2" />
        </label>

        <label className="flex flex-col">
          Fuel Type
          <select name="fuel_type" className="border p-2">
            <option value="">-- Select --</option>
            {fuelTypes.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </label>

        {/* Remaining fields */}
        <div className="md:col-span-2 mt-4 mb-2">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">
            Specifications
          </h2>
        </div>

        <label className="flex flex-col">
          Fuel Capacity (liters)
          <input
            type="number"
            step="0.1"
            name="fuel_capacity"
            className="border p-2"
          />
        </label>

        <label className="flex flex-col">
          City Fuel (L/100km)
          <input
            type="number"
            step="0.1"
            name="city_fuel"
            className="border p-2"
          />
        </label>

        <label className="flex flex-col">
          Highway Fuel (L/100km)
          <input
            type="number"
            step="0.1"
            name="hwy_fuel"
            className="border p-2"
          />
        </label>

        <label className="flex flex-col">
          Combined Fuel (L/100km)
          <input
            type="number"
            step="0.1"
            name="combined_fuel"
            className="border p-2"
          />
        </label>

        <label className="flex flex-col">
          Battery Capacity
          <input type="text" name="battery_capacity" className="border p-2" />
        </label>

        <label className="flex flex-col">
          Exterior Color
          <input type="text" name="exterior_color" className="border p-2" />
        </label>

        <label className="flex flex-col">
          Interior Color
          <input type="text" name="interior_color" className="border p-2" />
        </label>

        <label className="flex flex-col">
          Front Legroom (mm)
          <input
            type="number"
            step="0.1"
            name="front_legroom"
            className="border p-2"
          />
        </label>

        <label className="flex flex-col">
          Back Legroom (mm)
          <input
            type="number"
            step="0.1"
            name="back_legroom"
            className="border p-2"
          />
        </label>

        <label className="flex flex-col">
          Cargo Volume (liters)
          <input
            type="number"
            step="0.1"
            name="cargo_volume"
            className="border p-2"
          />
        </label>

        <label className="flex flex-col col-span-2">
          Features (comma separated)
          <input type="text" name="features" className="border p-2" />
        </label>

        <label className="flex flex-col col-span-2">
          Carfax
          <input type="text" name="carfax" className="border p-2" />
        </label>

        <label className="flex flex-col col-span-2">
          Comment
          <textarea name="comment" rows={3} className="border p-2" />
        </label>

        {/* File Upload */}
        <div className="flex flex-col gap-2 col-span-2 mt-4">
          <label className="font-semibold text-gray-700 mb-1">Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            id="fileInput"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => document.getElementById("fileInput")?.click()}
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg border border-gray-300 transition-colors duration-150 shadow-sm font-medium"
          >
            Select Images
          </button>

          <div className="flex flex-wrap gap-2 mt-2">
            {images.map((file, index) => (
              <div
                key={index}
                className="bg-gray-100 px-3 py-1 rounded-lg flex items-center gap-2 border border-gray-200 shadow-sm"
              >
                <span className="text-sm">{file.name}</span>
                <button
                  type="button"
                  className="text-red-500 font-bold hover:text-red-700 transition"
                  onClick={() => removeFile(index)}
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2 mt-6">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 focus:bg-blue-800 text-white px-6 py-3 rounded-xl w-full font-semibold shadow transition-colors duration-150"
          >
            Create Vehicle
          </button>
        </div>
      </form>
    </div>
  );
}
