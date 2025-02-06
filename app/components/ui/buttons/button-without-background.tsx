import Link from "next/link";

type ButtonProps = {
  text: string;
  href: string;
};

const ButtonWithoutBackground: React.FC<ButtonProps> = ({ text, href }) => {
  return (
    <Link href={href} className="text-sm font-semibold leading-6 text-white">
      {text} <span aria-hidden="true">→</span>
    </Link>
  );
};

export default ButtonWithoutBackground;
