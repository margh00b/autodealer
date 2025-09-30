/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { Vehicle } from "@/types/vehicle";
import { useEffect, useState } from "react";

interface EditModalProps {
  vehicle: Vehicle;
  onSave: (id: number, updatedData: Partial<Vehicle>) => void | Promise<void>;
  onClose: () => void;
}

interface FieldProps {
  label: string;
  value: any;
  type?: "text" | "number" | "textarea";
  options?: { label: string; value: any }[];
  onChange: (val: any) => void;
}

function FormField({
  label,
  value,
  type = "text",
  options,
  onChange,
}: FieldProps) {
  if (options) {
    return (
      <div className="mb-4 ">
        <label className="block  text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <select
          value={value ?? ""}
          onChange={(e) =>
            onChange(e.target.value === "" ? null : e.target.value)
          }
          className="border border-lightGrey p-2 w-full rounded"
        >
          <option value="">-- Select {label} --</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (type === "textarea") {
    const textareaValue = Array.isArray(value) ? value.join(", ") : value ?? "";
    return (
      <div className="mb-4">
        <label className="block  text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <textarea
          value={textareaValue}
          onChange={(e) => {
            let newValue: string | string[] | null = e.target.value;
            if (label.toLowerCase().includes("feature")) {
              newValue = e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
              if (newValue.length === 0) newValue = null;
            }
            onChange(newValue);
          }}
          className="border border-lightGrey p-2 w-full rounded"
          rows={3}
        />
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) =>
          onChange(
            type === "number"
              ? e.target.value === ""
                ? null
                : Number(e.target.value)
              : e.target.value
          )
        }
        className="border border-lightGrey p-2 w-full rounded"
        placeholder={label}
      />
    </div>
  );
}

export default function VehicleEditModal({
  vehicle,
  onSave,
  onClose,
}: EditModalProps) {
  const [edited, setEdited] = useState<Partial<Vehicle>>(vehicle);
  const [isSaving, setIsSaving] = useState(false);

  const [images, setImages] = useState(vehicle.images || []);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const [makes, setMakes] = useState<{ id: number; name: string }[]>([]);
  const [models, setModels] = useState<{ id: number; name: string }[]>([]);

  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

  async function handleDeleteImage(imageId: number) {
    if (!confirm("Are you sure you want to delete this image?")) return;
    setDeletedImageIds((prev) => [...prev, imageId]);
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  }

  // --- Upload new images ---
  const handleUploadImages = async () => {
    if (newFiles.length === 0) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("vehicleId", vehicle.id.toString());
    newFiles.forEach((file) => formData.append("images", file));

    try {
      const res = await fetch("/api/images/addImages", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");

      const uploadedImages = await res.json();
      setImages((prev) => [...prev, ...uploadedImages]);
      setNewFiles([]);
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsUploading(false);
    }
  };
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/makes");
      setMakes(await res.json());
    })();
  }, []);

  useEffect(() => {
    if (edited.makeId) {
      (async () => {
        const res = await fetch(`/api/models?makeId=${edited.makeId}`);
        setModels(await res.json());
      })();
    }
  }, [edited.makeId]);

  const updateField = (field: keyof Vehicle, value: any) => {
    setEdited((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(vehicle.id, edited);
      if (deletedImageIds.length > 0) {
        const res = await fetch("/api/images/deleteImages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageIds: deletedImageIds }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.message || "Failed to delete images");
        }
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };
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
      } catch (err: any) {
        console.error(err);
        alert("Could not fetch signed images");
      }
    }

    fetchSignedImages();
  }, [vehicle.images]);
  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm  bg-opacity-70 flex justify-center items-center p-4">
      <div className="relative bg-gray-50 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-300 ">
          <h2 className="text-2xl font-bold text-maroon ">
            Edit Vehicle #{vehicle.id}
          </h2>
        </div>

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Make & Model */}
          <FormField
            label="Make"
            value={edited.makeId}
            options={makes.map((m) => ({ label: m.name, value: m.id }))}
            onChange={(v) => {
              updateField("makeId", Number(v));
              updateField("modelId", null);
            }}
          />
          <FormField
            label="Model"
            value={edited.modelId}
            options={models.map((m) => ({ label: m.name, value: m.id }))}
            onChange={(v) => updateField("modelId", Number(v))}
          />

          {/* Core Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="VIN Number"
              value={edited.vin_number}
              onChange={(v) => updateField("vin_number", v)}
            />
            <FormField
              label="Model Year"
              type="number"
              value={edited.model_year}
              onChange={(v) => updateField("model_year", v)}
            />
            <FormField
              label="Trim"
              value={edited.trim}
              onChange={(v) => updateField("trim", v)}
            />
            <FormField
              label="Odometer (km)"
              type="number"
              value={edited.odometer}
              onChange={(v) => updateField("odometer", v)}
            />
            <FormField
              label="Doors"
              type="number"
              value={edited.doors}
              onChange={(v) => updateField("doors", v)}
            />
          </div>

          {/* Pricing & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <FormField
              label="Listed Price"
              type="number"
              value={edited.listed_price}
              onChange={(v) => updateField("listed_price", v)}
            />
            <FormField
              label="Discounted Price"
              type="number"
              value={edited.discounted_price}
              onChange={(v) => updateField("discounted_price", v)}
            />
            <FormField
              label="Status"
              value={edited.status}
              options={[
                { label: "Available", value: "AVAILABLE" },
                { label: "Reserved", value: "RESERVED" },
                { label: "Sold", value: "SOLD" },
                { label: "Pending", value: "PENDING" },
                { label: "Unavailable", value: "UNAVAILABLE" },
              ]}
              onChange={(v) => updateField("status", v)}
            />
          </div>

          {/* Vehicle Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <FormField
              label="Body Type"
              value={edited.body_type}
              options={[
                "CONVERTIBLE",
                "COUPE",
                "HATCHBACK",
                "MINIVAN",
                "SEDAN",
                "SUV",
                "TRUCK",
                "WAGON",
              ].map((v) => ({ label: v, value: v }))}
              onChange={(v) => updateField("body_type", v)}
            />
            <FormField
              label="Drive Type"
              value={edited.drive_type}
              options={["FWD", "RWD", "AWD", "FOURWD"].map((v) => ({
                label: v,
                value: v,
              }))}
              onChange={(v) => updateField("drive_type", v)}
            />
            <FormField
              label="Transmission"
              value={edited.transmission}
              options={["AUTOMATIC", "MANUAL"].map((v) => ({
                label: v,
                value: v,
              }))}
              onChange={(v) => updateField("transmission", v)}
            />
            <FormField
              label="Engine"
              value={edited.engine}
              onChange={(v) => updateField("engine", v)}
            />
            <FormField
              label="Horse Power"
              type="number"
              value={edited.horse_power}
              onChange={(v) => updateField("horse_power", v)}
            />
          </div>

          {/* Fuel & Battery */}
          <h3 className="text-lg font-semibold text-maroon mt-6 mb-2 border-b border-gray-300 ">
            Fuel & Battery
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Fuel Type"
              value={edited.fuel_type}
              options={["PETROL", "DIESEL", "ELECTRIC"].map((v) => ({
                label: v,
                value: v,
              }))}
              onChange={(v) => updateField("fuel_type", v)}
            />
            <FormField
              label="Fuel Capacity (L)"
              type="number"
              value={edited.fuel_capacity}
              onChange={(v) => updateField("fuel_capacity", v)}
            />
            <FormField
              label="Battery Capacity"
              value={edited.battery_capacity}
              onChange={(v) => updateField("battery_capacity", v)}
            />
            <FormField
              label="City Fuel (L/100km)"
              type="number"
              value={edited.city_fuel}
              onChange={(v) => updateField("city_fuel", v)}
            />
            <FormField
              label="Highway Fuel (L/100km)"
              type="number"
              value={edited.hwy_fuel}
              onChange={(v) => updateField("hwy_fuel", v)}
            />
            <FormField
              label="Combined Fuel (L/100km)"
              type="number"
              value={edited.combined_fuel}
              onChange={(v) => updateField("combined_fuel", v)}
            />
          </div>

          {/* Measurements */}
          <h3 className="text-lg font-semibold text-maroon mt-6 mb-2 border-b border-gray-300 ">
            Measurements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Front Legroom (mm)"
              type="number"
              value={edited.front_legroom}
              onChange={(v) => updateField("front_legroom", v)}
            />
            <FormField
              label="Back Legroom (mm)"
              type="number"
              value={edited.back_legroom}
              onChange={(v) => updateField("back_legroom", v)}
            />
            <FormField
              label="Cargo Volume (L)"
              type="number"
              value={edited.cargo_volume}
              onChange={(v) => updateField("cargo_volume", v)}
            />
          </div>

          {/* Colors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <FormField
              label="Exterior Color"
              value={edited.exterior_color}
              onChange={(v) => updateField("exterior_color", v)}
            />
            <FormField
              label="Interior Color"
              value={edited.interior_color}
              onChange={(v) => updateField("interior_color", v)}
            />
          </div>

          {/* Misc & Images */}
          <FormField
            label="Description"
            type="textarea"
            value={edited.description}
            onChange={(v) => updateField("description", v)}
          />
          <FormField
            label="Features (comma separated)"
            type="textarea"
            value={edited.features}
            onChange={(v) => updateField("features", v)}
          />
          <FormField
            label="Internal Comment"
            type="textarea"
            value={edited.comment}
            onChange={(v) => updateField("comment", v)}
          />
          <FormField
            label="Carfax Link/ID"
            value={edited.carfax}
            onChange={(v) => updateField("carfax", v)}
          />

          {/* Images */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Images</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {images.map((img, idx) => (
                <div
                  key={img.id ?? img.key ?? idx}
                  className="relative w-full aspect-square border rounded overflow-hidden group"
                >
                  <img
                    src={img.url}
                    alt="Vehicle"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleDeleteImage(img.id!)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded px-1 text-xs opacity-0 group-hover:opacity-100 transition"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Upload new images */}
          <div className="mb-6">
            <label className="block mb-1 font-medium">Add New Images</label>
            <div
              className="border-2 border-dashed border-gray-400 rounded p-4 text-center cursor-pointer hover:border-maroon transition"
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files)
                  setNewFiles([
                    ...newFiles,
                    ...Array.from(e.dataTransfer.files),
                  ]);
              }}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              {newFiles.length === 0 ? (
                <p>Drag & drop images here, or click to select files</p>
              ) : (
                <div className="flex flex-wrap gap-2 justify-center">
                  {newFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="w-24 h-24 border rounded overflow-hidden relative"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setNewFiles((prev) =>
                            prev.filter((_, i) => i !== idx)
                          );
                        }}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded px-1 text-xs"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <input
                type="file"
                id="fileInput"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files)
                    setNewFiles([...newFiles, ...Array.from(e.target.files)]);
                }}
              />
            </div>
            <button
              onClick={handleUploadImages}
              disabled={newFiles.length === 0 || isUploading}
              className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {/* Read-only metadata */}
          <div className="mt-4 text-sm text-gray-500">
            <p>Created At: {new Date(vehicle.created_at).toLocaleString()}</p>
            <p>Last Updated: {new Date(vehicle.updated_at).toLocaleString()}</p>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="bg-gray-100  px-6 py-4 border-t border-gray-300 flex justify-end gap-3 sticky bottom-0 shadow-inner z-10">
          <button
            onClick={onClose}
            className="bg-gray-300  text-gray-800 px-4 py-2 rounded hover:bg-gray-400  transition"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-maroon text-white px-4 py-2 rounded hover:bg-red transition disabled:opacity-50"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
