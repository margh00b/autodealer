"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function VehicleDashboard() {
  


  const [images, setImages] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    images.forEach((file) => formData.append("images", file));

    await toast.promise(
      (async () => {
        const res = await fetch("/api/vehicles/create", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create vehicle");
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
        <div className="bg-red-300 w-fit p-2 rounded-full justify-self-end mb-6">
          <UserButton showName={true} />
        </div>
      </SignedIn>

      <h1 className="text-2xl font-bold mb-4">Create Vehicle</h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white shadow p-6 rounded"
      >
        {/* Mandatory Fields */}
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
          Make ID *
          <input type="number" name="makeId" required className="border p-2" />
        </label>

        <label className="flex flex-col">
          Model ID *
          <input type="number" name="modelId" required className="border p-2" />
        </label>

        {/* Optional Fields */}
        <label className="flex flex-col">
          Trim
          <input type="text" name="trim" className="border p-2" />
        </label>

        <label className="flex flex-col">
          Expected Price
          <input
            type="number"
            step="0.01"
            name="expected_price"
            className="border p-2"
          />
        </label>

        <label className="flex flex-col">
          Status
          <input
            type="text"
            name="status"
            placeholder="OPEN / SOLD"
            className="border p-2"
          />
        </label>

        <label className="flex flex-col">
          Body Type
          <input type="text" name="body_type" className="border p-2" />
        </label>

        <label className="flex flex-col">
          Doors
          <input type="number" name="doors" className="border p-2" />
        </label>

        <label className="flex flex-col">
          Drive Type
          <input type="text" name="drive_type" className="border p-2" />
        </label>

        <label className="flex flex-col">
          Transmission
          <input type="text" name="transmission" className="border p-2" />
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
          <input type="text" name="fuel_type" className="border p-2" />
        </label>

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
          Safety Features (comma separated)
          <input type="text" name="safety_features" className="border p-2" />
        </label>

        <label className="flex flex-col col-span-2">
          Options (comma separated)
          <input type="text" name="options" className="border p-2" />
        </label>

        <label className="flex flex-col col-span-2">
          Comment
          <textarea name="comment" rows={3} className="border p-2" />
        </label>

        {/* File Upload */}
        <div className="flex flex-col gap-2">
          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            id="fileInput"
            onChange={handleFileChange}
          />

          {/* Custom button to trigger file input */}
          <button
            type="button"
            onClick={() => document.getElementById("fileInput")?.click()}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Select Images
          </button>

          {/* Pills for selected files */}
          <div className="flex flex-wrap gap-2 mt-2">
            {images.map((file, index) => (
              <div
                key={index}
                className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1"
              >
                <span>{file.name}</span>
                <button
                  type="button"
                  className="text-red-500 font-bold"
                  onClick={() => removeFile(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Create Vehicle
          </button>
        </div>
      </form>
    </div>
  );
}
