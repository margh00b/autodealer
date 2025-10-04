"use client";

import { useEffect } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { usePrevNextButtons } from "./EmblaCarouselArrowButtons";

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

  // Recalculate carousel once all images are loaded
  useEffect(() => {
    if (!emblaApi) return;

    const imgs =
      document.querySelectorAll<HTMLImageElement>(".embla__slide img");
    let loadedCount = 0;

    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === imgs.length) emblaApi.reInit();
    };

    imgs.forEach((img) => {
      if (img.complete) {
        checkAllLoaded();
      } else {
        img.addEventListener("load", checkAllLoaded);
        img.addEventListener("error", checkAllLoaded); // handle broken images
      }
    });
  }, [emblaApi, images]);

  return (
    <section className="embla relative mx-auto mt-10 mb-10">
      <div className="embla__viewport overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex">
          {images.map((item) => (
            <div
              key={item.id}
              className="embla__slide flex-[0_0_45%] mx-2 flex justify-center items-center "
            >
              <img
                className="w-full h-full object-contain rounded max-h-[400px]"
                src={item.url}
                alt={item.title || "Vehicle Image"}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Prev Button */}
      <button
        className="absolute top-1/2 left-2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white text-gray-700 shadow-lg hover:bg-gray-100 disabled:opacity-50"
        onClick={onPrevButtonClick}
        disabled={prevBtnDisabled}
      >
        ◀
      </button>

      {/* Next Button */}
      <button
        className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white text-gray-700 shadow-lg hover:bg-gray-100 disabled:opacity-50"
        onClick={onNextButtonClick}
        disabled={nextBtnDisabled}
      >
        ▶
      </button>
    </section>
  );
}
