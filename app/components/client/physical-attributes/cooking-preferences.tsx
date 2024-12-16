// CookingAndHealthSection.tsx
"use client";

import { IClientInterface } from "@/models/interfaces/client/client";
import { Session } from "next-auth";
import React, { useState } from "react";
import { useFormState } from "react-dom";
import FreeTimeToCookComponent from "./free-time-to-cook";
import TextInput from "../../ui/inputs/text-input";
import SelectDropdown from "../../ui/inputs/select-dropdown";
import { CookingSkills } from "@/constants/constants-enums";
import { IClientSettingsInterface } from "@/models/interfaces/client/client-settings";
import { saveCookingAndHealth } from "@/actions/client-settings-action";
import FormButton from "../../ui/buttons/form-button";

type CookingAndHealthSectionProps = {
  clientData: IClientInterface;
};

const CookingAndHealthSection: React.FC<CookingAndHealthSectionProps> = ({
  clientData,
}) => {
  const [client, setClient] = useState<IClientInterface>(clientData);

  // Initialize state with data from props
  const [formData, formAction, isPending] = useFormState(
    saveCookingAndHealth.bind(null, client),
    {
      errors: {},
    }
  );
  const [cookingSkills, setCookingSkills] = useState<string>(
    clientData.ClientSettingsDto?.cookingSkills || ""
  );

  const [minutes, seconds] = client.ClientSettingsDto?.freeTimeToCook?.split(
    "."
  ) ?? [0, 0];

  const handleClientSettingsChange = (field: string, value: string) => {
    if (client.ClientSettingsDto) {
      const updatedClientSettingsDto = {
        ...client.ClientSettingsDto,
        [field]: value,
      };

      setClient({
        ...client,
        ClientSettingsDto: updatedClientSettingsDto,
      });
    }
  };

  return (
    <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-800">
          Cooking
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-400">
          Please enter cooking details.
        </p>
      </div>
      <form action={formAction} className="md:col-span-2">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          {/* Cooking Skills */}
          <SelectDropdown
            label="Cooking Skills"
            options={Object.values(CookingSkills)}
            selected={client.ClientSettingsDto?.cookingSkills || ""}
            onChange={(value) =>
              handleClientSettingsChange("cookingSkills", value)
            }
            name="cookingSkills"
            placeholder="Select your cooking skills"
          />
          {/* Free Time to Cook */}
          <FreeTimeToCookComponent
            freeTime={client.ClientSettingsDto?.freeTimeToCook || ""}
            onChange={(value) =>
              handleClientSettingsChange("freeTimeToCook", value ?? "")
            }
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

export default CookingAndHealthSection;
