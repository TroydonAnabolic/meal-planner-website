// BudgetPreferencesSection.tsx
"use client";

import { saveBudgetConstraints } from "@/actions/client-settings-action";
import { IClientInterface } from "@/models/interfaces/client/client";
import React, { useState } from "react";
import { useFormState } from "react-dom";
import FormButton from "../../ui/buttons/form-button";
import { Frequency } from "@/constants/constants-enums";
import SelectDropdown from "../../ui/inputs/select-dropdown";

interface BudgetPreferencesSectionProps {
  clientData: IClientInterface;
}

const BudgetPreferencesSection: React.FC<BudgetPreferencesSectionProps> = ({
  clientData,
}) => {
  // Initialize state with data from props
  const [client, setClient] = useState<IClientInterface>(clientData);
  const [formData, formAction, isPending] = useFormState(
    saveBudgetConstraints.bind(null, client),
    {
      errors: {},
    }
  );
  const [selectedFrequency, setSelectedFrequency] = useState<Frequency>(
    client?.ClientSettingsDto?.budgetConstraints?.frequency
      ? client?.ClientSettingsDto?.budgetConstraints.frequency
      : Frequency.Weekly
  );

  return (
    <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-800">
          Budget Constraints
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-400">
          Please enter your budget constraints.
        </p>
      </div>
      <form action={formAction} className="md:col-span-2">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          {/* Budget Amount */}
          <div className="sm:col-span-3">
            <label
              htmlFor="budget-amount"
              className="block text-sm font-medium leading-6 text-gray-800"
            >
              Amount
            </label>
            <input
              type="number"
              name="budget-amount"
              id="budget-amount"
              className="mt-2 block w-full rounded-md border border-gray-300 py-1.5 text-gray-800 shadow-sm focus:ring-2 focus:ring-cyan-500 sm:text-sm"
            />
          </div>
          {/* Budget Frequency */}
          <div className="sm:col-span-3">
            <SelectDropdown
              label="Frequency"
              options={Object.values(Frequency)}
              selected={selectedFrequency}
              onChange={setSelectedFrequency}
              name="frequency"
              placeholder="Select frequency"
            />
          </div>
        </div>
        <div className="mt-8 flex">
          <FormButton
            isPending={isPending}
            buttonText="Save"
            buttonPendingText="Saving..."
          />
        </div>
      </form>
    </div>
  );
};

export default BudgetPreferencesSection;
