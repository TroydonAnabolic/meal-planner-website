"use client";
import { confirmPassword } from "@/actions/auth-actions";
import { useFormState } from "react-dom";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const VerifyCodePage: React.FC = () => {
  const [formData, formAction, isPending] = useFormState(confirmPassword, {
    errors: {},
  });
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <main className="flex min-h-screen w-full">
      <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-1/2">
        {!formData?.success && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Enter Verification Code
            </h2>
            <p className="text-gray-600 mt-4">
              Enter the verification code sent to your email and your new
              password.
            </p>
          </>
        )}
        {formData?.success ? (
          <div className="mt-8 space-y-6">
            <div className="text-gray-800">
              Password confirmed successfully!
            </div>
            <p className="text-gray-600 mt-4">
              You can now{" "}
              <Link
                href="/login"
                className="text-indigo-600 hover:text-indigo-500"
              >
                login
              </Link>{" "}
              with your new password.
            </p>
          </div>
        ) : (
          <form action={formAction} className="mt-8 space-y-6">
            <input type="hidden" name="email" value={email || ""} />
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium leading-6 text-gray-800"
              >
                Verification Code
              </label>
              <div className="mt-2">
                <input
                  id="code"
                  name="code"
                  type="text"
                  required
                  className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-gray-800"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="new_password"
                className="block text-sm font-medium leading-6 text-gray-800"
              >
                New Password
              </label>
              <div className="mt-2">
                <input
                  id="new_password"
                  name="new_password"
                  type="password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-gray-800"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="confirm_password"
                className="block text-sm font-medium leading-6 text-gray-800"
              >
                Confirm New Password
              </label>
              <div className="mt-2">
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-gray-800"
                />
              </div>
            </div>
            {formData?.errors && (
              <ul id="form-errors" className="text-red-700">
                {Object.keys(formData.errors).map((error) => (
                  <li key={error}>{formData.errors![error]}</li>
                ))}
              </ul>
            )}
            <div>
              <button
                disabled={isPending}
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Confirm Password
              </button>
            </div>
          </form>
        )}
        {!formData?.success && (
          <>
            <div className="mt-4">
              <Link
                href="/forgot-password"
                className="text-indigo-600 hover:text-indigo-500"
              >
                Request Another Code
              </Link>
            </div>
            <p className="text-gray-600 mt-4">
              Remembered your password?{" "}
              <Link
                href="/login"
                className="text-indigo-600 hover:text-indigo-500"
              >
                Login
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
};

export default VerifyCodePage;
