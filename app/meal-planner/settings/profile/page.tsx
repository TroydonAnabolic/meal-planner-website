import DeleteUser from "@/app/components/auth/delete-user";
import LogoutAllUsers from "@/app/components/auth/logout-all-sessions";
import ChangePassword from "@/app/components/auth/change-password";
import ProfileInformation from "@/app/components/client/profile-information/profile-information";
import { auth } from "@/auth";
import { getClient } from "@/lib/client-side/client";
import React from "react";

type Props = {};

const ProfilePage = async (props: Props) => {
  const session = await auth();
  const plainSession = session ? { ...session } : undefined;

  // TODO: Test whether this will run after saveBasicProfile is called to update the client data
  const clientData = await getClient(session?.user.userId as string);
  return (
    <>
      {/* TODO: Profile information must use update session from */}
      <ProfileInformation session={plainSession} clientData={clientData} />
      <ChangePassword session={plainSession} />
      <LogoutAllUsers session={plainSession} />
      <DeleteUser session={plainSession} />
    </>
  );
};

export default ProfilePage;
