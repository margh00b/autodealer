"use client";

import { Vehicle } from "@/types/vehicle";
import { useState } from "react";
import PriceSlider from "../PriceSlider/PriceSlider";

export interface Filters {
  make: string;
  model: string;
  year: string;
  price: [number, number];
  bodyType: string;
  mileage: number;
  engine: string;
  driveType: string;
  exteriorColor: string;
  interiorColor: string;
}

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
  vehicles: Vehicle[];
}

export default function VehicleFilterbar({
  filters,
  onChange,
  vehicles,
}: Props) {
  const handleChange = (key: keyof Filters, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  const unique = (arr: (string | null | undefined)[]) =>
    Array.from(new Set(arr.filter(Boolean) as string[]));

  const makes = unique(vehicles.map((v) => v.make?.name));
  const models = unique(vehicles.map((v) => v.model?.name));
  const bodyTypes = unique(vehicles.map((v) => v.body_type));
  const engines = unique(vehicles.map((v) => v.engine));
  const driveTypes = unique(vehicles.map((v) => v.drive_type));
  const exteriorColors = unique(vehicles.map((v) => v.exterior_color));
  const interiorColors = unique(vehicles.map((v) => v.interior_color));

  return (
    <div className="w-72 bg-white border-thinGrey border-1 shadow-xl rounded-xl p-6 space-y-6 sticky top-4 h-fit">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>

      {/* Make */}
      <div>
        <label className="block font-medium mb-1">Make</label>
        <select
          value={filters.make}
          onChange={(e) => handleChange("make", e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 hover:border-gray-400"
        >
          <option value="">All</option>
          {makes.map((m, i) => (
            <option key={i} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Model */}
      <div>
        <label className="block font-medium mb-1">Model</label>
        <select
          value={filters.model}
          onChange={(e) => handleChange("model", e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 hover:border-gray-400"
        >
          <option value="">All</option>
          {models.map((m, i) => (
            <option key={i} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Year */}
      <div>
        <label className="block font-medium mb-1">Year</label>
        <input
          type="number"
          value={filters.year}
          onChange={(e) => handleChange("year", e.target.value)}
          placeholder="e.g. 2022"
          className="w-full border border-gray-300 rounded-lg p-2 hover:border-gray-400"
        />
      </div>

      {/* Price Slider */}
      <div>
        <label className="block font-medium mb-2">Price Range</label>
        <PriceSlider
          min={0}
          max={100000}
          step={500}
          value={filters.price}
          onChange={(val) => handleChange("price", val)}
        />
      </div>

      {/* Mileage */}
      <div>
        <label className="block font-medium mb-1">Max Mileage (km)</label>
        <input
          type="number"
          value={filters.mileage}
          onChange={(e) => handleChange("mileage", Number(e.target.value))}
          className="w-full border border-gray-300 rounded-lg p-2 hover:border-gray-400"
        />
      </div>

      {/* Body Type */}
      <div>
        <label className="block font-medium mb-1">Body Type</label>
        <select
          value={filters.bodyType}
          onChange={(e) => handleChange("bodyType", e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 hover:border-gray-400"
        >
          <option value="">All</option>
          {bodyTypes.map((b, i) => (
            <option key={i} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* Engine */}
      <div>
        <label className="block font-medium mb-1">Engine</label>
        <select
          value={filters.engine}
          onChange={(e) => handleChange("engine", e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 hover:border-gray-400"
        >
          <option value="">All</option>
          {engines.map((e, i) => (
            <option key={i} value={e}>
              {e}
            </option>
          ))}
        </select>
      </div>

      {/* Drive Type */}
      <div>
        <label className="block font-medium mb-1">Drive Type</label>
        <select
          value={filters.driveType}
          onChange={(e) => handleChange("driveType", e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 hover:border-gray-400"
        >
          <option value="">All</option>
          {driveTypes.map((d, i) => (
            <option key={i} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Exterior Color */}
      <div>
        <label className="block font-medium mb-1">Exterior Color</label>
        <select
          value={filters.exteriorColor}
          onChange={(e) => handleChange("exteriorColor", e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 hover:border-gray-400"
        >
          <option value="">All</option>
          {exteriorColors.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Interior Color */}
      <div>
        <label className="block font-medium mb-1">Interior Color</label>
        <select
          value={filters.interiorColor}
          onChange={(e) => handleChange("interiorColor", e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 hover:border-gray-400"
        >
          <option value="">All</option>
          {interiorColors.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
