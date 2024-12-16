import Link from "next/link";

type ButtonProps = {
  text: string;
};

const ButtonWithoutBackground: React.FC<ButtonProps> = ({ text }) => {
  return (
    <Link href="#" className="text-sm font-semibold leading-6 text-white">
      {text} <span aria-hidden="true">→</span>
    </Link>
  );
};

export default ButtonWithoutBackground;
