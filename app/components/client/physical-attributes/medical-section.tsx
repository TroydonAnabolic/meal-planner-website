// MedicalSection.tsx
"use client";

import { IClientInterface } from "@/models/interfaces/client/client";
import React, { useState } from "react";
import { useFormState } from "react-dom";
import Labels from "../../labels";
import { saveMedical } from "@/actions/client-settings-action";
import FormButton from "../../ui/buttons/form-button";
import TextInputWithButton from "../../text-input-with-buttons";

type MedicalSectionProps = {
  clientData: IClientInterface;
};

const MedicalSection: React.FC<MedicalSectionProps> = ({ clientData }) => {
  // Initialize state with data from props
  const [formData, formAction, isPending] = useFormState(saveMedical, {
    errors: {},
  });
  const [medicalConditionsArr, setMedicalConditionsArr] = useState<string[]>(
    []
  );
  const [medicationsAndSupplementsArr, setMedicationsAndSupplementsArr] =
    useState<string[]>([]);

  const [avoidedFoodsArr, setAvoidedFoodsArr] = useState<string[]>([]);

  const handleTextInputWithBtn = (value: string, type: string) => {
    if (type === "medicalConditions") {
      setMedicalConditionsArr([...medicalConditionsArr, value]);
    } else if (type === "medicationsAndSupplements") {
      setMedicationsAndSupplementsArr([...medicationsAndSupplementsArr, value]);
    } else if (type === "avoidedFoods") {
      setAvoidedFoodsArr([...avoidedFoodsArr, value]);
    }
  };

  const handleLabelClick = (item: string, type: string) => {
    if (type === "medicalConditions") {
      setMedicalConditionsArr(medicalConditionsArr.filter((i) => i !== item));
    } else if (type === "medicationsAndSupplements") {
      setMedicationsAndSupplementsArr(
        medicationsAndSupplementsArr.filter((i) => i !== item)
      );
    } else if (type === "avoidedFoods") {
      setAvoidedFoodsArr(avoidedFoodsArr.filter((i) => i !== item));
    }
  };

  return (
    <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8">
      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-800">
          Medical
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-400">
          Please enter any medical details.
        </p>
      </div>
      <form action={formAction} className="md:col-span-2">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          {/* Medical Conditions */}
          <div className="col-span-full">
            <label
              htmlFor="medical-conditions"
              className="block text-sm font-medium leading-6 text-gray-800"
            >
              Medical Conditions
            </label>
            <TextInputWithButton
              label="Medical Conditions"
              placeholder="Enter medical condition and press Add"
              buttonText="Add"
              onButtonPress={handleTextInputWithBtn}
              type="medicalConditions"
            />
            <Labels
              items={medicalConditionsArr}
              onLabelClick={(item) =>
                handleLabelClick(item, "medicalConditions")
              }
            />
          </div>
          {/* Medications and Supplements */}
          <div className="col-span-full">
            <TextInputWithButton
              label="Medications and Supplements"
              placeholder="Enter medication or supplement and press Add"
              buttonText="Add"
              onButtonPress={handleTextInputWithBtn}
              type="medicationsAndSupplements"
            />
            <Labels
              items={medicationsAndSupplementsArr}
              onLabelClick={(item) =>
                handleLabelClick(item, "medicationsAndSupplements")
              }
            />
          </div>
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

export default MedicalSection;
