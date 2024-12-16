"use client";
import { forgotPassword } from "@/actions/auth-actions";
import { useFormState } from "react-dom";
import Link from "next/link";

const ForgotPasswordPage: React.FC = () => {
  const [formData, formAction, isPending] = useFormState(forgotPassword, {
    errors: {},
  });

  return (
    <main className="flex min-h-screen w-full">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
        style={{
          transform: "translateX(-20px)", // Adjust this value to move more to the left
        }}
      >
        <div
          style={{
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          }}
          className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
        />
      </div>
      {/* Left Section: Form Content */}
      <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-1/2">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Forgot Password
        </h2>
        <p className="text-gray-600 mt-4">
          Enter your email address and we will send you a link to reset your
          password.
        </p>
        <form action={formAction} className="mt-8 space-y-6">
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
          {formData?.errors && Object.keys(formData.errors).length > 0 && (
            <ul id="form-errors" className="text-red-700">
              {Object.keys(formData.errors).map((error) => (
                <li key={error}>{formData.errors?.[error]}</li>
              ))}
            </ul>
          )}
          <div>
            <button
              disabled={isPending}
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Email Verification code
            </button>
          </div>
        </form>
        <p className="text-gray-600 mt-4">
          Remembered your password?{" "}
          <Link href="/login" className="text-indigo-600 hover:text-indigo-500">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
