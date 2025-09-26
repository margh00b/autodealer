"use client";

import { useRef, useState, useEffect } from "react";

interface Props {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (val: [number, number]) => void;
}

export default function PriceSlider({
  min,
  max,
  step = 1000,
  value,
  onChange,
}: Props) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<null | "min" | "max">(null);

  // Convert value to percentage for positioning
  const percent = (val: number) => ((val - min) / (max - min)) * 100;

  const handleMouseMove = (e: MouseEvent) => {
    if (!sliderRef.current || !dragging) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    let newVal =
      Math.round(((x / rect.width) * (max - min) + min) / step) * step;

    if (dragging === "min") {
      newVal = Math.min(newVal, value[1] - step);
      newVal = Math.max(newVal, min);
      onChange([newVal, value[1]]);
    } else if (dragging === "max") {
      newVal = Math.max(newVal, value[0] + step);
      newVal = Math.min(newVal, max);
      onChange([value[0], newVal]);
    }
  };

  useEffect(() => {
    const stopDrag = () => setDragging(null);
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [dragging, value]);

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>${value[0].toLocaleString()}</span>
        <span>
          {value[1] === max ? "Max" : `$${value[1].toLocaleString()}`}
        </span>
      </div>

      <div
        ref={sliderRef}
        className="relative h-2 bg-gray-300 rounded cursor-pointer"
        onClick={(e) => {
          const rect = sliderRef.current!.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const clickedValue =
            Math.round(((x / rect.width) * (max - min) + min) / step) * step;
          const distMin = Math.abs(clickedValue - value[0]);
          const distMax = Math.abs(clickedValue - value[1]);
          if (distMin < distMax) onChange([clickedValue, value[1]]);
          else onChange([value[0], clickedValue]);
        }}
      >
        {/* Selected Range */}
        <div
          className="absolute h-2 bg-red-600 rounded"
          style={{
            left: `${percent(value[0])}%`,
            width: `${percent(value[1]) - percent(value[0])}%`,
          }}
        />

        {/* Min Thumb */}
        <div
          className="absolute w-5 h-5 bg-white border-2 border-red-600 rounded-full -top-1.5 -translate-x-1/2 cursor-pointer flex items-center justify-center"
          style={{ left: `${percent(value[0])}%` }}
          onMouseDown={() => setDragging("min")}
        />

        {/* Max Thumb */}
        <div
          className="absolute w-5 h-5 bg-white border-2 border-red-600 rounded-full -top-1.5 -translate-x-1/2 cursor-pointer flex items-center justify-center"
          style={{ left: `${percent(value[1])}%` }}
          onMouseDown={() => setDragging("max")}
        />
      </div>
    </div>
  );
}
