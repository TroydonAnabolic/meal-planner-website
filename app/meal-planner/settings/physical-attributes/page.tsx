import BiometricsSection from "@/app/components/client/physical-attributes/biometrics";
import CookingAndHealthSection from "@/app/components/client/physical-attributes/cooking-preferences";
import MedicalSection from "@/app/components/client/physical-attributes/medical-section";
import { auth } from "@/auth";
import { getClient } from "@/lib/server-side/client";
import { initializeClientSettings } from "@/util/client-settings-util";
import React from "react";

type Props = {};
const PhysicalAttributes: React.FC<Props> = async () => {
  const session = await auth();
  const clientData = await getClient(session?.user.userId as string);
  initializeClientSettings(clientData);

  return (
    <>
      <BiometricsSection clientData={clientData} />
      <MedicalSection clientData={clientData} />
      <CookingAndHealthSection clientData={clientData} />
    </>
  );
};

export default PhysicalAttributes;
