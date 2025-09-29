"use client"; // required if using hooks in Next.js 13+ app directory

import { EmblaOptionsType } from "embla-carousel";
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";
import useEmblaCarousel from "embla-carousel-react";

type Slide = {
  image: string;
  title: string;
  onClick?: () => void;
  isActive?: boolean;
};

type EmblaCarouselProps = {
  slides: Slide[];
  options?: EmblaOptionsType;
};

export default function EmblaCarousel({ slides, options }: EmblaCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <section className="embla mx-auto mt-30 mb-10">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((item) => (
            <div
              key={item.title}
              onClick={item.onClick}
              className={`embla__slide  cursor-pointer text-center transition-all duration-200 m-2 p-6! rounded-lg
                ${
                  item.isActive
                    ? " bg-red-50"
                    : " hover:scale-105 hover:shadow-sm"
                }`}
            >
              <img
                className="w-7/12 mx-auto object-contain"
                src={item.image}
                alt={item.title}
              />
              <p
                className={`mt-3 text-sm font-bold ${
                  item.isActive ? "text-maroon" : "text-gray-700"
                }`}
              >
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
      <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
      <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
    </section>
  );
}
