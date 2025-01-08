import React from "react";
import Link from "next/link";
import { Tier } from "@/types/subscribe";
import { CheckIcon } from "@heroicons/react/24/outline";

type PricingGridProps = {
  tiers: Tier[];
  classNames: (...classes: (string | false)[]) => string;
  onSelectTier: (tier: Tier) => void; // Callback for tier selection
};

const PricingGrid: React.FC<PricingGridProps> = ({
  tiers,
  classNames,
  onSelectTier,
}) => {
  return (
    <div className="flex justify-center gap-6 mt-6">
      {tiers.map((tier) => (
        <div
          key={tier.id}
          className={classNames(
            tier.active
              ? "bg-indigo-600 text-white shadow-lg"
              : "bg-gray-200 text-gray-500 cursor-not-allowed opacity-60",
            "rounded-lg p-6 ring-1 ring-gray-900/10 w-80 text-center"
          )}
        >
          <h3 className="text-lg font-semibold">{tier.name}</h3>
          <p className="mt-2 text-2xl font-bold">{tier.price}</p>
          <p className="mt-1 text-sm">{tier.description}</p>
          <ul className="mt-4 space-y-2">
            {tier.features.map((feature) => (
              <li
                key={feature}
                className="flex items-center justify-center gap-2"
              >
                <CheckIcon className="w-5 h-5 text-indigo-400" />
                {feature}
              </li>
            ))}
          </ul>
          <Link
            href={tier.href}
            onClick={() => onSelectTier(tier)} // Trigger selection callback
            aria-disabled={!tier.active}
            className={classNames(
              tier.active
                ? "mt-6 block px-4 py-2 text-sm font-semibold rounded-md bg-white text-indigo-600 hover:bg-indigo-100"
                : "mt-6 block px-4 py-2 text-sm font-semibold rounded-md bg-gray-400 text-gray-600 pointer-events-none"
            )}
          >
            {tier.active ? "Select Plan" : "Unavailable"}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default PricingGrid;
