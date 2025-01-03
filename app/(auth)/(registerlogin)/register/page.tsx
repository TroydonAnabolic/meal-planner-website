"use client";
import { register, resendConfirmationEmail } from "@/actions/auth-actions";
import EmailInput from "@/app/components/ui/inputs/email-input";
import PhoneNumberInput from "@/app/components/ui/inputs/phone-number-input";
import SelectDropdown from "@/app/components/ui/inputs/select-dropdown";
import { Countries } from "@/constants/constants-enums";
import { ActivityLevel, GenderType } from "@/models/Client";
import Link from "next/link";
import { useState } from "react";
import { useFormState } from "react-dom";

type Props = {};

// Temporary data for testing initial values
const tempData = {
  email: "",
  password: "",
  confirmPassword: "",
  givenName: "John",
  familyName: "Doe",
  address: "123 Main St",
  suburb: "Suburbia",
  postCode: "12345",
  city: "Test City",
  phoneNumber: "1234567890",
  birthDay: "1990-01-01",
  country: Countries.US,
  gender: GenderType.Male,
  activityLevel: ActivityLevel.Active,
};

const RegistrationPage = (props: Props) => {
  const [formData, formAction, isPending] = useFormState(register, {
    errors: {},
  });
  const [selectedCountry, setSelectedCountry] = useState<Countries>(
    Countries.NZ
  );
  const [selectedGender, setSelectedGender] = useState<GenderType>(
    GenderType.Male
  );
  const [selectedActivityLevel, setSelectedActivityLevel] =
    useState<ActivityLevel>(ActivityLevel.Active);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState(tempData.email);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
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

          {/* Suburb Field (Optional) */}
          <div>
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

          {/* Post Code Field (Optional) */}
          <div>
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

          {/* City Field (Optional) */}
          <div>
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

          {/* Country Dropdown */}
          <SelectDropdown
            label="Country"
            options={Object.values(Countries)}
            selected={selectedCountry}
            onChange={setSelectedCountry}
            name="country"
            placeholder="Select your country"
          />

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

          {/* Birth Day Field (Optional) */}
          <div>
            <label
              htmlFor="birthDay"
              className="block text-sm font-medium leading-6 text-gray-800"
            >
              Birth Day
            </label>
            <div className="mt-2">
              <input
                id="birthDay"
                name="birthDay"
                type="date"
                placeholder="Enter your birth date"
                defaultValue={tempData.birthDay}
                autoComplete="bday"
                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-gray-800"
              />
            </div>
          </div>

          {/* Gender Dropdown */}
          <SelectDropdown
            label="Gender"
            options={Object.values(GenderType)}
            selected={selectedGender}
            onChange={setSelectedGender}
            name="gender"
            placeholder="Select your gender"
          />

          {/* Activity Level Dropdown */}
          <SelectDropdown
            label="Activity Level"
            options={Object.values(ActivityLevel)}
            selected={selectedActivityLevel}
            onChange={setSelectedActivityLevel}
            name="activityLevel"
            placeholder="Select your activity level"
          />

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
