// app/meal-planner/dashboard/page.tsx
"use client";
import React, { useState, useCallback, useEffect, forwardRef } from "react";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
import { createMealPlan, submitMealPlan } from "@/actions/meal-plan-action";
import { IMealPlan } from "@/models/interfaces/diet/meal-plan";
import { FormResult } from "@/types/form";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import RecipeList from "../plan/recipe-list";
import ConfirmActionModal, {
  ConfirmActionModalProps,
} from "../../ui/modals/confirm-action-modal";
import ActionPanelButton from "../../action-panel/action-panel-button";
import { exponentialBackoffFetch } from "@/lib/http/exponential-back-off";
import LabelDropdown from "../../ui/inputs/label-dropdown";
import {
  generateEmptySelections,
  getDefaultMealPlan,
} from "@/util/meal-plan-utils";
import GlowyBanner from "../../ui/banner/banner-with-glow";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/constants/routes";

type MealPlanSectionProps = {
  initialMealPlan: IMealPlan;
  selectedMealPlan: IMealPlan;
  mealPlans: IMealPlan[];
  setMealPlans: React.Dispatch<React.SetStateAction<IMealPlan[]>>;
  setSelectedMealPlan: React.Dispatch<React.SetStateAction<IMealPlan>>;
  recipesLoading: boolean;
  recipesError: string | null;
  selectedLabel: string;
  setSelectedLabel: React.Dispatch<React.SetStateAction<string>>;
  recipes: IRecipeInterface[];
  clientId: number;
  confirmModalProps: ConfirmActionModalProps;
  setConfirmModalProps: React.Dispatch<
    React.SetStateAction<ConfirmActionModalProps>
  >;
};

