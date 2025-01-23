import React, { useEffect, useState } from "react";

import TextInput from "../../ui/inputs/text-input";
import SelectDropdown from "../../ui/inputs/select-dropdown";
import DateInput from "../../ui/inputs/date-input";
import { IClientInterface } from "../../../../models/interfaces/client/client"; // "// /models/interfaces/client/client";
import { GenderType, ActivityLevel } from "@/constants/constants-enums";
import { deleteImageFromS3, saveImageToS3 } from "@/lib/s3-client";
import { saveClient } from "@/lib/client-side/client";
import Image from "next/image";
import ImageUploadLabel from "../../ui/inputs/image-upload";

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
  const defaultAvatar = "/avatar/default-profile-pic.svg";

  const [profilePic, setProfilePic] = useState(
    client.ProfilePicUrl || defaultAvatar
  );

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

  const handleImageUpload = async (imageSrc: string | undefined) => {
    if (!imageSrc) return;

    try {
      const uploadedUrl = await saveImageToS3(
        imageSrc,
        `client/${client.UserID}/profile-pic/`
      );
      if (uploadedUrl) {
        //await saveProfilePicToDatabase(uploadedUrl);
        setClient((prevClient) => ({
          ...prevClient,
          ProfilePicUrl: uploadedUrl,
        }));
        setProfilePic(uploadedUrl);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleDeleteImage = async () => {
    try {
      if (profilePic) {
        const success = await deleteImageFromS3(profilePic);
        if (success) {
          //  await saveProfilePicToDatabase(defaultAvatar);
          setClient((prevClient) => ({
            ...prevClient,
            ProfilePicUrl: defaultAvatar,
          }));
          setProfilePic(defaultAvatar);
        }
      }
    } catch (error) {
      console.error("Error deleting profile picture:", error);
    }
  };

  return (
    <>
      <div className="col-span-6 items-center space-y-4">
        {/* Profile Picture */}
        <ImageUploadLabel
          handleImageUpload={handleImageUpload}
          placeholder={
            <Image
              src={profilePic || defaultAvatar}
              alt="Profile Picture"
              width={150}
              height={150}
              objectFit="contain"
              className=" h-auto rounded-md border border-gray-300 shadow-sm max-w-40 max-h-40"
            />
          }
        />

        {/* Delete Button */}
        {profilePic !== defaultAvatar && (
          <button
            onClick={handleDeleteImage}
            className="text-sm font-medium text-red-600 hover:underline"
          >
            Delete Profile Picture
          </button>
        )}
      </div>
      <div className="col-span-3">
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
      </div>

      <div className="col-span-3">
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
      </div>

      {/* Activity Level */}
      {/* <SelectDropdown
        label="Activity Level"
        options={Object.values(ActivityLevel)}
        selected={selectedActivityLevel}
        onChange={setSelectedActivityLevel}
        name="activityLevel"
        placeholder="Select your activity level"
      /> */}
    </>
  );
};

export default BasicProfile;
