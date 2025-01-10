// BudgetPreferencesSection.tsx
"use client";

import { IClientInterface } from "@/models/interfaces/client/client";
import React, { useCallback, useState } from "react";
import PricingGrid from "../../ui/subscribe/pricing-sections";
import { Tier } from "@/types/subscribe";
import { stripeCancelSubscription, stripeCheckout } from "@/lib/stripe";
import ConfirmActionModal, {
  ConfirmActionModalProps,
} from "../../ui/modals/confirm-action-modal";
import { tiers } from "@/constants/constants-objects";

interface SubscriptionsSectionProps {
  clientData: IClientInterface;
}

const SubscriptionsSection: React.FC<SubscriptionsSectionProps> = ({
  clientData,
}) => {
  // Initialize state with data from props
  const [client, setClient] = useState<IClientInterface>(clientData);

  // TODO: get basic tier by default, in the future when implementing other tier update logic e.g. isStripePremiumActive etc.
  const basicTier = tiers.find((t) => t.name === "Basic Plan");
  if (basicTier) {
    basicTier.active = clientData.isStripeBasicActive;
  }
  const [selectedTier, setSelectedTier] = useState<Tier>(basicTier!);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const closeConfirmModal = () => {
    console.log("close confirm modal run");
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
  };

  const [confirmModalProps, setConfirmModalProps] =
    useState<ConfirmActionModalProps>({
      open: false,
      title: "",
      message: "",
      confirmText: "",
      colorScheme: "",
      onConfirm: () => {},
      cancelText: "",
      onClose: () => {
        closeConfirmModal();
      },
      type: "primary",
    });

  const isCancelAction = clientData.isStripeBasicActive;

  const handleSelectTier = async (tier: Tier) => {
    setSelectedTier(tier);
    setConfirmModalProps((prev) => ({
      ...prev,
      open: true,
      title: isCancelAction ? "Cancel Selected Plan" : "Subscribe to Plan",
      message: isCancelAction
        ? "This will cancel your current subscription, are you sure?"
        : `Subscribe to the ${tier.name} plan for ${tier.price}?`,
      confirmText: client.isStripeBasicActive ? "Cancel" : "Subscribe",
      cancelText: "No",
      onConfirm: isCancelAction
        ? handleCancelSubscription
        : handleCheckoutSubscription,
      onCancel: () => {
        console.log("On cancel invoke 1");
        closeConfirmModal();
      },
      colorScheme: "bg-blue-600 hover:bg-blue-500",
      type: "primary",
    }));
  };

  const handleCheckoutSubscription = async () => {
    setIsLoading(true);
    const result = await stripeCheckout(client, selectedTier!.id, false);
    setIsLoading(false);

    if (result.success) {
      setConfirmModalProps({
        open: true,
        title: "Subscription Updated",
        message: "Your subscription has been successfully updated.",
        confirmText: "Okay",
        onConfirm: closeConfirmModal,
        colorScheme: "bg-green-600 hover:bg-green-500",
      });
      setClient({ ...client, isStripeBasicActive: true }); // Update state
    } else {
      setConfirmModalProps((prev) => ({
        ...prev,
        confirmText: "Okay",
        cancelText: "",
        message: `Failed to subscribe: ${
          result.errors?.message || "Unknown error"
        }`,
        colorScheme: "bg-red-600 hover:bg-red-500",
        onConfirm: closeConfirmModal,
      }));
    }
  };

  const handleCancelSubscription = async () => {
    setIsLoading(true);
    const result = await stripeCancelSubscription(client);
    setIsLoading(false);

    if (result.success) {
      setConfirmModalProps({
        open: true,
        title: "Subscription Cancelled",
        message: "Your subscription has been successfully cancelled.",
        confirmText: "Okay",
        onConfirm: closeConfirmModal,
        colorScheme: "bg-green-600 hover:bg-green-500",
      });
      setClient({ ...client, isStripeBasicActive: false }); // Update state
    } else if (result.errors) {
      setConfirmModalProps((prev) => ({
        ...prev,
        message: "Failed to cancel subscription",
        colorScheme: "bg-red-600 hover:bg-red-500",
        confirmText: "Okay",
        cancelText: "",
        onConfirm: closeConfirmModal,
      }));
      console.log(
        `Failed to cancel subscription: ${
          result.errors?.message || "Unknown error"
        }`
      );
    }
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
            <div className="">
              <PricingGrid
                tiers={tiers}
                selectedTier={selectedTier}
                isLoading={isLoading}
                classNames={(...classes) => classes.filter(Boolean).join(" ")}
                buttonText={
                  clientData.isStripeBasicActive ? "Cancel" : "Select Plan"
                }
                onSelectTier={(t) => {
                  handleSelectTier(t);
                }} // Pass callback to PricingGrid
              />
            </div>
          </div>
        </div>
      </div>

      {confirmModalProps.open && <ConfirmActionModal {...confirmModalProps} />}
    </>
  );
};

export default SubscriptionsSection;
