// components/ui/full-card-scroll-container.tsx

import React, { useRef, useEffect, useState, FC } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

type FullCardScrollContainerProps = {
  children: React.ReactNode;
  arrowSizeClass?: string;
  className?: string;
};

const FullCardScrollContainer: React.FC<FullCardScrollContainerProps> = ({
  children,
  arrowSizeClass = "h-6 w-6", // Default arrow size
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [childrenCount, setChildrenCount] = useState(0);

  useEffect(() => {
    setChildrenCount(React.Children.count(children));
  }, [children]);

  const updateScrollStatus = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setIsAtStart(scrollLeft === 0);
    setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", updateScrollStatus);
      updateScrollStatus();
      return () => {
        scrollContainer.removeEventListener("scroll", updateScrollStatus);
      };
    }
  }, [childrenCount]);

  const scrollTo = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cardWidth = container.clientWidth;
    const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
    container.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  // Hide arrows if there's only one or no child
  const showArrows = childrenCount > 1;

  return (
    <div className="relative">
      {/* Left Arrow */}
      {showArrows && !isAtStart && (
        <button
          type="button"
          aria-label="Scroll Left"
          onClick={() => scrollTo("left")}
          className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 transition-opacity duration-200 rounded-full p-2 shadow-md focus:outline-none z-10`}
        >
          <ChevronLeftIcon className={`${arrowSizeClass} text-gray-700`} />
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scroll-snap-x mandatory scroll-smooth scrollbar-hide"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {React.Children.map(children, (child) => (
          <div
            className="flex-shrink-0 scroll-snap-align-start"
            style={{ width: "100%" }} // Remove margin to prevent whitespace
          >
            {child}
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      {showArrows && !isAtEnd && (
        <button
          type="button"
          aria-label="Scroll Right"
          onClick={() => scrollTo("right")}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 transition-opacity duration-200 rounded-full p-2 shadow-md focus:outline-none z-10`}
        >
          <ChevronRightIcon className={`${arrowSizeClass} text-gray-700`} />
        </button>
      )}
    </div>
  );
};

export default FullCardScrollContainer;
