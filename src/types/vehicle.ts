export type Vehicle = {
  id: number;
  vin_number: string;
  model_year: number;
  trim?: string;
  description?: string;

  // Pricing
  listed_price: number;
  discounted_price?: number;

  // Status
  status?: string; // OPEN, SOLD, etc.

  // Basic vehicle details
  odometer: number;
  body_type?: string;
  doors?: number;
  drive_type?: string;
  transmission?: string;
  engine?: string;
  horse_power?: number;

  // Fuel & battery
  fuel_type?: string;
  fuel_capacity?: number; // liters
  city_fuel?: number; // L/100km
  hwy_fuel?: number; // L/100km
  combined_fuel?: number; // L/100km
  battery_capacity?: string; // e.g., "1 kWh"

  // Colors
  exterior_color?: string;
  interior_color?: string;

  // Measurements
  front_legroom?: number; // mm
  back_legroom?: number; // mm
  cargo_volume?: number; // liters

  // Features
  features?: string[];

  // Misc metadata
  carfax?: string;
  comment?: string;
  created_at: string; // ISO string
  updated_at: string; // ISO string

  // Relations
  makeId: number;
  modelId: number;
  make: { name: string };
  model: { name: string };
  images: { id: number; url: string; key: string }[];
  availabilityForms?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    createdAt: string; // ISO string
  }[];
};
