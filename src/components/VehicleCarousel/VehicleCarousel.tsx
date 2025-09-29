"use client";

import { EmblaOptionsType } from "embla-carousel";
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";
import useEmblaCarousel from "embla-carousel-react";

type Slide = {
  id: string;
  url: string;
  title?: string;
};

type EmblaCarouselProps = {
  images: Slide[];
  options?: EmblaOptionsType;
};

export default function VehicleCarousel({
  images,
  options,
}: EmblaCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <section className="embla relative mx-auto mt-10 mb-10">
      <div className="embla__viewport overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex">
          {images.map((item) => (
            <div
              className="embla__slide flex-[0_0_45%] mx-2 flex justify-center items-center"
              key={item.id}
            >
              <img
                className="w-full max-h-[400px] object-contain rounded"
                src={item.url}
                alt={item.title || "Vehicle Image"}
              />
            </div>
          ))}
        </div>
      </div>
      {/* Nav buttons */}
      <button
        className="absolute top-1/2 left-2 -translate-y-1/2 
             flex items-center justify-center
             w-10 h-10 rounded-full 
             bg-white text-gray-700 shadow-lg
             hover:bg-gray-100 disabled:opacity-50"
        onClick={onPrevButtonClick}
        disabled={prevBtnDisabled}
      >
        ◀
      </button>

      <button
        className="absolute top-1/2 right-2 -translate-y-1/2 
             flex items-center justify-center
             w-10 h-10 rounded-full 
             bg-white text-gray-700 shadow-lg
             hover:bg-gray-100 disabled:opacity-50"
        onClick={onNextButtonClick}
        disabled={nextBtnDisabled}
      >
        ▶
      </button>
    </section>
  );
}
