"use client";
import { resendConfirmationEmail } from "@/actions/auth-actions";
import EmailInput from "@/app/components/ui/inputs/email-input";
import PhoneNumberInput from "@/app/components/ui/inputs/phone-number-input";
import SelectDropdown from "@/app/components/ui/inputs/select-dropdown";
import HorizontalScrollContainer from "@/app/components/ui/scrolls/horizontal-scroll-container/horizontal-scroll-container";
import PricingGrid from "@/app/components/ui/subscribe/pricing-sections";
import { Countries } from "@/constants/constants-enums";
import { tiers } from "@/constants/constants-objects";
import { registerAction } from "@/lib/client/client-side/register";
import { ActivityLevel, GenderType } from "@/models/Client";
import { Tier } from "@/types/subscribe";
import Link from "next/link";
import { useState } from "react";
import { useFormState } from "react-dom";

type Props = {};

// Temporary data for testing initial values
const tempData = {
  email: "troydonluic@gmail.com",
  password: "Password123!",
  confirmPassword: "Password123!",
  givenName: "John",
  familyName: "Doe",
  address: "123 Main St",
  suburb: "Suburbia",
  postCode: "12345",
  city: "Test City",
  phoneNumber: "64224319560",
  //birthDay: "1990-01-01",
  country: Countries.US,
  //gender: GenderType.Male,
  // activityLevel: ActivityLevel.Active,
};

