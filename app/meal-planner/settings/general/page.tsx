import ChangePassword from "@/app/components/auth/change-password";
import LocationSettings from "@/app/components/client/general/location-settings";
import ProfileInformation from "@/app/components/client/profile-information/profile-information";
import { auth } from "@/auth";
import { getClient } from "@/lib/server-side/client";
import React from "react";

type Props = {};

const ProfilePage = async (props: Props) => {
  const session = await auth();
  const plainSession = session ? { ...session } : undefined;

  // TODO: Test whether this will run after saveBasicProfile is called to update the client data
  const clientData = await getClient(session?.user.userId as string);
  return (
    <>
      <LocationSettings clientData={clientData} />
      {/* set dark mode and other display settings <Display session={plainSession} /> */}
    </>
  );
};

export default ProfilePage;
