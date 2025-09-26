import { Vehicle } from "@/types/vehicle";
import CheckVehicleAvailability from "../Forms/CheckVehicleAvailability/CheckVehicleAvailability";
type VehicleModalProps = {
  vehicle: Vehicle;
  onClose: () => void;
};
export default function VehicleModal({ vehicle, onClose }: VehicleModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay with blur */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-lg p-6 z-10">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-maroon rounded-full px-1  text-white hover:bg-thinGrey hover:text-maroon duration-300 ease-in"
        >
          ✕
        </button>
        <CheckVehicleAvailability
          vehicleId={vehicle.id}
          vehicleMake={vehicle.make.name}
          vehicleModel={vehicle.model.name}
        />
      </div>
    </div>
  );
}
