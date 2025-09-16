"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useFileUpload } from "@/hooks/useFileUpload";

export default function DashboardPage() {
  const { uploadFile, uploadState } = useFileUpload();

  const [formData, setFormData] = useState({
    vin_number: "",
    model_year: "",
    trim: "",
    listed_price: "",
    expected_price: "",
    status: "OPEN",
    odometer: "",
    body_type: "",
    doors: "",
    drive_type: "",
    transmission: "",
    engine: "",
    horse_power: "",
    fuel_type: "",
    fuel_capacity: "",
    city_fuel: "",
    hwy_fuel: "",
    combined_fuel: "",
    battery_capacity: "",
    exterior_color: "",
    interior_color: "",
    front_legroom: "",
    back_legroom: "",
    cargo_volume: "",
    safety_features: "",
    options: "",
    comment: "",
    makeId: "",
    modelId: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Vehicle creation and image uploads (same as before)
      const vehicleRes = await fetch("/api/vehicles/vehicle-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          model_year: parseInt(formData.model_year),
          listed_price: parseFloat(formData.listed_price),
          expected_price: formData.expected_price
            ? parseFloat(formData.expected_price)
            : undefined,
          odometer: parseInt(formData.odometer),
          doors: formData.doors ? parseInt(formData.doors) : undefined,
          horse_power: formData.horse_power
            ? parseInt(formData.horse_power)
            : undefined,
          fuel_capacity: formData.fuel_capacity
            ? parseFloat(formData.fuel_capacity)
            : undefined,
          city_fuel: formData.city_fuel
            ? parseFloat(formData.city_fuel)
            : undefined,
          hwy_fuel: formData.hwy_fuel
            ? parseFloat(formData.hwy_fuel)
            : undefined,
          combined_fuel: formData.combined_fuel
            ? parseFloat(formData.combined_fuel)
            : undefined,
          front_legroom: formData.front_legroom
            ? parseFloat(formData.front_legroom)
            : undefined,
          back_legroom: formData.back_legroom
            ? parseFloat(formData.back_legroom)
            : undefined,
          cargo_volume: formData.cargo_volume
            ? parseFloat(formData.cargo_volume)
            : undefined,
          safety_features: formData.safety_features
            ? formData.safety_features.split(",").map((s) => s.trim())
            : [],
          options: formData.options
            ? formData.options.split(",").map((s) => s.trim())
            : [],
          makeId: parseInt(formData.makeId),
          modelId: parseInt(formData.modelId),
        }),
      });

      if (!vehicleRes.ok) {
        const errorText = await vehicleRes.text();
        console.error("Vehicle API error:", errorText);
        throw new Error("Failed to create vehicle");
      }

      const vehicle = await vehicleRes.json();

      const uploadedImages = [];
      for (const file of images) {
        const result = await uploadFile(file, "vehicle-image", vehicle.id);
        if (result.success && result.fileUrl) {
          uploadedImages.push({ url: result.fileUrl, key: result.fileKey });
        }
      }

      if (uploadedImages.length > 0) {
        await fetch("/api/vehicles/vehicle-images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vehicleId: vehicle.id,
            images: uploadedImages,
          }),
        });
      }

      toast.success("Vehicle created successfully!");
      setFormData({
        vin_number: "",
        model_year: "",
        trim: "",
        listed_price: "",
        expected_price: "",
        status: "OPEN",
        odometer: "",
        body_type: "",
        doors: "",
        drive_type: "",
        transmission: "",
        engine: "",
        horse_power: "",
        fuel_type: "",
        fuel_capacity: "",
        city_fuel: "",
        hwy_fuel: "",
        combined_fuel: "",
        battery_capacity: "",
        exterior_color: "",
        interior_color: "",
        front_legroom: "",
        back_legroom: "",
        cargo_volume: "",
        safety_features: "",
        options: "",
        comment: "",
        makeId: "",
        modelId: "",
      });
      setImages([]);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to create vehicle");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Add Vehicle</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <input
            name="vin_number"
            value={formData.vin_number}
            onChange={handleChange}
            placeholder="VIN Number"
            required
            className="border p-2 rounded-md"
          />
          <input
            name="model_year"
            type="number"
            value={formData.model_year}
            onChange={handleChange}
            placeholder="Model Year"
            required
            className="border p-2 rounded-md"
          />
          <input
            name="trim"
            value={formData.trim}
            onChange={handleChange}
            placeholder="Trim"
            className="border p-2 rounded-md"
          />
          <input
            name="listed_price"
            type="number"
            value={formData.listed_price}
            onChange={handleChange}
            placeholder="Listed Price"
            required
            className="border p-2 rounded-md"
          />
          <input
            name="expected_price"
            type="number"
            value={formData.expected_price}
            onChange={handleChange}
            placeholder="Expected Price"
            className="border p-2 rounded-md"
          />
          <input
            name="odometer"
            type="number"
            value={formData.odometer || ""}
            onChange={handleChange}
            placeholder="Odometer"
            className="border p-2 rounded-md"
          />

          <input
            name="body_type"
            value={formData.body_type}
            onChange={handleChange}
            placeholder="Body Type"
            className="border p-2 rounded-md"
          />
          <input
            name="doors"
            type="number"
            value={formData.doors}
            onChange={handleChange}
            placeholder="Doors"
            className="border p-2 rounded-md"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            name="drive_type"
            value={formData.drive_type}
            onChange={handleChange}
            placeholder="Drive Type"
            className="border p-2 rounded-md"
          />
          <input
            name="transmission"
            value={formData.transmission}
            onChange={handleChange}
            placeholder="Transmission"
            className="border p-2 rounded-md"
          />
          <input
            name="engine"
            value={formData.engine}
            onChange={handleChange}
            placeholder="Engine"
            className="border p-2 rounded-md"
          />
          <input
            name="horse_power"
            type="number"
            value={formData.horse_power}
            onChange={handleChange}
            placeholder="Horse Power"
            className="border p-2 rounded-md"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            name="fuel_type"
            value={formData.fuel_type}
            onChange={handleChange}
            placeholder="Fuel Type"
            className="border p-2 rounded-md"
          />
          <input
            name="fuel_capacity"
            type="number"
            value={formData.fuel_capacity}
            onChange={handleChange}
            placeholder="Fuel Capacity (L)"
            className="border p-2 rounded-md"
          />
          <input
            name="city_fuel"
            type="number"
            value={formData.city_fuel}
            onChange={handleChange}
            placeholder="City Fuel (L/100km)"
            className="border p-2 rounded-md"
          />
          <input
            name="hwy_fuel"
            type="number"
            value={formData.hwy_fuel}
            onChange={handleChange}
            placeholder="Highway Fuel (L/100km)"
            className="border p-2 rounded-md"
          />
        </div>

        <textarea
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          placeholder="Comment"
          className="border p-2 rounded-md w-full"
        />

        <input
          name="makeId"
          type="number"
          value={formData.makeId}
          onChange={handleChange}
          placeholder="Make ID"
          required
          className="border p-2 rounded-md w-full"
        />
        <input
          name="modelId"
          type="number"
          value={formData.modelId}
          onChange={handleChange}
          placeholder="Model ID"
          required
          className="border p-2 rounded-md w-full"
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="border p-2 rounded-md w-full"
        />

        {uploadState.progress && (
          <p className="text-blue-500">
            Uploading images: {uploadState.progress.percentage}%
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors w-full"
        >
          {isSubmitting ? "Submitting..." : "Add Vehicle"}
        </button>
      </form>
    </div>
  );
}
