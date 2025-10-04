import React from "react";
import Link from "next/link";
import { ImageItem } from "../ImageItem/ImageItem";

interface SelectOption {
  id: number | string;
  name: string;
}

interface VehicleFormProps {
  images: File[];
  makes: SelectOption[];
  models: SelectOption[];

  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  setSelectedMake: (makeId: number | null) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (index: number) => void;

  handleDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  handleDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
}

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

const FormSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <>
    <div className="md:col-span-2 mt-4 mb-2">
      <h2 className="text-xl font-semibold text-maroon mb-2">{title}</h2>
    </div>
    {children}
  </>
);

export const VehicleCreationForm = ({
  images,
  makes,
  models,
  handleSubmit,
  setSelectedMake,
  handleFileChange,
  removeFile,
  handleDragStart,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleDragEnd,
}: VehicleFormProps) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white shadow-lg p-8 rounded-2xl border border-gray-100"
    >
      {/* Basic Information */}
      <FormSection title="Basic Information">
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
      </FormSection>

      {/* Details */}
      <FormSection title="Details">
        <label className="flex flex-col">
          Trim
          <input type="text" name="trim" className="border p-2" />
        </label>
        <label className="flex flex-col col-span-2">
          Description
          <textarea name="description" rows={3} className="border p-2" />
        </label>
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
      </FormSection>

      {/* Specifications */}
      <FormSection title="Specifications">
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
      </FormSection>

      {/* File Upload and Native Drag-and-Drop */}
      <div className="flex flex-col gap-2 col-span-2 mt-4">
        <label className="font-semibold text-gray-700 mb-1">
          Images (Drag and drop to reorder)
        </label>
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
          Select/Add Images
        </button>

        <div className="flex flex-wrap gap-2 mt-2 p-2 border-dashed border-2 border-gray-300 rounded-lg min-h-24">
          {images.map((file, index) => (
            <ImageItem
              key={`${file.name}-${file.size}-${index}`}
              file={file}
              index={index}
              removeFile={removeFile}
              handleDragStart={handleDragStart}
              handleDragOver={handleDragOver}
              handleDragLeave={handleDragLeave}
              handleDrop={handleDrop}
              handleDragEnd={handleDragEnd}
            />
          ))}
          {images.length === 0 && (
            <p className="text-gray-500 m-auto">
              Select images to upload or drag files here
            </p>
          )}
        </div>
      </div>

      <div className="col-span-2 mt-6">
        <button
          type="submit"
          className="bg-red hover:bg-maroon focus:bg-maroon text-white px-6 py-3 rounded-xl w-full font-semibold shadow transition-colors duration-150"
        >
          Create Vehicle
        </button>
      </div>
    </form>
  );
};
