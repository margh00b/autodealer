import FinancingCalculator from "@/components/FinancingCalculator/FinancingCalculator";
import CheckVehicleAvailability from "@/components/Forms/CheckVehicleAvailability/CheckVehicleAvailability";

export default function VehiclePricing({
  pricing,
  vehicle,
}: {
  pricing: { listedPrice: number; discountedPrice?: number };
  vehicle: { id: string; listed_price: number; discounted_price?: number };
}) {
  const { listedPrice, discountedPrice } = pricing;

  return (
    <div className="p-6 w-1/4 ml-10 rounded-3xl h-fit bg-thinGrey relative">
      {/* Pricing Pill - absolutely positioned */}
      <div className="absolute w-3/4 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg px-6 py-4 text-center flex flex-col items-center">
        <ul className="space-y-1">
          <li className="text-red-500 line-through">
            ${listedPrice.toLocaleString()}
          </li>
          {discountedPrice && (
            <li className="text-2xl font-bold">
              ${discountedPrice.toLocaleString()}
            </li>
          )}
        </ul>
      </div>

      {/* Availability Form */}
      <div className="mt-12">
        <CheckVehicleAvailability
          vehicleId={Number(vehicle.id)}
          vehicleMake=""
          vehicleModel=""
        />
      </div>

      <div className="mt-12">
        <FinancingCalculator
          price={vehicle.discounted_price ?? vehicle.listed_price}
        />
      </div>
    </div>
  );
}
