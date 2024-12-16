// components/ui/horizontal-scroll-container.tsx

import React, { useRef, useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

interface HorizontalScrollContainerProps {
  children: React.ReactNode;
}

const HorizontalScrollContainer: React.FC<HorizontalScrollContainerProps> = ({
  children,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolledLeft, setIsScrolledLeft] = useState(true);
  const [isScrolledRight, setIsScrolledRight] = useState(false);

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setIsScrolledLeft(scrollLeft === 0);
    setIsScrolledRight(scrollLeft + clientWidth >= scrollWidth - 1);
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScroll);
      checkScroll();
      return () => {
        scrollContainer.removeEventListener("scroll", checkScroll);
      };
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.5; // Scroll half the container's width
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative">
      {/* Left Arrow */}
      {!isScrolledLeft && (
        <button
          type="button"
          title="Scroll Left"
          aria-label="Scroll Left"
          onClick={() => scroll("left")}
          disabled={isScrolledLeft}
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-50 bg-opacity-75 hover:bg-opacity-100 transition-opacity duration-200 rounded-full p-2 shadow-md focus:outline-none z-50 ${
            isScrolledLeft ? "fade-out" : "fade-in"
          }`}
        >
          <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide relative"
      >
        {children}
      </div>

      {/* Right Arrow */}
      {!isScrolledRight && (
        <button
          type="button"
          title="Scroll Right"
          aria-label="Scroll Right"
          onClick={() => scroll("right")}
          disabled={isScrolledRight}
          className={`absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-50 bg-opacity-75 hover:bg-opacity-100 transition-opacity duration-200 rounded-full p-2 shadow-md focus:outline-none z-50 ${
            isScrolledRight ? "fade-out" : "fade-in"
          }`}
        >
          <ChevronRightIcon className="h-6 w-6 text-gray-700" />
        </button>
      )}
    </div>
  );
};

export default HorizontalScrollContainer;
