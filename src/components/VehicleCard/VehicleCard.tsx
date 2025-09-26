import { Vehicle } from "@/types/vehicle";
import Link from "next/link";

type VehicleCardProps = {
  vehicle: Vehicle;
  onCheckAvailability: (vehicle: Vehicle) => void;
};
export default function VehicleCard({
  vehicle,
  onCheckAvailability,
}: VehicleCardProps) {
  return (
    <div className="max-w-100 rounded-lg shadow-xl bg-white border-thinGrey border-1 flex flex-col overflow-hidden  hover:shadow-2xl hover:border-maroon/20 duration-200 ease-in">
      <div className="divide-y divide-gray-200">
        <section className="divide-y divide-gray-200">
          <Link href={`/vehicles/${vehicle.id}`} className="block">
            {/* Image */}
            <div className="">
              <img
                src={"/honda.jpg"}
                alt={`${vehicle.make.name} ${vehicle.model.name}`}
                className="h-full w-full object-cover rounded"
              />
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
            <div className="p-3 space-y-1 text-sm text-gray-600">
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
                {vehicle.features.slice(0, 1).map((f: string, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-sm font-medium"
                  >
                    {f}
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
        <section>
          {/* Check Availability Button */}
          <div className="p-3">
            <button
              onClick={() => onCheckAvailability(vehicle)}
              className="w-full bg-maroon text-white py-2 rounded-lg font-semibold hover:bg-red transition disabled:opacity-50"
            >
              Check Availability
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
