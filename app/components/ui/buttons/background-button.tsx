import Link from "next/link";

type ButtonProps = {
  text: string;
  href: string;
};

const BackgroundButton: React.FC<ButtonProps> = ({ text, href }) => {
  return (
    <Link
      href={href}
      className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
    >
      {text}
    </Link>
  );
};

export default BackgroundButton;
