// BiometricsSection.tsx
"use client";

import { IClientInterface } from "@/models/interfaces/client/client";
import React, { useState } from "react";
import { useFormState } from "react-dom";
import TextInput from "../../ui/inputs/text-input";
import { saveBiometrics } from "@/actions/client-settings-action";
import FormButton from "../../ui/buttons/form-button";

type BiometricsSectionProps = {
  clientData: IClientInterface;
};

const BiometricsSection: React.FC<BiometricsSectionProps> = ({
  clientData,
}) => {
  // Initialize state with data from props
  const [client, setClient] = useState<IClientInterface>(clientData);
  const [formData, formAction, isPending] = useFormState(
    saveBiometrics.bind(null, client),
    {
      errors: {},
    }
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setClient({
      ...client,
      [name]: value,
    });
  };

  return (
    <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-800">
          Biometrics
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-400">
          Enter your physical attributes.
        </p>
      </div>
      <form action={formAction} className="md:col-span-2">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          {/* Height */}
          <TextInput
            id="Height"
            name="Height"
            type="number"
            label="Height (cm)"
            placeholder="Enter your height"
            required={false}
            value={client.Height || 0}
            onChange={handleInputChange}
            containerClassName="sm:col-span-2"
          />
          {/* Weight */}
          <TextInput
            id="BodyWeight"
            name="BodyWeight"
            type="number"
            label="Weight (kg)"
            placeholder="Enter your weight"
            required={false}
            value={client.BodyWeight || ""}
            onChange={handleInputChange}
            containerClassName="sm:col-span-2"
          />
          {/* Body Fat Percentage */}
          <TextInput
            id="Bodyfat"
            name="Bodyfat"
            type="number"
            label="Body Fat Percentage (%)"
            placeholder="Enter your body fat percentage"
            required={false}
            value={client.Bodyfat || ""}
            onChange={handleInputChange}
            containerClassName="sm:col-span-2"
          />
        </div>

        {formData?.errors && (
          <ul id="form-errors" className="text-red-700">
            {Object.keys(formData.errors).map((error) => (
              <li key={error}>{formData.errors![error]}</li>
            ))}
          </ul>
        )}
        {formData?.success && (
          <div className="text-green-700">Biometrics changed successfully!</div>
        )}
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

export default BiometricsSection;
