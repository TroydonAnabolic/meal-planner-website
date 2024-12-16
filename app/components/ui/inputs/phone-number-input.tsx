// PhoneNumberInput.tsx
import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface PhoneNumberInputProps {
  name: string;
  value: string;
  onChange: (phone: string) => void;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  name,
  value,
  onChange,
}) => {
  return (
    <div className="mt-2">
      <input type="hidden" name={name} value={value} />{" "}
      <PhoneInput
        country={"nz"}
        enableSearch={true}
        placeholder="640211110000"
        defaultMask="(...)-...-...."
        preferredCountries={["nz", "au"]}
        value={value}
        onChange={onChange}
        inputClass="text-gray-800"
        buttonClass="bg-transparent border-none"
        dropdownClass="text-gray-800"
        searchClass="text-gray-800"
      />
    </div>
  );
};

export default PhoneNumberInput;
