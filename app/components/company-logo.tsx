import Image from "next/image";
import Link from "next/link";

const CompanyLogo = () => (
  <Link href="#" className="-m-1.5 p-1.5">
    <span className="sr-only">AI Trainer</span>
    <Image
      src="/aiimages/artificial-intelligence.jpg"
      alt="AI Trainer"
      width={80}
      height={60}
      className="h-8 w-auto"
      priority
    />
  </Link>
);

export default CompanyLogo;
