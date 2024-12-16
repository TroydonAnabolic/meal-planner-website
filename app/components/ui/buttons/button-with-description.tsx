import Link from "next/link";

type ButtonProps = {
  description: string;
  text: string;
};

const ButtonWithDescription: React.FC<ButtonProps> = ({
  description,
  text,
}) => {
  return (
    <div className="hidden sm:mb-8 sm:flex sm:justify-center">
      <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-400 ring-1 ring-white/10 hover:ring-white/20">
        {description}{" "}
        <a href="#" className="font-semibold text-white">
          <span aria-hidden="true" className="absolute inset-0" />
          {text} <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </div>
  );
};

export default ButtonWithDescription;
