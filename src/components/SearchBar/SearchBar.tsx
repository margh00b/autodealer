"use client";

import { useState, useEffect } from "react";
import CustomDropdown from "./CustomDropdown";
import { Filters } from "../VehicleFilterbar/VehicleFilterbar";

interface SearchData {
  make: string;
  model: string;
  year: string;
  type: string;
}

interface Make {
  id: number;
  name: string;
}

interface Model {
  id: number;
  name: string;
}

interface SearchBarProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

export default function SearchBar({ filters, setFilters }: SearchBarProps) {
  const [searchData, setSearchData] = useState<SearchData>({
    make: "Any Make",
    model: "Any Model",
    year: "Any Year",
    type: "Any Type",
  });

  const [makes, setMakes] = useState<{ id: number; name: string }[]>([]);
  const [selectedMakeId, setSelectedMakeId] = useState<number | null>(null);
  const [models, setModels] = useState<Model[]>([]);

  const years = [
    "Any Year",
    "2024",
    "2023",
    "2022",
    "2021",
    "2020",
    "2019",
    "2018",
    "2017",
    "2016",
    "2015",
    "2014",
    "2013",
    "2012",
    "2011",
    "2010",
  ];

  const types = [
    "Any Type",
    "Convertible",
    "Coupe",
    "Hatchback",
    "Minivan",
    "Sedan",
    "SUV",
    "Truck",
    "Wagon",
  ];

  useEffect(() => {
    fetch("/api/makes")
      .then((res) => res.json())
      .then(setMakes)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedMakeId) {
      setModels([]);
      setSearchData((prev) => ({ ...prev, model: "Any Model" }));
      return;
    }

    fetch(`/api/models?makeId=${selectedMakeId}`)
      .then((res) => res.json())
      .then((data) => setModels([...data]))
      .catch(console.error);
  }, [selectedMakeId]);

  const handleInputChange = (field: keyof SearchData, value: string) => {
    setSearchData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    setFilters({
      make: searchData.make === "Any Make" ? "" : searchData.make,
      model: searchData.model === "Any Model" ? "" : searchData.model,
      year: searchData.year === "Any Year" ? "" : searchData.year,
      bodyType:
        searchData.type === "Any Type" ? "" : searchData.type.toUpperCase(),
      price: [0, 100000],
      mileage: 0,
      engine: "",
      driveType: "",
      exteriorColor: "",
      interiorColor: "",
    });
    const inventoryElement = document.getElementById("inventory");
    if (inventoryElement) {
      inventoryElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 mt-[-50px] z-90">
      <div className="bg-white shadow-2xl rounded-full p-6 md:p-4 flex flex-col md:flex-row gap-4 items-center">
        {/* Make */}
        <div className="flex-1 w-full md:w-auto">
          <CustomDropdown
            options={["Any Make", ...makes.map((m) => m.name)]}
            value={searchData.make}
            onChange={(value) => {
              const make = makes.find((m) => m.name === value);
              setSelectedMakeId(make?.id ?? null);
              setSearchData((prev) => ({
                ...prev,
                make: value,
                model: "Any Model",
              }));
            }}
          />
        </div>

        {/* Model */}
        <div className="flex-1 w-full md:w-auto">
          <CustomDropdown
            options={["Any Model", ...models.map((m) => m.name)]}
            value={searchData.model}
            onChange={(value) => handleInputChange("model", value)}
          />
        </div>

        {/* Year */}
        <div className="flex-1 w-full md:w-auto">
          <CustomDropdown
            options={years}
            value={searchData.year}
            onChange={(value) => handleInputChange("year", value)}
          />
        </div>

        {/* Type */}
        <div className="flex-1 w-full md:w-auto">
          <CustomDropdown
            options={types}
            value={searchData.type}
            onChange={(value) => handleInputChange("type", value)}
          />
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="w-full md:w-auto bg-red text-white font-semibold shadow-md hover:bg-maroon transition-all px-8 py-3 rounded-3xl  hover:shadow-xl  duration-300 transform hover:scale-95 cursor-pointer"
        >
          Search
        </button>
      </div>
    </div>
  );
}
