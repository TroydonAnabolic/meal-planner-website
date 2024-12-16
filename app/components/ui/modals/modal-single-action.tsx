// ModalSingleAction.tsx
"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";

type ModalSingleActionProps = {
  title: string;
  description: string;
  inputLabel?: string;
  inputPlaceholder?: string;
  actionButtonText: string;
  onClose: () => void;
  onAction: (inputValue: string) => void;
  isOpen: boolean;
  errorMessage?: string | null;
  children?: React.ReactNode; // Add children prop
};

export default function ModalSingleAction({
  title,
  description,
  inputLabel,
  inputPlaceholder,
  actionButtonText,
  onClose,
  onAction,
  isOpen,
  errorMessage,
  children, // Add children prop
}: ModalSingleActionProps) {
  const [inputValue, setInputValue] = useState("");

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75" />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <Dialog.Panel
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 
                       text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6"
          >
            <div>
              <div className="text-center sm:mt-5">
                <Dialog.Title
                  as="h3"
                  className="text-base font-semibold text-gray-900"
                >
                  {title}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{description}</p>
                </div>
                {inputLabel && (
                  <div className="mt-4">
                    <label
                      htmlFor="modal-input"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {inputLabel}
                    </label>
                    <input
                      type="text"
                      id="modal-input"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={inputPlaceholder}
                      className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900
                                 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400
                                 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="mt-5 sm:mt-6">
              <button
                type="button"
                onClick={() => onAction(inputValue)}
                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2
                           text-sm font-semibold text-white shadow-sm hover:bg-indigo-500
                           focus:outline-none"
              >
                {actionButtonText}
              </button>
            </div>
            <div className="mt-4 sm:mt-6 justify-center">
              {children} {/* Render children */}
            </div>
            {errorMessage && (
              <div className="mt-2 text-sm text-red-600">{errorMessage}</div>
            )}
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