// TODO: Try to fix re-renders, and generate tests to do manual and automatically
const MealPlanSection = forwardRef<HTMLDivElement, MealPlanSectionProps>(
  (
    {
      initialMealPlan,
      selectedMealPlan,
      setSelectedMealPlan,
      mealPlans,
      setMealPlans,
      recipesLoading,
      recipesError,
      selectedLabel,
      setSelectedLabel,
      recipes,
      clientId,
      confirmModalProps,
      setConfirmModalProps,
    },
    ref
  ) => {
    const [formResult, setFormResult] = useState<FormResult | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isBannedOpen, setIsBannedOpen] = useState<boolean>(true);
    const defaultMealPlan: IMealPlan = getDefaultMealPlan(clientId);

    const closeConfirmModal = useCallback(() => {
      setConfirmModalProps({
        open: false,
        title: "",
        message: "",
        confirmText: "",
        colorScheme: "",
        onConfirm: () => {},
        cancelText: "",
        onClose: () => {},
        type: "primary",
      });
    }, []);

    // extract start and end date from selected option and then set selected meal plan
    const handleMealPlanChange = (selectedId: string) => {
      if (selectedId === "new") {
        setSelectedMealPlan(defaultMealPlan);
        setSelectedLabel("New Meal Plan");
        return;
      }
      const id = Number(selectedId);
      const selected = mealPlans.find((plan) => plan.id === id);
      if (selected) {
        setSelectedMealPlan(selected);
        setSelectedLabel(
          `${dayjs(selected.startDate).format("DD/MM/YYYY")} - ${dayjs(
            selected.endDate
          ).format("DD/MM/YYYY")}`
        );
      }
    };

    // Handle form submission using formAction
    async function formAction(formData: FormData) {
      const mealPlanId = formData.get("mealPlan") as unknown as number;

      selectedMealPlan.id =
        selectedMealPlan.id > 0 ? selectedMealPlan.id : mealPlanId;

      setLoading(true);
      const result = await submitMealPlan(initialMealPlan, selectedMealPlan);
      setFormResult(result);
      setLoading(false);
    }

    async function recreateMealsAction(formData: FormData) {
      setLoading(true);
      const result = await createMealPlan(recipes, selectedMealPlan);
      setFormResult(result);
      setLoading(false);
    }

    return (
      <div
        className="md:max-w-screen-xl lg:max-w-screen-2xl mx-auto p-6"
        ref={ref}
      >
        {isBannedOpen && (
          <div className="mb-2">
            <GlowyBanner
              title={"Warning"}
              subtitle={
                "Existing bug - when you refresh the page you have to close browser and reopen, and clear your browser cache."
              }
              onDismiss={() => setIsBannedOpen(false)}
            />
          </div>
        )}
        {/* Meal Plan Selector */}
        <div className="mb-6 w-1/3 max-w-xs">
          <LabelDropdown
            label="Select Meal Plan"
            name="mealPlan"
            buttonLabel={selectedLabel}
            value={selectedMealPlan.id.toString()} // Passed value prop
            options={[
              {
                label: "New Meal Plan",
                value: "new",
                onClick: () => handleMealPlanChange("new"),
              },
              ...mealPlans.map((plan) => ({
                label: `${dayjs(plan.startDate).format("DD/MM/YYYY")} - ${dayjs(
                  plan.endDate
                ).format("DD/MM/YYYY")}`,
                value: plan.id.toString(),
                onClick: () => handleMealPlanChange(plan.id.toString()),
              })),
            ]}
          />
        </div>

        <div className="relative">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Meal Plan</h2>

          <form action={formAction} className="space-y-6 mt-10">
            <div className="flex justify-around p-4">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  format="DD/MM/YYYY"
                  label="Start Date"
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={dayjs(selectedMealPlan.startDate)}
                  disabled
                  // onChange={handleStartDateChange}
                />
                <DatePicker
                  format="DD/MM/YYYY"
                  label="End Date"
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={dayjs(selectedMealPlan.endDate)}
                  // onChange={handleEndDateChange}
                  disabled
                />
              </LocalizationProvider>
            </div>

            {/* Selection Items */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Recipes for Meals
              </h3>
              {/* Recipes Loading/Error */}
              {recipesLoading && (
                <div className="mt-4 flex justify-center items-center">
                  <div className="text-gray-700">Loading recipes...</div>
                </div>
              )}
              {recipesError && (
                <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md">
                  {recipesError}
                </div>
              )}
              {/* Render RecipeList when recipes are loaded */}
              {!recipesLoading && !recipesError && (
                <div className="mt-6">
                  <RecipeList
                    recipes={recipes}
                    mealPlan={selectedMealPlan}
                    //   clientData={clientData}
                    startDate={dayjs(selectedMealPlan.startDate)}
                    endDate={dayjs(selectedMealPlan.endDate)}
                    allowEmptyRows={true}
                    mode={selectedMealPlan.id === 0 ? "add" : "edit"} // Set mode based on meal plan
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="w-60 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Save Meal Plan
              </button>
            </div>
          </form>

          {selectedMealPlan && selectedMealPlan.id > 0 && (
            <form>
              {/* Delete Meal Plan Button */}
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() =>
                    setConfirmModalProps({
                      open: true,
                      title: "Delete Meal Plan",
                      message: `Are you sure you want to delete the meal plan "${selectedLabel}"? This action cannot be undone.`,
                      confirmText: "Delete",
                      cancelText: "Cancel",
                      colorScheme: "bg-red-600 hover:bg-red-500",
                      onConfirm: async () => {
                        try {
                          setLoading(true);
                          const response = await fetch(
                            `/api/meal-plans/delete/${selectedMealPlan.id}`,
                            {
                              method: "DELETE",
                            }
                          );
                          if (!response.ok) {
                            throw new Error("Failed to delete the meal plan.");
                          }

                          revalidatePath(ROUTES.MEAL_PLANNER.MEAL_PLAN);

                          setMealPlans((prev) =>
                            prev.filter(
                              (plan) => plan.id !== selectedMealPlan.id
                            )
                          );
                          setSelectedMealPlan(defaultMealPlan);
                          setSelectedLabel("New Meal Plan");
                        } catch (error) {
                          console.error(error);
                          alert("Error deleting the meal plan.");
                        } finally {
                          setLoading(false);
                          closeConfirmModal();
                        }
                      },
                      onClose: closeConfirmModal,
                      type: "warning",
                    })
                  }
                  className="w-60 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete Meal Plan
                </button>
              </div>
            </form>
          )}
        </div>
        {/* Recreate Meals for meal plan */}
        <form action={recreateMealsAction} className="space-y-6 mt-8 border ">
          {/* Action Panel for Submitting the Form */}
          <ActionPanelButton
            title="Recreate Meal Plans"
            description="Review your meal selections and submit your meal plan, this will replace all meals for current meal plan."
            buttonText="Recreate Meals"
            type="submit"
            onClick={() => {
              /* Optional: Additional click handling */
            }}
            className="bg-white text-black"
          />
        </form>

        {/* Form Result */}
        {formResult && (
          <div
            className={`mt-4 p-4 rounded-md ${
              formResult.success
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {formResult.success
              ? "Meal plan saved successfully!"
              : formResult.errors?.general}
          </div>
        )}
        {confirmModalProps.open && (
          <ConfirmActionModal
            open={confirmModalProps.open}
            onClose={closeConfirmModal}
            title={confirmModalProps.title}
            message={confirmModalProps.message}
            confirmText={confirmModalProps.confirmText}
            cancelText={confirmModalProps.cancelText}
            onConfirm={confirmModalProps.onConfirm}
            colorScheme={confirmModalProps.colorScheme}
          />
        )}
      </div>
    );
  }
);

MealPlanSection.displayName = "MealPlanSection"; // Helpful for debugging with forwardRef

export default MealPlanSection;
