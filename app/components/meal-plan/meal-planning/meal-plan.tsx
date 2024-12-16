// app/meal-planner/dashboard/page.tsx
"use client";
import React, { useState, useCallback, useEffect } from "react";
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
import { IClientInterface } from "@/models/interfaces/client/client";
import { generateEmptySelections } from "@/util/meal-plan-utils";

type MealPlanSectionSectionProps = {
  mealPlanData: IMealPlan[] | undefined;
  recipesData: IRecipeInterface[] | undefined;
  clientId: number;
  // clientData: IClientInterface | undefined;
};

// TODO: Try to fix re-renders, and generate tests to do manual and automatically
const MealPlanSection: React.FC<MealPlanSectionSectionProps> = ({
  mealPlanData,
  recipesData,
  clientId,
  // clientData,
}) => {
  const [mealPlans, setMealPlans] = useState<IMealPlan[]>(mealPlanData || []);
  const [selectedLabel, setSelectedLabel] =
    useState<string>("Choose a meal plan");
  const defaultMealPlan: IMealPlan = {
    id: 0,
    clientId: clientId || 0,
    startDate: dayjs().startOf("week").toISOString(),
    endDate: dayjs().endOf("week").toISOString(),
    selection: generateEmptySelections(
      dayjs().startOf("week"),
      dayjs().endOf("week")
    ),
  };
  const today = dayjs();
  const initialMealPlan = getCurrentMealPlan(
    mealPlanData || [],
    today,
    mealPlans,
    defaultMealPlan
  );
  const [selectedMealPlan, setSelectedMealPlan] = useState<IMealPlan>(
    initialMealPlan || defaultMealPlan
  );

  console.log("mealPlanData", mealPlanData);
  const [formResult, setFormResult] = useState<FormResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [recipes, setRecipes] = useState<IRecipeInterface[]>(recipesData || []);
  const [recipesLoading, setRecipesLoading] = useState<boolean>(false);
  const [recipesError, setRecipesError] = useState<string | null>(null);

  const [confirmModalProps, setConfirmModalProps] =
    useState<ConfirmActionModalProps>({
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

  useEffect(() => {
    if (!mealPlanData) return;
    const today = dayjs();
    const initialMealPlan = getCurrentMealPlan(
      mealPlanData,
      today,
      mealPlans,
      defaultMealPlan
    );
    setSelectedMealPlan(initialMealPlan);
    setSelectedLabel(
      initialMealPlan.id === 0
        ? "New Meal Plan"
        : `${dayjs(initialMealPlan.startDate).format("DD/MM/YYYY")} - ${dayjs(
            initialMealPlan.endDate
          ).format("DD/MM/YYYY")}`
    );
  }, [mealPlanData, mealPlans]);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (selectedMealPlan.id === 0) {
        setRecipes([]);
        return;
      }
      setLoading(true);
      try {
        const response = await exponentialBackoffFetch(() =>
          fetch(`/api/recipes/${selectedMealPlan.id}`)
        );
        if (!response.ok) {
          throw new Error("Failed to fetch recipes.");
        }
        const data: IRecipeInterface[] = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error(error);
        setRecipesError("Failed to fetch recipes.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [selectedMealPlan.id]);

  const handleStartDateChange = (date: Dayjs | null) => {
    setSelectedMealPlan({
      ...selectedMealPlan,
      startDate: dayjs(date).toISOString(),
    });
  };

  const handleEndDateChange = (date: Dayjs | null) => {
    setSelectedMealPlan({
      ...selectedMealPlan,
      endDate: dayjs(date).toISOString(),
    });
  };

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
    setLoading(true);
    const result = await submitMealPlan(formData, selectedMealPlan.clientId);
    setFormResult(result);
    setLoading(false);
  }

  async function recreateMealsAction(formData: FormData) {
    setLoading(true);
    const result = await createMealPlan(recipes, selectedMealPlan);
    setFormResult(result);
    setLoading(false);
  }

  if (loading || isPending) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-lg font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="md:max-w-screen-xl lg:max-w-screen-2xl mx-auto p-6">
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

      <h2 className="text-2xl font-bold mb-4 text-gray-800">Meal Plan</h2>
      <form action={formAction} className="space-y-6">
        <div className="flex justify-around p-4">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              format="DD/MM/YYYY"
              label="Start Date"
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dayjs(selectedMealPlan.startDate)}
              onChange={handleStartDateChange}
            />
            <DatePicker
              format="DD/MM/YYYY"
              label="End Date"
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dayjs(selectedMealPlan.endDate)}
              onChange={handleEndDateChange}
              disabled={selectedMealPlan.startDate === null}
              minDate={dayjs(selectedMealPlan.startDate)}
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
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Save Meal Plan
          </button>
        </div>
      </form>

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
};

export default MealPlanSection;
function getCurrentMealPlan(
  mealPlanData: IMealPlan[],
  today: dayjs.Dayjs,
  mealPlans: IMealPlan[],
  defaultMealPlan: IMealPlan
) {
  const currentMealPlan = mealPlanData.find(
    (plan) =>
      dayjs(plan.startDate).isBefore(today) &&
      dayjs(plan.endDate).isAfter(today)
  );
  const initialMealPlan = currentMealPlan || mealPlans[0] || defaultMealPlan;
  return initialMealPlan;
}