function classNames(...classes: (string | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

const RegistrationPage = (props: Props) => {
  const [formData, formAction, isPending] = useFormState(registerAction, {
    errors: {},
  });
  const [selectedCountry, setSelectedCountry] = useState<Countries>(
    Countries.NZ
  );
  const [phoneNumber, setPhoneNumber] = useState(tempData.phoneNumber);
  const [email, setEmail] = useState(tempData.email);
  // get the tier that starts of with active as default
  const initialActiveTier = tiers.find((t) => t.active);
  const [selectedTier, setSelectedTier] = useState<Tier>(initialActiveTier!);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSelectTier = (tier: Tier) => {
    setSelectedTier(tier);
    console.log("Selected Tier:", tier); // Debugging purpose
    // Perform further actions, such as showing a form or proceeding with payment.
  };

  return (
    <div className="mx-auto w-full max-w-sm lg:w-96">
      <div>
        <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-800">
          Register your account
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-800">
          Already a member?{" "}
          <Link
            href="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </Link>
        </p>
      </div>
      <div className="mt-10">
        <form action={formAction} className="space-y-6">
          {/* Email Field */}
          <div>
            <EmailInput
              name="email"
              value={email}
              onChange={handleEmailChange}
              required={true}
            />
          </div>
          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-800"
            >
              Password <span className="text-red-600">*</span>
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter your password"
                defaultValue={tempData.password}
                autoComplete="new-password"
                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-gray-800"
              />
            </div>
          </div>
          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium leading-6 text-gray-800"
            >
              Confirm Password <span className="text-red-600">*</span>
            </label>
            <div className="mt-2">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder="Confirm your password"
                defaultValue={tempData.confirmPassword}
                autoComplete="new-password"
                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-gray-800"
              />
            </div>
          </div>
          {/* Given Name Field */}
          <div>
            <label
              htmlFor="givenName"
              className="block text-sm font-medium leading-6 text-gray-800"
            >
              Given Name <span className="text-red-600">*</span>
            </label>
            <div className="mt-2">
              <input
                id="givenName"
                name="givenName"
                type="text"
                required
                placeholder="Enter your first name"
                defaultValue={tempData.givenName}
                autoComplete="given-name"
                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-gray-800"
              />
            </div>
          </div>
          {/* Family Name Field (Optional) */}
          <div>
            <label
              htmlFor="familyName"
              className="block text-sm font-medium leading-6 text-gray-800"
            >
              Family Name
            </label>
            <div className="mt-2">
              <input
                id="familyName"
                name="familyName"
                type="text"
                placeholder="Enter your last name"
                defaultValue={tempData.familyName}
                autoComplete="family-name"
                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-gray-800"
              />
            </div>
          </div>
          {/* Address Field (Optional) */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium leading-6 text-gray-800"
            >
              Address Line 1
            </label>
            <div className="mt-2">
              <input
                defaultValue={tempData.address}
                autoComplete="street-address"
                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-gray-800"
              />
            </div>
          </div>
          {/* Suburb and Post Code Fields */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label
                htmlFor="suburb"
                className="block text-sm font-medium leading-6 text-gray-800"
              >
                Suburb
              </label>
              <div className="mt-2">
                <input
                  id="suburb"
                  name="suburb"
                  type="text"
                  placeholder="Enter your suburb"
                  defaultValue={tempData.suburb}
                  autoComplete="address-level2"
                  className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-gray-800"
                />
              </div>
            </div>
            <div className="flex-1">
              <label
                htmlFor="postCode"
                className="block text-sm font-medium leading-6 text-gray-800"
              >
                Post Code
              </label>
              <div className="mt-2">
                <input
                  id="postCode"
                  name="postCode"
                  type="text"
                  placeholder="Enter your post code"
                  defaultValue={tempData.postCode}
                  autoComplete="postal-code"
                  className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-gray-800"
                />
              </div>
            </div>
          </div>
          {/* City and Country Fields */}
          <div className="flex gap-4 mt-4">
            <div className="flex-1">
              <label
                htmlFor="city"
                className="block text-sm font-medium leading-6 text-gray-800"
              >
                City
              </label>
              <div className="mt-2">
                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="Enter your city"
                  defaultValue={tempData.city}
                  autoComplete="address-level1"
                  className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-gray-800"
                />
              </div>
            </div>
            <div className="flex-1">
              <SelectDropdown
                label="Country"
                options={Object.values(Countries)}
                selected={selectedCountry}
                onChange={setSelectedCountry}
                name="country"
                placeholder="Select your country"
              />
            </div>
          </div>
          {/* Phone Number Field (Optional) */}
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium leading-6 text-gray-800"
            >
              Phone Number
            </label>
            <PhoneNumberInput
              name="phoneNumber"
              value={phoneNumber}
              onChange={setPhoneNumber}
            />
          </div>
          <div>
            <label
              htmlFor="pricing"
              className="block text-sm font-medium leading-6 text-gray-800"
            >
              Pricing
            </label>
            <div>
              <HorizontalScrollContainer>
                <PricingGrid
                  tiers={tiers}
                  classNames={(...classes) => classes.filter(Boolean).join(" ")}
                  onSelectTier={handleSelectTier} // Pass callback to PricingGrid
                />
              </HorizontalScrollContainer>
            </div>
          </div>
          {/* Selected product id to submit for subscribing */}
          <input type="hidden" name="priceId" value={selectedTier?.id} />{" "}
          {formData?.errors && (
            <ul id="form-errors" className="text-red-700">
              {Object.keys(formData.errors).map((error) => (
                <li key={error}>{formData.errors[error]}</li>
              ))}
            </ul>
          )}
          {formData?.errors?.email === "Email already exists." && (
            <button
              onClick={async () => {
                await resendConfirmationEmail(formData.email as string);
              }}
              className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Click here to resend confirmation email
            </button>
          )}
          {/* Submit Button */}
          <div>
            <button
              disabled={isPending}
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Register
            </button>
          </div>
        </form>
        {/* TODO: Implement facebook and google provider auth */}
        {/* {Object.values(providerMap).map((provider) => (
        <form
          action={async () => {
            "use server"
            try {
              await signIn(provider.id, {
                redirectTo: props.searchParams?.callbackUrl ?? "",
              })
            } catch (error) {
              // Signin can fail for a number of reasons, such as the user
              // not existing, or the user not having the correct role.
              // In some cases, you may want to redirect to a custom error
              if (error instanceof AuthError) {
                return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`)
              }
 
              // Otherwise if a redirects happens Next.js can handle it
              // so you can just re-thrown the error and let Next.js handle it.
              // Docs:
              // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
              throw error
            }
          }} */}
      </div>
    </div>
  );
};

export default RegistrationPage;
