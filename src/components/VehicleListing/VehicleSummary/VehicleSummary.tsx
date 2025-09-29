import VehicleCarousel from "@/components/VehicleCarousel/VehicleCarousel";
import { Vehicle } from "@/types/vehicle";
import type { EmblaOptionsType } from "embla-carousel";
import { useEffect, useState } from "react";

export default function VehicleSummary({ vehicle }: { vehicle: Vehicle }) {
  const OPTIONS: EmblaOptionsType = { align: "start" };

  // helper component for sections
  const SectionCard = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-white rounded-xl shadow-md p-4 mt-6">{children}</div>
  );
  const [images, setImages] = useState([]);
  useEffect(() => {
    async function fetchSignedImages() {
      if (!vehicle.images || vehicle.images.length === 0) return;

      try {
        const res = await fetch("/api/images/getSignedImages", {
          method: "POST",
          body: JSON.stringify({ images: vehicle.images }),
        });
        const signedImages = await res.json();
        setImages(signedImages);
      } catch (err) {
        console.error(err);
        alert("Could not fetch signed images");
      }
    }

    fetchSignedImages();
  }, [vehicle.images]);
  return (
    <div className="p-6  w-3/4 bg-thinGrey rounded-3xl">
      {/* Title */}
      <h1 className="text-3xl font-bold">
        {vehicle.make.name} {vehicle.model.name} ({vehicle.model_year})
      </h1>
      <p className="text-gray-600 mt-2">VIN: {vehicle.vin_number}</p>
      <p className="text-gray-600">Stock #: {vehicle.id}</p>
      <VehicleCarousel images={images} options={OPTIONS} />

      {/* Description */}
      {vehicle.description && (
        <SectionCard>
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="whitespace-pre-line">{vehicle.description}</p>
        </SectionCard>
      )}

      {/* Highlights */}
      <SectionCard>
        <h2 className="text-xl font-semibold mb-2">Highlights</h2>
        <ul className="space-y-1">
          <li>Odometer: {vehicle.odometer.toLocaleString()} km</li>
          <li>Body Type: {vehicle.body_type}</li>
          <li>Doors: {vehicle.doors}</li>
          <li>Drive Type: {vehicle.drive_type}</li>
          <li>Transmission: {vehicle.transmission}</li>
          <li>Engine: {vehicle.engine}</li>
          {vehicle.horse_power && <li>Horsepower: {vehicle.horse_power} hp</li>}
        </ul>
      </SectionCard>

      {/* Fuel & Battery */}
      <SectionCard>
        <h2 className="text-xl font-semibold mb-2">Fuel & Battery</h2>
        <ul className="space-y-1">
          <li>Fuel Type: {vehicle.fuel_type}</li>
          {vehicle.fuel_capacity && (
            <li>Fuel Capacity: {vehicle.fuel_capacity} L</li>
          )}
          {vehicle.city_fuel && (
            <li>City Fuel Economy: {vehicle.city_fuel} L/100km</li>
          )}
          {vehicle.hwy_fuel && (
            <li>Highway Fuel Economy: {vehicle.hwy_fuel} L/100km</li>
          )}
          {vehicle.combined_fuel && (
            <li>Combined: {vehicle.combined_fuel} L/100km</li>
          )}
          {vehicle.battery_capacity && (
            <li>Battery: {vehicle.battery_capacity}</li>
          )}
        </ul>
      </SectionCard>

      {/* Colors */}
      <SectionCard>
        <h2 className="text-xl font-semibold mb-2">Colors</h2>
        <ul className="space-y-1">
          <li>Exterior: {vehicle.exterior_color}</li>
          <li>Interior: {vehicle.interior_color}</li>
        </ul>
      </SectionCard>

      {/* Measurements */}
      <SectionCard>
        <h2 className="text-xl font-semibold mb-2">Measurements</h2>
        <ul className="space-y-1">
          {vehicle.front_legroom && (
            <li>Front Legroom: {vehicle.front_legroom} mm</li>
          )}
          {vehicle.back_legroom && (
            <li>Rear Legroom: {vehicle.back_legroom} mm</li>
          )}
          {vehicle.cargo_volume && (
            <li>Cargo Volume: {vehicle.cargo_volume} L</li>
          )}
        </ul>
      </SectionCard>

      {/* Features */}
      <SectionCard>
        <h2 className="text-xl font-semibold mb-2">Features</h2>
        <div className="flex flex-wrap gap-2">
          {(vehicle.features ?? []).map((f: string, idx: number) => (
            <span
              key={idx}
              className="inline-flex bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-sm font-medium"
            >
              {f}
            </span>
          ))}
        </div>
      </SectionCard>

      {/* Additional Info */}
      <SectionCard>
        <h2 className="text-xl font-semibold mb-2">Additional Info</h2>
        <a href={`${vehicle.carfax}`}>
          <img src={"/carfax.png"} />
        </a>
        {vehicle.comment && <p>Comment: {vehicle.comment}</p>}
      </SectionCard>
    </div>
  );
}
