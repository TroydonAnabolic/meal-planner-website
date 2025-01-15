"use client";
import { IMealPlan } from "@/models/interfaces/diet/meal-plan";
import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import React, { useEffect, useState } from "react";
import { useReactToPrint } from "react-to-print";
import MealPlanSection from "./meal-plan-section";
import { useSession } from "next-auth/react";
import {
  generateEmptySelections,
  getCurrentMealPlan,
  getDefaultMealPlan,
} from "@/util/meal-plan-utils";
import dayjs from "dayjs";
import { ConfirmActionModalProps } from "../../ui/modals/confirm-action-modal";
import ReactDOMServer from "react-dom/server";

interface MealPlanProps {
  mealPlanData: IMealPlan[] | undefined;
  recipesData: IRecipeInterface[] | undefined;
  clientId: number;
}

const MealPlan: React.FC<MealPlanProps> = ({
  mealPlanData,
  recipesData,
  clientId,
}) => {
  const componentRef = React.useRef(null);
  const { data: session, status } = useSession();
  const [emailLoading, setEmailLoading] = useState(false);
  const [isPending, setIsPending] = useState<boolean>(false);

  const [recipes, setRecipes] = useState<IRecipeInterface[]>(recipesData || []);
  const [recipesLoading, setRecipesLoading] = useState<boolean>(false);
  const [recipesError, setRecipesError] = useState<string | null>(null);
  const [mealPlans, setMealPlans] = useState<IMealPlan[]>(mealPlanData || []);
  const [loading, setLoading] = useState<boolean>(false);

  const [selectedLabel, setSelectedLabel] =
    useState<string>("Choose a meal plan");
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

  const defaultMealPlan: IMealPlan = getDefaultMealPlan(clientId);
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
  // sets selected meal plan
  useEffect(() => {
    const fetchAndSetRecipes = async (mealPlan: IMealPlan) => {
      if (mealPlan.id === 0) {
        setRecipes([]);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`/api/recipes/${mealPlan.id}`);
        if (!response.ok) throw new Error("Failed to fetch recipes.");
        const data: IRecipeInterface[] = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error(error);
        setRecipesError("Failed to fetch recipes.");
      } finally {
        setLoading(false);
      }
    };

    if (mealPlanData) {
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

      fetchAndSetRecipes(initialMealPlan); // Fetch recipes for the selected meal plan.
    }
  }, [mealPlanData, mealPlans]);

  const handleAfterPrint = React.useCallback(() => {
    console.log("`onAfterPrint` called");
  }, []);

  const handleBeforePrint = React.useCallback(() => {
    console.log("`onBeforePrint` called");
    return Promise.resolve();
  }, []);

  const printFn = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "AwesomeFileName",
    onAfterPrint: handleAfterPrint,
    onBeforePrint: handleBeforePrint,
  });

  const renderMealPlanToHTML = (mealPlanSection: any): string => {
    return ReactDOMServer.renderToStaticMarkup(mealPlanSection);
  };

  const handleEmailMealPlan = React.useCallback(async () => {
    const mealPlanHtml = renderMealPlanToHTML(MealPlanContainer());

    try {
      setEmailLoading(true);
      const response = await fetch("/api/email/meal-plan", {
        method: "POST",
        body: JSON.stringify({
          mealPlanHtml,
          mealPlans,
          recipes,
          clientId,
          toEmail: session?.user.email,
          givenName: session?.user.givenName,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      setConfirmModalProps({
        open: true,
        title: "Meal plan emailed successfully!",
        message: "Meal plan emailed successfully!",
        confirmText: "OK",
        onConfirm: () => {
          setConfirmModalProps({
            ...confirmModalProps,
            open: false,
          });
        },
        cancelText: "",
        onClose: () => {},
        type: "primary",
      });
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to email meal plan. Please try again later.");
    } finally {
      setEmailLoading(false);
    }
  }, [mealPlanData, recipesData, clientId, session]);

  if (loading || isPending) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-lg font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  const ActionButton = ({
    onClick,
    disabled = false,
    text,
    isLoading = false,
    additionalClasses = "",
  }: {
    onClick: () => void;
    disabled?: boolean;
    text: string;
    isLoading?: boolean;
    additionalClasses?: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`absolute z-10 w-60 px-6 py-2 mb-8 bg-gray-400 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:bg-gray-300 ${additionalClasses}`}
    >
      {isLoading ? "Processing..." : text}
    </button>
  );

  const MealPlanContainer = () => {
    return (
      <div className="relative">
        <ActionButton
          onClick={() => printFn()}
          text="Print Meal Plan"
          additionalClasses="top-20 right-14"
        />

        <ActionButton
          onClick={handleEmailMealPlan}
          disabled={emailLoading}
          text="Email Meal Plan"
          isLoading={emailLoading}
          additionalClasses="top-32 right-14"
        />

        <MealPlanSection
          initialMealPlan={initialMealPlan}
          selectedMealPlan={selectedMealPlan}
          mealPlans={mealPlans}
          setMealPlans={setMealPlans}
          setSelectedMealPlan={setSelectedMealPlan}
          recipesLoading={recipesLoading}
          recipesError={recipesError}
          selectedLabel={selectedLabel}
          setSelectedLabel={setSelectedLabel}
          recipes={recipes}
          clientId={clientId}
          confirmModalProps={confirmModalProps}
          setConfirmModalProps={setConfirmModalProps}
          ref={componentRef}
        />
      </div>
    );
  };

  return <MealPlanContainer />;
};

export default MealPlan;
