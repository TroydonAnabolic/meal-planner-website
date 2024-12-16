type CardsWithDetailsContainerProps = {
  title: string; // Add title prop
  subtitle?: string; // Add optional subtitle prop
  children?: React.ReactNode; // Add children prop
};

const CardsWithDetailsContainer: React.FC<CardsWithDetailsContainerProps> = ({
  title, // Destructure title
  subtitle, // Destructure subtitle
  children,
}) => {
  return (
    <div className="flex-1 mx-auto max-w-7xl px-4 mb-8 sm:px-6 sm:py-4 lg:max-w-7xl lg:px-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
      {subtitle && <h3 className="text-xl text-gray-600 mb-6">{subtitle}</h3>}

      <div className="overflow-y-auto grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
        {children}
      </div>
    </div>
  );
};

export default CardsWithDetailsContainer;
