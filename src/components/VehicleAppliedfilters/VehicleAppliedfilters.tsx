"use client";

import { Filters } from "../VehicleFilterbar/VehicleFilterbar";

interface Props {
  filters: Filters;
  onClear: (key: keyof Filters) => void;
}

export default function VehicleAppliedfilters({ filters, onClear }: Props) {
  const entries = Object.entries(filters).filter(([_, v]) => {
    if (Array.isArray(v)) return v[0] !== 0 || v[1] !== 100000;
    if (typeof v === "number") return v > 0;
    return v !== "";
  });

  if (entries.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {entries.map(([key, value]) => {
        if (key === "price") {
          const min = value[0];
          const max = value[1] === 100000 ? "No max" : value[1];
          return (
            <span
              key={key}
              className="bg-gray-200 text-sm px-3 py-1 rounded-full flex items-center gap-2"
            >
              {key}: {min} - {max}
              <button
                onClick={() => onClear(key as keyof Filters)}
                className="ml-1 text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </span>
          );
        }
        return (
          <span
            key={key}
            className="bg-gray-200 text-sm px-3 py-1 rounded-full flex items-center gap-2"
          >
            {key}: {value}
            <button
              onClick={() => onClear(key as keyof Filters)}
              className="ml-1 text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </span>
        );
      })}
    </div>
  );
}
