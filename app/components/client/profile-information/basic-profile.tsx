import React, { useEffect, useState } from "react";

import { GenderType, ActivityLevel } from "@/models/Client";
import { IClientInterface } from "@/models/interfaces/client/client";
import TextInput from "../../ui/inputs/text-input";
import SelectDropdown from "../../ui/inputs/select-dropdown";
import DateInput from "../../ui/inputs/date-input";

interface BasicProfileProps {
  client: IClientInterface;
  setClient: React.Dispatch<React.SetStateAction<IClientInterface>>;
}
const BasicProfile: React.FC<BasicProfileProps> = ({ client, setClient }) => {
  // State variables for select fields
  const [selectedGender, setSelectedGender] = useState<GenderType>(
    GenderType.Male
  );
  const [selectedActivityLevel, setSelectedActivityLevel] =
    useState<ActivityLevel>(ActivityLevel.Sedentary);

  // Update client object when selectedGender changes
  useEffect(() => {
    setClient((prevClient) => ({
      ...prevClient,
      Gender: selectedGender,
    }));
  }, [selectedGender, setClient]);

  // Update client object when selectedActivityLevel changes
  useEffect(() => {
    setClient((prevClient) => ({
      ...prevClient,
      Activity: selectedActivityLevel,
    }));
  }, [selectedActivityLevel, setClient]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setClient({ ...client, [name]: value });
  };

  return (
    <>
      {/* First Name */}
      <TextInput
        label="First Name"
        type="text"
        name="FirstName"
        id="FirstName"
        value={client.FirstName || ""}
        onChange={handleInputChange}
      />
      {/* Last Name */}
      <TextInput
        label="Last Name"
        type="text"
        name="LastName"
        id="LastName"
        value={client.LastName || ""}
        onChange={handleInputChange}
      />
      {/* Birthday */}
      <DateInput
        label="Birthday"
        type="date"
        name="Birthday"
        id="Birthday"
        value={client.Birthday || new Date()}
        onChange={handleInputChange}
      />
      <div className="sm:col-span-3">
        {/* Gender */}
        <SelectDropdown
          label="Gender"
          options={Object.values(GenderType)}
          selected={selectedGender}
          onChange={setSelectedGender}
          name="gender"
          placeholder="Select your gender"
        />
      </div>

      <div className="sm:col-span-3">
        {/* Activity Level */}
        <SelectDropdown
          label="Activity Level"
          options={Object.values(ActivityLevel)}
          selected={selectedActivityLevel}
          onChange={setSelectedActivityLevel}
          name="activityLevel"
          placeholder="Select your activity level"
        />
      </div>
    </>
  );
};

export default BasicProfile;
