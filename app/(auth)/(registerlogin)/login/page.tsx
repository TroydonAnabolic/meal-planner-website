"use client";
import { login, resendConfirmationEmail } from "@/actions/auth-actions";
import { adminVerifyUserAttribute } from "@/actions/cognito-actions";

import { FormResult } from "@/types/form";
import Link from "next/link";
import { useState } from "react";
import { useFormState } from "react-dom";

type Props = {};

const LoginPage = (props: Props) => {
  const [formData, formAction, isPending] = useFormState(login, { errors: {} });
  const [formResult, setFormResult] = useState<FormResult | undefined>({});

  const handleAdminVerifyUserAttribute = async (email: string) => {
    const result = await adminVerifyUserAttribute(email, "email");
    if (result.success) {
      console.log("Email verified successfully.");
      // Optionally, you can update the UI or perform other actions here
    } else {
      console.error("Failed to verify email:", result.errors?.general);
      setFormResult(result);
      // Optionally, you can update the UI to show the error message
    }
  };

  return (
    <div className="mx-auto w-full max-w-sm lg:w-96">
      <div>
        <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-800">
          Login to your account
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-800">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Register
          </Link>
        </p>
      </div>
      <div className="mt-10">
        <form action={formAction} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-800"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-gray-800"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-800"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-gray-800"
              />
            </div>
          </div>
          {formData?.errors && (
            <ul id="form-errors" className="text-red-700">
              {Object.keys(formData.errors).map((error) => (
                <li key={error}>{formData.errors[error]}</li>
              ))}
            </ul>
          )}
          {formResult?.errors && (
            <ul id="form-errors" className="text-red-700">
              {Object.keys(formResult.errors).map((error) => (
                <li key={error}>{formResult?.errors![error]}</li>
              ))}
            </ul>
          )}
          {formData?.errors?.general === "User not confirmed." && (
            <button
              onClick={async () => {
                // console.log("resend confirmation email" + formData?.emailInput);
                await resendConfirmationEmail(formData?.emailInput as string);
              }}
              className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Click here to resend confirmation email link
            </button>
          )}

          {formData?.errors?.general === "Email not verified." && (
            <button
              onClick={async () => {
                await handleAdminVerifyUserAttribute(
                  formData.emailInput as string
                );
              }}
              className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Click here to verify email
            </button>
          )}

          <div>
            <button
              disabled={isPending}
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Login
            </button>
          </div>
        </form>
        <div className="mt-4 text-sm leading-6 text-gray-800">
          <Link
            href="/forgot-password"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Forgot Password?
          </Link>
        </div>
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
          }} 
      */}
      </div>
    </div>
  );
};

export default LoginPage;
