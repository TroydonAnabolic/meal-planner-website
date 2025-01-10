"use client"; // Needed for client-side hooks like useRouter
import React from "react";
import { useRouter } from "next/navigation"; // Updated import for App Router
import { Tier } from "@/types/subscribe";
import { CheckIcon } from "@heroicons/react/24/outline";

type PricingGridProps = {
  tiers: Tier[];
  classNames: (...classes: (string | false)[]) => string;
  //buttonDisabled: boolean;
  onSelectTier: (tier: Tier) => void; // Callback for tier selection
  selectedTier: Tier | null; // Add this prop
  buttonText?: string;
  isLoading?: boolean;
};

const PricingGrid: React.FC<PricingGridProps> = ({
  tiers,
  classNames,
  //buttonDisabled = false,
  onSelectTier,
  selectedTier, // Add this prop
  buttonText = "Select Plan",
  isLoading = false,
}) => {
  return (
    <div className="flex justify-center gap-6 mt-6">
      {tiers.map((tier) => (
        <div
          key={tier.id}
          className={classNames(
            tier.available
              ? tier.id === selectedTier?.id
                ? "bg-indigo-800 text-white shadow-xl ring-2 ring-indigo-500" // Highlight selected tier
                : "bg-indigo-600 text-white shadow-lg"
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
          <button
            type="button"
            onClick={() => onSelectTier(tier)} // Trigger navigation on button click
            //      disabled={isLoading || !tier.active}
            // disabled={!tier.active} //! TODO: !tier.active -> removed this check if ok in registraiton and from authenticated
            className={classNames(
              tier.available
                ? "mt-6 block w-full px-4 py-2 text-sm font-semibold rounded-md bg-white text-indigo-600 hover:bg-indigo-100"
                : "mt-6 block w-full px-4 py-2 text-sm font-semibold rounded-md bg-gray-400 text-gray-600 pointer-events-none"
            )}
          >
            {isLoading
              ? "Processing..."
              : tier.available
              ? buttonText
              : "Unavailable"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default PricingGrid;
