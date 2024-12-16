// PanelWithBorders.tsx
import React from "react";

export type Step = {
  id: string;
  name: string;
  description: string;
  href: string;
  status: "current" | "upcoming";
};

interface PanelWithBordersProps {
  steps: Step[];
  currentStepId: string;
  onStepChange: (stepId: string) => void;
}

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}

const PanelWithBorders: React.FC<PanelWithBordersProps> = ({
  steps,
  currentStepId,
  onStepChange,
}) => {
  return (
    <div className="lg:border-b lg:border-t lg:border-gray-200">
      <nav
        aria-label="Progress"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <ol
          role="list"
          className="overflow-hidden rounded-md lg:flex lg:rounded-none lg:border-l lg:border-r lg:border-gray-200"
        >
          {steps.map((step, stepIdx) => (
            <li key={step.id} className="relative overflow-hidden lg:flex-1">
              <div
                className={classNames(
                  stepIdx === 0 ? "rounded-t-md border-b-0" : "",
                  stepIdx === steps.length - 1 ? "rounded-b-md border-t-0" : "",
                  "overflow-hidden border border-gray-200 lg:border-0"
                )}
              >
                <button
                  type="button"
                  onClick={() => onStepChange(step.id)}
                  className="group w-full text-left focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-current={step.status === "current" ? "step" : undefined}
                >
                  {step.status === "current" ? (
                    <span className="flex items-start px-6 py-5 text-sm font-medium">
                      <span className="flex-shrink-0">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-indigo-600">
                          <span className="text-indigo-600">{stepIdx + 1}</span>
                        </span>
                      </span>
                      <span className="ml-4 mt-0.5 flex min-w-0 flex-col">
                        <span className="text-sm font-medium text-indigo-600">
                          {step.name}
                        </span>
                        <span className="text-sm font-medium text-gray-500">
                          {step.description}
                        </span>
                      </span>
                    </span>
                  ) : (
                    <span className="flex items-start px-6 py-5 text-sm font-medium">
                      <span className="flex-shrink-0">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300">
                          <span className="text-gray-500">{stepIdx + 1}</span>
                        </span>
                      </span>
                      <span className="ml-4 mt-0.5 flex min-w-0 flex-col">
                        <span className="text-sm font-medium text-gray-500">
                          {step.name}
                        </span>
                        <span className="text-sm font-medium text-gray-500">
                          {step.description}
                        </span>
                      </span>
                    </span>
                  )}

                  {stepIdx !== 0 && (
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 left-0 top-0 hidden w-3 lg:block"
                    >
                      <svg
                        fill="none"
                        viewBox="0 0 12 82"
                        preserveAspectRatio="none"
                        className="h-full w-full text-gray-300"
                      >
                        <path
                          d="M0.5 0V31L10.5 41L0.5 51V82"
                          stroke="currentColor"
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default PanelWithBorders;
