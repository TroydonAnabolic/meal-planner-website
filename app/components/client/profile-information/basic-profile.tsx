import React, { useEffect, useState } from "react";

import TextInput from "../../ui/inputs/text-input";
import SelectDropdown from "../../ui/inputs/select-dropdown";
import DateInput from "../../ui/inputs/date-input";
import { IClientInterface } from "../../../../models/interfaces/client/client"; // "// /models/interfaces/client/client";
import { GenderType, ActivityLevel } from "@/constants/constants-enums";
import { deleteImageFromS3, saveImageToS3 } from "@/lib/s3-client";
import { saveClient } from "@/lib/client-side/client";
import Image from "next/image";

interface BasicProfileProps {
  client: IClientInterface;
  setClient: React.Dispatch<React.SetStateAction<IClientInterface>>;
}

const BasicProfile: React.FC<BasicProfileProps> = ({ client, setClient }) => {
  const [selectedGender, setSelectedGender] = useState<GenderType>(
    client.Gender || GenderType.Male
  );
  const [selectedActivityLevel, setSelectedActivityLevel] =
    useState<ActivityLevel>(client.Activity || ActivityLevel.Sedentary);
  const [profilePic, setProfilePic] = useState(client.ProfilePicUrl || "");

  const defaultAvatar = "/avatar/default-profile-pic.svg";
  useEffect(() => {
    setClient((prevClient) => ({
      ...prevClient,
      Gender: selectedGender,
    }));
  }, [selectedGender, setClient]);

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

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const base64Image = reader.result as string;
        const uploadedUrl = await saveImageToS3(
          base64Image,
          `client/profile-pic/${client.UserID}`
        );
        if (uploadedUrl) {
          await saveProfilePicToDatabase(uploadedUrl);
          setProfilePic(uploadedUrl);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleDeleteImage = async () => {
    try {
      if (profilePic) {
        const success = await deleteImageFromS3(profilePic);
        if (success) {
          await saveProfilePicToDatabase(defaultAvatar);
          setProfilePic(defaultAvatar);
        }
      }
    } catch (error) {
      console.error("Error deleting profile picture:", error);
    }
  };

  const saveProfilePicToDatabase = async (url: string) => {
    try {
      const clientSaved = await saveClient({ ...client, ProfilePicUrl: url });

      setClient((prevClient) => ({ ...prevClient, ProfilePicUrl: url }));
    } catch (error) {
      console.error("Error saving profile picture:", error);
    }
  };

  return (
    <div>
      <div className="profile-picture-container">
        <Image
          src={profilePic || defaultAvatar}
          alt="Profile Picture"
          width={150}
          height={150}
          className="rounded-full"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mt-2"
        />
        {profilePic && (
          <button onClick={handleDeleteImage} className="text-red-500 mt-2">
            Delete Profile Picture
          </button>
        )}
      </div>

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
      {/* Gender */}
      <SelectDropdown
        label="Gender"
        options={Object.values(GenderType)}
        selected={selectedGender}
        onChange={setSelectedGender}
        name="gender"
        placeholder="Select your gender"
      />
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
  );
};

export default BasicProfile;
