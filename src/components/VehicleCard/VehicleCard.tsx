"use client";

import { Vehicle } from "@/types/vehicle";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type VehicleCardProps = {
  vehicle: Vehicle;
  onCheckAvailability: (vehicle: Vehicle) => void;
};

export default function VehicleCard({
  vehicle,
  onCheckAvailability,
}: VehicleCardProps) {
  const [images, setImages] = useState<{ url: string }[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [loadingCard, setLoadingCard] = useState(true);
  const router = useRouter();

  const goToFinancing = () => {
    router.push(
      `/forms/financing?vehicleId=${vehicle.id}&make=${vehicle.make.name}&model=${vehicle.model.name}`
    );
  };

  useEffect(() => {
    async function fetchSignedImages() {
      setLoadingImages(true);
      setLoadingCard(true);
      try {
        const firstImage = vehicle.images?.[0];
        const res = await fetch("/api/images/getSignedImages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ images: firstImage ? [firstImage] : [] }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to fetch signed image");
        }

        const signedImages = await res.json();
        setImages(
          signedImages.length ? signedImages : [{ url: "/car-placeholder.png" }]
        );
      } catch (err) {
        console.error("Could not fetch signed images:", err);
        setImages([{ url: "/car-placeholder.png" }]);
      } finally {
        setLoadingImages(false);
        setLoadingCard(false);
      }
    }

    fetchSignedImages();
  }, [vehicle.id]);

  return (
    <div className="max-w-100 rounded-lg shadow-xl bg-white border-thinGrey border-1 flex flex-col overflow-hidden hover:shadow-2xl hover:border-maroon/20 duration-200 ease-in">
      {loadingCard ? (
        // Skeleton Loader
        <div className="animate-pulse w-60 h-130 bg-white border rounded-lg shadow flex flex-col overflow-hidden">
          {/* Image Skeleton */}
          <div className="h-48 w-full bg-gray-300 rounded-t-lg" />

          {/* Title + Price Skeleton */}
          <div className="p-3 flex justify-between items-start">
            <div className="space-y-2 w-2/3">
              <div className="h-6 bg-gray-300 rounded w-3/4" />
              <div className="h-4 bg-gray-300 rounded w-1/2" />
            </div>
            <div className="space-y-1 w-1/3 text-right">
              <div className="h-4 bg-gray-300 rounded w-full" />
              <div className="h-6 bg-gray-300 rounded w-3/4" />
            </div>
          </div>

          {/* Details Skeleton */}
          <div className="p-3 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-full" />
            <div className="h-4 bg-gray-300 rounded w-5/6" />
            <div className="h-4 bg-gray-300 rounded w-2/3" />
            <div className="h-4 bg-gray-300 rounded w-3/4" />
          </div>

          {/* Buttons Skeleton */}
          <div className="p-3 flex gap-2">
            <div className="h-10 bg-gray-300 rounded w-1/2" />
            <div className="h-10 bg-gray-300 rounded w-1/2" />
          </div>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          <section className="divide-y divide-gray-200">
            <Link href={`/vehicles/${vehicle.id}`} className="block">
              {/* Image */}
              <div className="h-fit w-full bg-gray-200 overflow-hidden rounded">
                {loadingImages ? (
                  <div className="animate-pulse h-full w-full bg-gray-300" />
                ) : (
                  <img
                    src={images[0]?.url}
                    alt={`${vehicle.make.name} ${vehicle.model.name}`}
                    className="h-full w-full object-cover rounded"
                  />
                )}
              </div>

              {/* Title + Price Row */}
              <div className="flex divide-x divide-gray-200 items-start p-3">
                <div className="w-full mr-10">
                  <h2 className="font-bold text-lg">
                    {vehicle.make.name} {vehicle.model.name} {vehicle?.trim}
                  </h2>
                  <p className="text-gray-600 font-bold text-sm">
                    {vehicle.model_year} | {vehicle.drive_type} |{" "}
                    {vehicle.doors ? `${vehicle.doors}dr` : ""}
                  </p>
                </div>
                <div className="text-right w-fit">
                  <p className="text-red-500 line-through text-sm">
                    ${vehicle.listed_price.toLocaleString()}
                  </p>
                  {vehicle.discounted_price && (
                    <p className="text-2xl font-bold ">
                      ${vehicle.discounted_price.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom Section: Details */}
              <div className="p-3 space-y-1 text-sm text-gray-600 border-y-1 border-gray-200">
                <p>Odometer: {vehicle.odometer.toLocaleString()} km</p>
                {vehicle.engine && <p>Engine: {vehicle.engine}</p>}
                {vehicle.transmission && (
                  <p>Transmission: {vehicle.transmission}</p>
                )}
                {vehicle.body_type && <p>Body Type: {vehicle.body_type}</p>}
              </div>

              {/* Features Section */}
              {vehicle.features && vehicle.features.length > 0 && (
                <div className="p-3 flex flex-wrap gap-2 overflow-hidden max-h-[3.5rem]">
                  {vehicle.features
                    .slice(0, 1)
                    .map((f: string, idx: number) => (
                      <span
                        key={idx}
                        className="inline-flex bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-sm font-medium 
                               max-w-[calc(100%-6rem)]"
                      >
                        <span className="overflow-hidden whitespace-nowrap text-ellipsis">
                          {f}
                        </span>
                      </span>
                    ))}
                  {vehicle.features.length > 1 && (
                    <span className="inline-flex bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full text-sm font-medium">
                      +{vehicle.features.length - 1} more
                    </span>
                  )}
                </div>
              )}
            </Link>
          </section>

          <section className="text-xs p-3 grid grid-cols-2 gap-2">
            <button
              onClick={() => onCheckAvailability(vehicle)}
              className="cursor-pointer w-full bg-maroon text-white py-4 rounded-lg font-semibold hover:bg-red transition disabled:opacity-50"
            >
              Check Availability
            </button>

            <button
              onClick={goToFinancing}
              className="cursor-pointer w-full bg-darkGrey text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50"
            >
              Apply for Financing
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
