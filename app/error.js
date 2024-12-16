"use client";

export default function Error() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-auto flex-col justify-center px-6 py-24 sm:py-64 lg:px-8">
      <p className="text-base font-semibold leading-8 text-red-600">Error</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
        Something went wrong
      </h1>
      <p className="mt-6 text-base leading-7 text-gray-600">
        Sorry, an unexpected error has occurred. Please try again later.
      </p>
      <div className="mt-10">
        <a href="/" className="text-sm font-semibold leading-7 text-indigo-600">
          <span aria-hidden="true">&larr;</span> Back to home
        </a>
      </div>
    </div>
  );
}
