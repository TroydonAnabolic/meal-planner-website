// components/ui/modals/form-modal.tsx

"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import FormButton from "../buttons/form-button";

type FormModalProps = {
  dialogTitle: string;
  dialogDescription?: string;
  buttonText?: string;
  children?: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  formAction:
    | ((data: any) => Promise<void>)
    | ((data: any) => void)
    | undefined;
  // New Props for Delete Button
  deleteButtonText?: string;
  onDelete?: ((data: any) => Promise<void>) | ((data: any) => void);
  onClose?: () => void; // New prop
};
// components/ui/modals/form-modal.tsx

// ... [previous imports and code]

const FormModal: React.FC<FormModalProps> = ({
  dialogTitle,
  dialogDescription,
  buttonText,
  children,
  open,
  setOpen,
  formAction,
  deleteButtonText,
  onDelete,
  onClose, // Destructure 'onClose'
}) => {
  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose(); // Invoke 'onClose' callback
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        {/* Modal Container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            {/* Modal Panel */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <Dialog.Panel className="w-full max-w-4xl h-[80vh] max-h-[80vh] transform overflow-hidden rounded-xl bg-white/90 backdrop-blur-lg flex flex-col">
                <form action={formAction} className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex justify-between items-center bg-indigo-700 px-4 py-3 sm:px-6 rounded-t-xl">
                    <Dialog.Title className="text-lg font-semibold text-white">
                      {dialogTitle}
                    </Dialog.Title>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      <span className="sr-only">Close panel</span>
                      <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Description */}
                  {dialogDescription && (
                    <div className="mt-2 px-4 sm:px-6">
                      <p className="text-sm text-indigo-300">
                        {dialogDescription}
                      </p>
                    </div>
                  )}

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
                    {children}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-end px-4 py-3 sm:px-6">
                    {/* Delete Button */}
                    {onDelete && deleteButtonText && (
                      <button
                        type="button"
                        onClick={onDelete}
                        className="mr-4 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        {deleteButtonText}
                      </button>
                    )}

                    {/* Cancel and Form Action Buttons */}
                    <div className="  ">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      {formAction && buttonText && buttonText != "Search" && (
                        <FormButton
                          buttonText={buttonText || "Save"}
                          buttonPendingText={"Saving..."}
                          className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        />
                      )}
                    </div>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default FormModal;
