"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";

export default function NavbarHome({
  items,
}: {
  items: { href: string; label: string }[];
}) {
  const [scrolled, setScrolled] = useState(false);
  const [initialLeftOffset, setInitialLeftOffset] = useState(0);
  const linkContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    const calculateOffset = () => {
      if (linkContainerRef.current) {
        const rect = linkContainerRef.current.getBoundingClientRect();
        setInitialLeftOffset(rect.left);
      }
    };

    calculateOffset();
    window.addEventListener("resize", calculateOffset);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", calculateOffset);
    };
  }, []);

  const transformValue = scrolled
    ? `translateX(calc(50vw - 50% - ${initialLeftOffset}px))`
    : "translateX(0)";

  return (
    <nav
      className={`fixed z-999 top-0 left-0 w-full transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className={`h-16 flex items-center px-6 md:px-16`}>
        <div
          ref={linkContainerRef}
          className={`flex space-x-10 transition-transform duration-500`}
          style={{
            transform: transformValue,
          }}
        >
          {items.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-2 py-1 font-medium transition-colors duration-300 
    ${
      scrolled
        ? "text-black hover:text-red-500"
        : "text-darkGrey hover:text-red-500"
    }
  `}
            >
              {/* The inner span contains the text and the ::after pseudo-element logic */}
              <span
                className="relative z-10 pb-2
                   after:absolute after:left-0 after:bottom-0 after:w-full 
                   after:border-b-2 after:border-red-500 
                   after:scale-x-0 after:origin-left after:transition-transform 
                   after:duration-300 hover:after:scale-x-100"
              >
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
