import { Tier } from "@/types/subscribe";
import { CheckIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import PricingGrid from "../components/ui/subscribe/pricing-sections";
import { tiers } from "@/constants/constants-objects";

type Props = {};

function classNames(...classes: (string | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

const PremiumPlan = (props: Props) => {
  return (
    <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      {/* Pricing section */}
      <div className="relative isolate mt-32 bg-white px-6 sm:mt-56 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
          />
        </div>
        <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            Pricing
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choose the right plan for your meal planning needs
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          Our meal plan generator offers a variety of plans to suit your dietary
          preferences and lifestyle. Select a plan that fits your needs and
          start your journey towards healthier eating today.
        </p>
        <PricingGrid tiers={tiers} classNames={classNames} showLink={true} />;
      </div>
    </main>
  );
};

export default PremiumPlan;
