import Image from "next/image";
import Link from "next/link";

const CompanyLogo = () => (
  <Link href="/" className="m-1.5 p-1.5">
    <span className="sr-only">AI Trainer</span>
    <Image
      src="/meal-planner-logo.png"
      alt="AI Trainer"
      width={100}
      height={100}
      className=""
      priority
    />
  </Link>
);

export default CompanyLogo;
