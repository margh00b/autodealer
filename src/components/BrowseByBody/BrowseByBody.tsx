"use client";

import EmblaCarousel from "../EmblaCarousel/Carousel";
import { EmblaOptionsType } from "embla-carousel";
import "../EmblaCarousel/css/embla.css";
import { testR2Connection } from "@/lib/r2-client";

export default function BrowseByBody() {
  const handleTest = async () => {
    const res = await fetch("/api/test-r2");
    const data = await res.json();
    console.log("Connection success:", data.success);
  };

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

  return (
    <div>
      <EmblaCarousel slides={SLIDES} options={OPTIONS} />
    </div>
  );
}
