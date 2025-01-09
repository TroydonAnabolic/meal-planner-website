// BudgetPreferencesSection.tsx
"use client";

import { IClientInterface } from "@/models/interfaces/client/client";
import React, { useCallback, useState } from "react";
import PricingGrid from "../../ui/subscribe/pricing-sections";
import { tiers } from "@/constants/constants-objects";
import { Tier } from "@/types/subscribe";
import { stripeCheckout } from "@/lib/stripe";
import { ConfirmActionModalProps } from "../../ui/modals/confirm-action-modal";

interface SubscriptionsSectionProps {
  clientData: IClientInterface;
}

const SubscriptionsSection: React.FC<SubscriptionsSectionProps> = ({
  clientData,
}) => {
  // Initialize state with data from props
  const [client, setClient] = useState<IClientInterface>(clientData);

  // TODO: get basic tier by default, in the future when implementing other tier update logic e.g. isStripePremiumActive etc.
  const basicTier = tiers.find((t) => t.active);
  if (basicTier) {
    basicTier.active = clientData.isStripeBasicActive;
  }
  const [selectedTier, setSelectedTier] = useState<Tier>(basicTier!);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [confirmModalProps, setConfirmModalProps] =
    useState<ConfirmActionModalProps>({
      open: false,
      title: "",
      message: "",
      confirmText: "",
      colorScheme: "",
      onConfirm: () => {},
      cancelText: "",
      onClose: () => {},
      type: "primary",
    });

  const closeConfirmModal = useCallback(() => {
    setIsLoading(false);
    setConfirmModalProps({
      open: false,
      title: "",
      message: "",
      confirmText: "",
      colorScheme: "",
      onConfirm: () => {},
      cancelText: "",
      onClose: () => {},
      type: "primary",
    });
  }, []);

  const handleSelectTier = async (tier: Tier) => {
    setSelectedTier(tier);
    setConfirmModalProps((prev) => ({
      ...prev,
      open: true,
      title: clientData.isStripeBasicActive
        ? "Cancel Selected Plan"
        : "Confirm Selected Plan",
      message: clientData.isStripeBasicActive
        ? "This will cancel your current subscription, are you sure you want to cancel?"
        : `Are you sure you want to subscribe to the ${tier.price} monthly plan?`,
      confirmText: "Yes",
      cancelText: "No",
      onConfirm: clientData.isStripeBasicActive
        ? handleCancelSubscription
        : handleCheckoutSubscription,
      onCancel: closeConfirmModal,
      colorScheme: "bg-blue-600 hover:bg-blue-500",
      type: "primary",
    }));
  };

  const handleCheckoutSubscription = async () => {
    const result = await stripeCheckout(client, selectedTier.id, false);
  };

  const handleCancelSubscription = async () => {
    const result = await stripeCancelSubscription(
      client,
      selectedTier.id,
      false
    );
  };

  return (
    <>
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-800">
            Subscriptions
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            Your subscriptions here.
          </p>
        </div>

        {/* Subscriptions */}
        <div className="md:col-span-2">
          <div className="">
            {/* Budget Amount */}
            <div className="">
              <PricingGrid
                tiers={tiers}
                classNames={(...classes) => classes.filter(Boolean).join(" ")}
                buttonText={
                  clientData.isStripeBasicActive ? "Cancel" : "Select Plan"
                }
                //buttonDisabled={clientData.isStripeBasicActive}
                onSelectTier={handleSelectTier} // Pass callback to PricingGrid
              />
            </div>
          </div>
          {/* <div className="mt-8 flex">
            <button
              className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              onClick={}
            >
              Save
            </button>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default SubscriptionsSection;
