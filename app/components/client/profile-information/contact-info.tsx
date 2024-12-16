// ContactInfo.tsx
import React, { useState } from "react";
import { IClientInterface } from "@/models/interfaces/client/client";
import SelectDropdown from "../../ui/inputs/select-dropdown";
import PhoneNumberInput from "../../ui/inputs/phone-number-input";
import { Countries } from "@/constants/constants-enums";
import EmailInput from "../../ui/inputs/email-input";

interface ContactInfoProps {
  client: IClientInterface;
  handleInputChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleEmailChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmailVerification: () => void;
  emailVerified: boolean;
}

const ContactInfo: React.FC<ContactInfoProps> = ({
  client,
  handleInputChange,
  handleEmailChange,
  handleEmailVerification,
  emailVerified,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<Countries>(
    client?.Country ? client.Country : Countries.US
  );

  const handleCountryChange = (value: Countries) => {
    setSelectedCountry(value);
    handleInputChange({
      target: {
        name: "Country",
        value: value,
      },
    } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>);
  };

  return (
    <>
      {/* Email */}
      <div className="sm:col-span-4">
        <EmailInput
          name="Email"
          value={client.Email || ""}
          onChange={handleEmailChange}
          required={true}
        />
        {!emailVerified && (
          <button
            type="button"
            onClick={handleEmailVerification}
            className="mt-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Verify Email
          </button>
        )}
      </div>
      {/* Phone Number */}
      <div className="sm:col-span-4">
        <label
          htmlFor="PhoneNumber"
          className="block text-sm font-medium text-gray-800"
        >
          Phone Number
        </label>
        <PhoneNumberInput
          name="PhoneNumber"
          value={client.PhoneNumber || ""}
          onChange={(phone) =>
            handleInputChange({
              target: { name: "PhoneNumber", value: phone },
            } as React.ChangeEvent<HTMLInputElement>)
          }
        />
      </div>
      {/* Address */}
      <div className="sm:col-span-6">
        <label
          htmlFor="Address"
          className="block text-sm font-medium text-gray-800"
        >
          Address
        </label>
        <input
          type="text"
          name="Address"
          id="Address"
          value={client.Address || ""}
          onChange={handleInputChange}
          className="mt-2 block w-full rounded-md border border-gray-300 py-1.5 text-gray-800 shadow-sm focus:ring-2 focus:ring-cyan-500 sm:text-sm"
        />
      </div>
      {/* City */}
      <div className="sm:col-span-3">
        <label
          htmlFor="City"
          className="block text-sm font-medium text-gray-800"
        >
          City
        </label>
        <input
          type="text"
          name="City"
          id="City"
          value={client.City || ""}
          onChange={handleInputChange}
          className="mt-2 block w-full rounded-md border border-gray-300 py-1.5 text-gray-800 shadow-sm focus:ring-2 focus:ring-cyan-500 sm:text-sm"
        />
      </div>
      {/* Suburb */}
      <div className="sm:col-span-3">
        <label
          htmlFor="Suburb"
          className="block text-sm font-medium text-gray-800"
        >
          Suburb
        </label>
        <input
          type="text"
          name="Suburb"
          id="Suburb"
          value={client.Suburb || ""}
          onChange={handleInputChange}
          className="mt-2 block w-full rounded-md border border-gray-300 py-1.5 text-gray-800 shadow-sm focus:ring-2 focus:ring-cyan-500 sm:text-sm"
        />
      </div>
      {/* Post Code */}
      <div className="sm:col-span-3">
        <label
          htmlFor="PostCode"
          className="block text-sm font-medium text-gray-800"
        >
          Post Code
        </label>
        <input
          type="text"
          name="PostCode"
          id="PostCode"
          value={client.PostCode || ""}
          onChange={handleInputChange}
          className="mt-2 block w-full rounded-md border border-gray-300 py-1.5 text-gray-800 shadow-sm focus:ring-2 focus:ring-cyan-500 sm:text-sm"
        />
      </div>
      {/* Country */}
      <div className="sm:col-span-3">
        <SelectDropdown
          label="Country"
          options={Object.values(Countries)}
          selected={selectedCountry}
          onChange={handleCountryChange}
          name="country"
          placeholder="Select your country"
        />
      </div>
    </>
  );
};

export default ContactInfo;
