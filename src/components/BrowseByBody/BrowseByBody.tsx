"use client";

import EmblaCarousel from "../EmblaCarousel/Carousel";
import { EmblaOptionsType } from "embla-carousel";
import "../EmblaCarousel/css/embla.css";
import { Filters } from "@/components/VehicleFilterbar/VehicleFilterbar";

type BrowseByBodyProps = {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
};

export default function BrowseByBody({
  filters,
  setFilters,
}: BrowseByBodyProps) {
  const OPTIONS: EmblaOptionsType = { align: "start" };

  const SLIDES = [
    { image: "/BodyTypes/SUV.svg", title: "SUV" },
    { image: "/BodyTypes/Truck.svg", title: "Truck" },
    { image: "/BodyTypes/Sedan.svg", title: "Sedan" },
    { image: "/BodyTypes/Coupe.svg", title: "Coupe" },
    { image: "/BodyTypes/Minivan.svg", title: "Minivan" },
    { image: "/BodyTypes/Hatchback.svg", title: "Hatchback" },
    { image: "/BodyTypes/Convertible.svg", title: "Convertible" },
    { image: "/BodyTypes/Wagon.svg", title: "Wagon" },
  ];

  const slidesWithHandlers = SLIDES.map((slide) => ({
    ...slide,
    isActive: filters.bodyType === slide.title,
    onClick: () => {
      setFilters((prev) => ({
        ...prev,
        bodyType: prev.bodyType === slide.title ? "" : slide.title,
      }));
    },
  }));

  return (
    <div>
      <EmblaCarousel slides={slidesWithHandlers} options={OPTIONS} />
    </div>
  );
}
