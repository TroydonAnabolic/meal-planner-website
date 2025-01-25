"use client";
import { saveBasicProfile } from "@/actions/client-actions";
import { IClientInterface } from "@/models/interfaces/client/client";
import { Session } from "next-auth";
import React, { useEffect, useState } from "react";
import FormButton from "../../ui/buttons/form-button";
import {
  fetchCognitoAttributes,
  updateCognitoAttribute,
  updateCognitoUser,
  verifyCode,
} from "@/actions/cognito-actions";
import { VerificationAttributesResult } from "@/types/cognito";
import { useSession } from "next-auth/react";
import { FormResult } from "@/types/form";
import ModalSingleAction from "../../ui/modals/modal-single-action";
import CountdownTimer from "../../countdown-timer";
import BasicProfile from "./basic-profile";
import ContactInfo from "./contact-info";
import { updateSession } from "@/actions/auth-actions";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/constants/routes";

type ProfileInformationProps = {
  session: Session | undefined;
  clientData: IClientInterface | undefined; // Add clientData prop
};

const ProfileInformation: React.FC<ProfileInformationProps> = ({
  session,
  clientData,
}) => {
  const { update: sessionUpdate } = useSession(); // Import useSession from next-auth/react
  const [client, setClient] = useState<IClientInterface>(clientData!);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    description: "",
    inputLabel: "",
    inputPlaceholder: "",
    actionButtonText: "",
    onAction: (inputValue: string) => {},
  });
  const [modalError, setModalError] = useState<string | null>(null);

  const [emailVerified, setEmailVerified] = useState(false);
  const [formData, setFormData] = useState<FormResult | undefined>({});
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [initialSeconds, setInitialSeconds] = useState(0);

  useEffect(() => {
    const fetchAttributes = async () => {
      if (client?.Email) {
        const { cognitoEmail, emailVerified }: VerificationAttributesResult =
          await fetchCognitoAttributes(session, client.Email);
        setEmailVerified(emailVerified);
        if (emailVerified && cognitoEmail) {
          setClient({ ...client, Email: cognitoEmail });
        }
      }
    };
    fetchAttributes();
  }, [clientData?.Email]);

  const formAction = async (formData: FormData) => {
    if (!emailVerified) {
      setFormData({
        errors: {
          general: "Please verify your email before submitting.",
        },
      });
      return;
    }
    const updatedClient: IClientInterface = {
      ...client,
    };

    // Update client in the database
    const saveResult = await saveBasicProfile(updatedClient);
    if (!saveResult?.success) {
      // Append errors to formData if the update fails
      setFormData({ errors: saveResult?.errors });
      return;
    }

    // Update the session user object
    await updateSession(session!, updatedClient);
    // await sessionUpdate({ profilePicUrl: updatedClient.ProfilePicUrl });

    // update client in cognito
    const result = await updateCognitoUser(session, updatedClient);
    setFormData(result);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setClient({ ...client, [name]: value });
  };

  const handleModalClose = async () => {
    setIsModalOpen(false);
    setModalError(null);
  };

  const handleEmailVerification = async () => {
    // updates email attr in cognito and automatically sends a verification code
    const result = await updateCognitoAttribute(session, "email", client.Email);

    if (result?.errors) {
      setFormData(result);
      return;
    }

    setModalContent({
      title: "Verify Your Email",
      description: "Please enter the verification code sent to your email.",
      inputLabel: "Verification Code",
      inputPlaceholder: "Enter code",
      actionButtonText: "Verify Email",
      onAction: async (code: string) => {
        const { success, error } = await verifyCode(
          client.Email,
          "email",
          code,
          session?.user?.idToken,
          session?.user?.accessToken,
          session?.user?.refreshToken
        );

        if (success) {
          setEmailVerified(true);
          setFormData({ success: true });
          setIsModalOpen(false);
          setModalError(null);
          sessionUpdate({ email: client.Email });
        } else {
          setModalError(error || "Verification failed");
        }
      },
    });
    setInitialSeconds(60); // Set initial seconds for the countdown
    setIsTimerActive(true); // Start the timer
    setIsModalOpen(true);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const email = event.target.value;
    setClient({ ...client, Email: event.target.value });
    // If the email does not match server email, set emailVerified to false
    if (email !== clientData?.Email && email != "") {
      setEmailVerified(false);
    }
  };

  return (
    <>
      <form id="client-info" action={formAction}>
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-800">
              Profile Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-400">
              Basic profile information, such as your name
            </p>
          </div>
          <div className="md:col-span-2">
            <div className="grid grid-cols-6 gap-x-6 gap-y-8 sm:grid-cols-6">
              <BasicProfile client={client} setClient={setClient} />
            </div>
          </div>
        </div>
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 pb-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-800">
              Contact Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-400">
              Update your contact information.
            </p>
          </div>
          <div className="md:col-span-2">
            <div className="grid grid-cols-6 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* Email Address */}
              <ContactInfo
                client={client}
                handleInputChange={handleInputChange}
                handleEmailChange={handleEmailChange}
                handleEmailVerification={handleEmailVerification}
                emailVerified={emailVerified}
              />

              <div className="mt-8 flex">
                <FormButton
                  buttonText="Save"
                  buttonPendingText="Saving..."
                  className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
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
                <div className="text-green-700">
                  Profile updated successfully!
                </div>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* ModalSingleAction Component */}
      {isModalOpen && (
        <ModalSingleAction
          title={modalContent.title}
          description={modalContent.description}
          inputLabel={modalContent.inputLabel}
          inputPlaceholder={modalContent.inputPlaceholder}
          actionButtonText={modalContent.actionButtonText}
          onClose={() => handleModalClose()}
          onAction={modalContent.onAction}
          isOpen={isModalOpen}
          errorMessage={modalError}
        >
          <CountdownTimer
            initialSeconds={initialSeconds}
            isTimerActive={isTimerActive}
            onComplete={() => setIsTimerActive(false)}
            onResend={async () => {
              // Resend the verification code
              const result = await updateCognitoAttribute(
                session,
                "email",
                client.Email
              );

              if (result?.errors) {
                setFormData(result);
                return;
              }

              if (result?.success) {
                setModalError(null); // Clear any previous modal errors
                setInitialSeconds(60); // Reset the timer
                setIsTimerActive(true);
                sessionUpdate({
                  email: client.Email,
                });
              }
            }}
          />
        </ModalSingleAction>
      )}
    </>
  );
};

export default ProfileInformation;
