"use client";

import { useState } from "react";
import CustomDropdown from "./CustomDropdown";

export default function SearchBar() {
  const [searchData, setSearchData] = useState({
    make: "Any Make",
    model: "Any Model",
    year: "Any Year",
    type: "Any Type",
  });

  const makeModelMap: Record<string, string[]> = {
    "Any Make": ["Any Model"],
    Toyota: [
      "Any Model",
      "Camry",
      "Corolla",
      "RAV4",
      "Highlander",
      "Tacoma",
      "Tundra",
      "Prius",
      "Supra",
    ],
    Honda: [
      "Any Model",
      "Civic",
      "Accord",
      "CR-V",
      "Pilot",
      "HR-V",
      "Fit",
      "Odyssey",
    ],
    Ford: [
      "Any Model",
      "F-150",
      "Mustang",
      "Explorer",
      "Escape",
      "Edge",
      "Ranger",
      "Bronco",
      "Fusion",
    ],
    Chevrolet: [
      "Any Model",
      "Silverado",
      "Malibu",
      "Equinox",
      "Tahoe",
      "Camaro",
      "Traverse",
      "Colorado",
    ],
    BMW: [
      "Any Model",
      "3 Series",
      "5 Series",
      "X1",
      "X3",
      "X5",
      "X7",
      "7 Series",
      "M3",
    ],
    "Mercedes-Benz": [
      "Any Model",
      "C-Class",
      "E-Class",
      "S-Class",
      "GLC",
      "GLE",
      "A-Class",
      "G-Class",
    ],
    Audi: [
      "Any Model",
      "A3",
      "A4",
      "A6",
      "A8",
      "Q3",
      "Q5",
      "Q7",
      "Q8",
      "TT",
      "e-tron",
    ],
    Nissan: [
      "Any Model",
      "Altima",
      "Sentra",
      "Maxima",
      "Rogue",
      "Murano",
      "Pathfinder",
      "Titan",
      "350Z",
    ],
    Hyundai: [
      "Any Model",
      "Elantra",
      "Sonata",
      "Tucson",
      "Santa Fe",
      "Kona",
      "Palisae",
      "Venue",
    ],
    Kia: [
      "Any Model",
      "Sorento",
      "Sportage",
      "Optima",
      "Telluride",
      "Seltos",
      "Stinger",
      "Soul",
    ],
    Mazda: [
      "Any Model",
      "CX-5",
      "Mazda3",
      "Mazda6",
      "CX-30",
      "CX-50",
      "MX-5 Miata",
      "CX-9",
    ],
    Subaru: [
      "Any Model",
      "Outback",
      "Forester",
      "Impreza",
      "Crosstrek",
      "Legacy",
      "WRX",
      "BRZ",
    ],
    Volkswagen: [
      "Any Model",
      "Jetta",
      "Passat",
      "Tiguan",
      "Atlas",
      "Golf",
      "Arteon",
      "ID.4",
    ],
    Lexus: ["Any Model", "ES", "RX", "NX", "IS", "UX", "GX", "LX"],
  };

  const filteredModels = makeModelMap[searchData.make] || ["Any Model"];

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
    "Sedan",
    "SUV",
    "Truck",
    "Coupe",
    "Convertible",
    "Hatchback",
    "Wagon",
    "Crossover",
    "Sports Car",
    "Luxury",
    "Electric",
    "Hybrid",
  ];

  const handleInputChange = (field: string, value: string) => {
    setSearchData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    console.log("Searching for:", searchData);
    // TODO: Connect to your backend search API
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-[-70px] z-999">
      <div className="bg-white shadow-2xl rounded-full p-6 md:p-4 flex flex-col md:flex-row gap-4 items-center">
        {/* Make */}
        <div className="flex-1 w-full md:w-auto">
          <CustomDropdown
            options={Object.keys(makeModelMap)}
            value={searchData.make}
            onChange={(value) =>
              setSearchData((prev) => ({
                ...prev,
                make: value,
                model: "Any Model",
              }))
            }
            placeholder="Any Make"
          />
        </div>

        {/* Model */}
        <div className="flex-1 w-full md:w-auto">
          <CustomDropdown
            options={filteredModels}
            value={searchData.model}
            onChange={(value) => handleInputChange("model", value)}
            placeholder="Any Model"
          />
        </div>

        {/* Year */}
        <div className="flex-1 w-full md:w-auto">
          <CustomDropdown
            options={years}
            value={searchData.year}
            onChange={(value) => handleInputChange("year", value)}
            placeholder="Any Year"
          />
        </div>

        {/* Type */}
        <div className="flex-1 w-full md:w-auto">
          <CustomDropdown
            options={types}
            value={searchData.type}
            onChange={(value) => handleInputChange("type", value)}
            placeholder="Any Type"
          />
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="w-full md:w-auto bg-red text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:bg-maroon"
        >
          Search
        </button>
      </div>
    </div>
  );
}
