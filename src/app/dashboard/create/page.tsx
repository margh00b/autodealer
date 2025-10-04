"use client";

import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { VehicleCreationForm } from "@/components/Dashboard/VehicleCreationForm/VehicleCreationForm";

interface Make {
  id: number;
  name: string;
}

interface Model {
  id: number;
  name: string;
}

const reorder = <T,>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export default function VehicleDashboard() {
  const [images, setImages] = useState<File[]>([]);
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedMake, setSelectedMake] = useState<number | null>(null);

  const dragItemIndex = useRef<number | null>(null);
  const dragOverElement = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch("/api/makes")
      .then((res) => res.json())
      .then(setMakes)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedMake) {
      setModels([]);
      return;
    }

    fetch(`/api/models?makeId=${selectedMake}`)
      .then((res) => res.json())
      .then(setModels);
  }, [selectedMake]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    if (newFiles) {
      const filesArray = Array.from(newFiles);
      setImages((prev) => [...prev, ...filesArray]);
      e.target.value = "";
    }
  };

  const removeFile = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    images.forEach((file) => formData.append("images", file));

    await toast.promise(
      (async () => {
        const res = await fetch("/api/dashboard/create", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create vehicle");

        form.reset();
        setImages([]);
        setSelectedMake(null);
        setModels([]);
        return data;
      })(),
      {
        loading: "🚗 Creating vehicle...",
        success: "✅ Vehicle created successfully!",
        error: (err) => `❌ ${err.message}`,
      }
    );
  };

  const clearDragOverStyles = () => {
    if (dragOverElement.current) {
      dragOverElement.current.classList.remove(
        "border-l-maroon",
        "border-r-maroon",
        "border-l-gray-200",
        "border-r-gray-200"
      );

      dragOverElement.current.classList.add("border-gray-200");
      dragOverElement.current = null;
    }
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    dragItemIndex.current = index;
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.classList.add("opacity-40");
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.preventDefault();
    if (dragItemIndex.current === null || dragItemIndex.current === index)
      return;

    const targetElement = e.currentTarget;
    const rect = targetElement.getBoundingClientRect();
    const x = e.clientX;
    const isOverLeftHalf = x < rect.left + rect.width / 2;

    clearDragOverStyles();

    targetElement.classList.remove("border-gray-200");

    if (isOverLeftHalf) {
      targetElement.classList.add("border-l-maroon", "border-r-gray-200");
    } else {
      targetElement.classList.add("border-r-maroon", "border-l-gray-200");
    }

    dragOverElement.current = targetElement;
  };

  const resetBorderStyles = (element: EventTarget & HTMLDivElement) => {
    element.classList.remove(
      "border-l-maroon",
      "border-r-maroon",
      "border-l-gray-200",
      "border-r-gray-200"
    );

    element.classList.add("border-gray-200");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    clearDragOverStyles();
    resetBorderStyles(e.currentTarget);
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    dropIndex: number
  ) => {
    e.preventDefault();
    const dragIndex = dragItemIndex.current;

    clearDragOverStyles();
    const draggedElement = document.querySelector(".opacity-40");
    if (draggedElement) draggedElement.classList.remove("opacity-40");

    resetBorderStyles(e.currentTarget);

    if (dragIndex === null || dragIndex === dropIndex) {
      dragItemIndex.current = null;
      return;
    }

    const targetElement = e.currentTarget;
    const rect = targetElement.getBoundingClientRect();
    const x = e.clientX;
    const isDropBefore = x < rect.left + rect.width / 2;

    let newIndex = dropIndex;
    if (!isDropBefore) newIndex = dropIndex + 1;
    if (dragIndex < newIndex) newIndex--;

    setImages((prevImages) => reorder(prevImages, dragIndex, newIndex));
    dragItemIndex.current = null;
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("opacity-40");
    clearDragOverStyles();
    resetBorderStyles(e.currentTarget);
    dragItemIndex.current = null;
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold ">Create Vehicle</h1>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-maroon hover:bg-red text-white px-5 py-2.5 rounded-lg font-semibold shadow transition"
        >
          <span className="text-lg">←</span> Back to Dashboard
        </Link>
      </div>
      <VehicleCreationForm
        images={images}
        makes={makes}
        models={models}
        handleSubmit={handleSubmit}
        setSelectedMake={setSelectedMake}
        handleFileChange={handleFileChange}
        removeFile={removeFile}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDragLeave={handleDragLeave}
        handleDrop={handleDrop}
        handleDragEnd={handleDragEnd}
      />
    </div>
  );
}
