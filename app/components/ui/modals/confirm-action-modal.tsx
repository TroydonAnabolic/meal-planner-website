"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import {
  CheckIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

export type ConfirmActionModalProps = {
  open: boolean;
  onClose?: (open: boolean) => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  type?: "primary" | "warning" | "error" | "info"; // Add iconColor prop
  colorScheme?: string; // Add colorScheme prop
  onConfirm: () => void;
};

const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
  open,
  onClose = () => {},
  title,
  message,
  confirmText,
  cancelText,
  type = "primary", // Default value
  colorScheme = "bg-indigo-600 hover:bg-indigo-500", // Default value
  onConfirm,
}) => {
  const handleConfirm = () => {
    onConfirm();
  };
  return (
    <Dialog open={open} onClose={onClose} className="relative z-100">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-100 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div
                  className={
                    type === "primary"
                      ? "bg-green-100  mx-auto flex size-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:size-10"
                      : type === "error"
                      ? "bg-red-100  mx-auto flex size-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:size-10"
                      : type === "warning"
                      ? "bg-yellow-100  mx-auto flex size-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:size-10"
                      : "bg-green-100  mx-auto flex size-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:size-10"
                  }
                >
                  {type === "primary" ? (
                    <CheckIcon
                      aria-hidden="true"
                      className={"size-6 text-green-600"}
                    />
                  ) : type === "warning" ? (
                    <ExclamationCircleIcon
                      aria-hidden="true"
                      className={"size-6 text-yellow-600"}
                    />
                  ) : type === "error" ? (
                    <ExclamationTriangleIcon
                      aria-hidden="true"
                      className={"size-6 text-red-600"}
                    />
                  ) : type === "info" ? (
                    <InformationCircleIcon
                      aria-hidden="true"
                      className={"size-6 text-red-600"}
                    />
                  ) : (
                    <CheckIcon
                      aria-hidden="true"
                      className={"size-6 text-green-600"}
                    />
                  )}
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold text-gray-900"
                  >
                    {title}
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{message}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row sm:px-6">
              <button
                type="button"
                onClick={handleConfirm}
                className={`inline-flex w-full justify-center rounded-md ${colorScheme} px-3 py-2 mr-4 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto`}
              >
                {confirmText}
              </button>
              {cancelText && (
                <button
                  type="button"
                  data-autofocus
                  onClick={() => onClose(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  {cancelText}
                </button>
              )}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmActionModal;
