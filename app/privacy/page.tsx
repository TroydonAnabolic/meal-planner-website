import React from "react";

const PrivacyPage = () => {
  return (
    <div className="relative isolate overflow-hidden pb-16 pt-14 sm:pb-20">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Privacy Policy
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Your privacy is important to us. This privacy policy explains how
              we collect, use, and protect your information.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-4xl text-gray-600">
          <h2 className="text-2xl font-semibold text-gray-900">
            Information Collection
          </h2>
          <p className="mt-4">
            We collect information that you provide to us directly, such as when
            you create an account, update your profile, or use our services.
          </p>
          <h2 className="mt-8 text-2xl font-semibold text-gray-900">
            Use of Information
          </h2>
          <p className="mt-4">
            We use the information we collect to provide, maintain, and improve
            our services, to communicate with you, and to protect our users.
          </p>
          <h2 className="mt-8 text-2xl font-semibold text-gray-900">
            Information Sharing
          </h2>
          <p className="mt-4">
            We do not share your personal information with third parties except
            as necessary to provide our services, comply with the law, or
            protect our rights.
          </p>
          <h2 className="mt-8 text-2xl font-semibold text-gray-900">
            Security
          </h2>
          <p className="mt-4">
            We take reasonable measures to protect your information from
            unauthorized access, use, or disclosure.
          </p>
          <h2 className="mt-8 text-2xl font-semibold text-gray-900">
            Changes to This Policy
          </h2>
          <p className="mt-4">
            We may update this privacy policy from time to time. We will notify
            you of any changes by posting the new policy on our website.
          </p>
          <h2 className="mt-8 text-2xl font-semibold text-gray-900">
            Contact Us
          </h2>
          <p className="mt-4">
            If you have any questions about this privacy policy, please contact
            us at support@example.com.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
