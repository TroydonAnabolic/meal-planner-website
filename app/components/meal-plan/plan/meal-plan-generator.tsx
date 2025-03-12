"use client";
import { IClientInterface } from "@/models/interfaces/client/client";
import { IMealPlanPreferences } from "@/models/interfaces/client/meal-planner-preferences";
import React, { forwardRef, useCallback, useEffect, useState } from "react";
import ActionPanelButton from "../../action-panel/action-panel-button";
import Image from "next/image";
import ConfirmActionModal, {
  ConfirmActionModalProps,
} from "../../ui/modals/confirm-action-modal";
import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import { FoodLoader } from "../../loader/food-loader";
import SummaryTable from "../meal-preferences/summary-table";
import Link from "next/link";
import EmptyStateDashedBorders from "../../empty-states/dashed-border";
import dayjs, { Dayjs } from "dayjs";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import RecipeList from "./recipe-list";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FilterRecipes from "./filter-recipes";
import ShoppingListTable from "../../shopping-list/shopping-list-table";
import { IShoppingListResult } from "@/models/interfaces/edamam/meal-planner/shopping-list-response";
import { IMealPlan } from "@/models/interfaces/diet/meal-plan";
import { Nutrients } from "@/constants/constants-enums";
import GlowyBanner from "../../ui/banner/banner-with-glow";
import { ROUTES } from "@/constants/routes";
import { startGenerateMealPlanAndRecipes } from "@/lib/client-side/meal-plan-generator";
import ToggleInput from "../../ui/inputs/toggle-input";
import { defaultMealPlanPreference } from "@/constants/constants-objects";
import { createMealPlan } from "@/lib/client-side/meal-plan";
import { useReactToPrint, UseReactToPrintFn } from "react-to-print";
import ReactDOMServer from "react-dom/server";
import { useSession } from "next-auth/react";

type MealPlanGeneratorProps = {
  clientData: IClientInterface;
  confirmModalProps: ConfirmActionModalProps;
  setConfirmModalProps: React.Dispatch<
    React.SetStateAction<ConfirmActionModalProps>
  >;
  isLoading: boolean | null;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const COOKIE_NAME = "lastMealPlanTime";
const COOKIE_EXPIRATION_MINUTES = 5;

const getCookie = (name: string) => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
};

const setCookie = (name: string, value: string, minutes: number) => {
  const date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
};

const MealPlanGenerator = forwardRef<HTMLDivElement, MealPlanGeneratorProps>(
  (
    {
      //initialMealPlan,
      clientData,
      confirmModalProps,
      setConfirmModalProps,
      isLoading,
      setIsLoading
    },
    ref
  ) => {
    const [excluded, setExcluded] = useState<string[]>([]);
    const [recipes, setRecipes] = useState<IRecipeInterface[]>([]);
    const [mealPlan, setMealPlan] = useState<IMealPlan | null>(null);
    const [mealPlanPreferences, setMealPlanPreferences] =
      useState<IMealPlanPreferences | null>(
        clientData.ClientSettingsDto?.mealPlanPreferences ||
        defaultMealPlanPreference
      );
    const [emailLoading, setEmailLoading] = useState(false);
    const { data: session, status } = useSession();
    const [useFavouriteRecipes, setUseFavouriteRecipes] =
      useState<boolean>(false);
    const [isBannedOpen, setIsBannedOpen] = useState<boolean>(true);
    const [isBugBannerOpen, setIsBugBannerOpen] = useState<boolean>(true);

    const [startDate, setStartDate] = useState<Dayjs | null>(
      dayjs().startOf("week")
    );
    const [endDate, setEndDate] = useState<Dayjs | null>(dayjs().endOf("week"));

    const [timeToCook, setTimeToCook] = useState<dayjs.Dayjs | null>(null);
    const [shoppingList, setShoppingList] = useState<IShoppingListResult | null>({
      entries: [],
    });
    const [minEnergy, setMinEnergy] = useState<number | undefined>(
      clientData.ClientSettingsDto?.mealPlanPreferences?.plan.fit
        ? clientData.ClientSettingsDto?.mealPlanPreferences?.plan.fit[
          Nutrients.ENERC_KCAL
        ].min
        : undefined
    );
    const [maxEnergy, setMaxEnergy] = useState<number | undefined>(
      clientData.ClientSettingsDto?.mealPlanPreferences?.plan.fit
        ? clientData.ClientSettingsDto?.mealPlanPreferences?.plan.fit[
          Nutrients.ENERC_KCAL
        ].max
        : undefined
    );
    const componentRef = React.useRef(null);

    const closeConfirmModal = useCallback(() => {
      setIsLoading(false);
      setConfirmModalProps({
        open: false,
        title: "",
        message: "",
        confirmText: "",
        colorScheme: "",
        onConfirm: () => { },
        cancelText: "",
        onClose: () => { },
        type: "primary",
      });
    }, []);

    const handleMinEnergyChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const value = event.target.value
        ? parseInt(event.target.value, 10)
        : undefined;

      setMinEnergy(value); // Update the local state for minimum energy.

      // Safely update the mealPlanPreferences with immutability.
      const updatedMealPlanPreferences: IMealPlanPreferences = {
        ...mealPlanPreferences!,
        plan: {
          ...mealPlanPreferences?.plan,
          fit: {
            ...mealPlanPreferences?.plan.fit,
            ENERC_KCAL: {
              ...mealPlanPreferences?.plan.fit?.ENERC_KCAL,
              min: value, // Update the min value for ENERC_KCAL.
            },
          },
        },
      };

      setMealPlanPreferences(updatedMealPlanPreferences);
    };

    const handleMaxEnergyChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const value = event.target.value
        ? parseInt(event.target.value, 10)
        : undefined;
      setMaxEnergy(value);

      // Safely update the mealPlanPreferences with immutability.
      const updatedMealPlanPreferences: IMealPlanPreferences = {
        ...mealPlanPreferences!,
        plan: {
          ...mealPlanPreferences?.plan,
          fit: {
            ...mealPlanPreferences?.plan.fit,
            ENERC_KCAL: {
              ...mealPlanPreferences?.plan.fit?.ENERC_KCAL,
              max: value, // Update the min value for ENERC_KCAL.
            },
          },
        },
      };

      setMealPlanPreferences(updatedMealPlanPreferences);
    };

    const handleToggleFavourite = useCallback(
      (isFavourite: boolean) => {
        if (isFavourite) {
          setConfirmModalProps({
            open: true,
            title: "Use Favourites",
            message:
              "Favourited recipes that match the corresponding meal type (e.g. lunch/dinner) and scheduled time will replace the generated recipes in your meal plan.",
            confirmText: "OK",
            colorScheme: "bg-blue-600 hover:bg-blue-500",
            onConfirm: closeConfirmModal,
            cancelText: "",
            onClose: () => { },
            type: "info",
          });
        }

        setUseFavouriteRecipes(isFavourite);
      },
      [setConfirmModalProps, closeConfirmModal, setUseFavouriteRecipes]
    );

    const renderMealPlanToHTML = (mealPlanSection: any): string => {
      return ReactDOMServer.renderToStaticMarkup(mealPlanSection);
    };

    const handleEmailMealPlan = React.useCallback(async () => {
      const mealPlanHtml = renderMealPlanToHTML(RecipeListContainer());

      try {
        setEmailLoading(true);
        const response = await fetch("/api/email/meal-plan", {
          method: "POST",
          body: JSON.stringify({
            mealPlanHtml,
            mealPlans: [mealPlan],
            recipes,
            clientId: clientData.Id,
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
          onClose: () => { },
          type: "primary",
        });
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to email meal plan. Please try again later.");
      } finally {
        setEmailLoading(false);
      }
    }, [mealPlan, recipes, clientData, session]);


    const handleGenerateMealPlan = async () => {
      setIsLoading(true);
      setMealPlan(null);
      setRecipes([]);

      // when user not authorized, disallow user to regenerate meal plan for 5 mins
      let canUnAuthGenerate = true;

      canUnAuthGenerate = runDelayForUnAuthorized(
        clientData,
        setConfirmModalProps,
        closeConfirmModal,
        canUnAuthGenerate
      );

      if (!canUnAuthGenerate) {
        setIsLoading(false);
        return;
      }

      if (!startDate || !endDate) {
        setConfirmModalProps({
          open: true,
          title: "Invalid Date Range",
          message: "Please select a valid date range.",
          confirmText: "OK",
          onConfirm: closeConfirmModal,
          colorScheme: "bg-red-600 hover:bg-red-500",
          cancelText: "",
          onClose: () => { },
          type: "warning",
        });
        setIsLoading(false); // Stop loading if validation fails
        return;
      }

      if (!mealPlanPreferences || !mealPlanPreferences.plan.sections) {
        setConfirmModalProps((prev) => ({
          ...prev,
          open: true,
          title: "Warning",
          message:
            "Meal plan preferences are missing. At minimum, you require date range and min and max calorie for all meals, and at least one meal type",
          confirmText: "OK",
          onConfirm: () => {
            closeConfirmModal();
          },
          colorScheme: "bg-yellow-600 hover:bg-yellow-500",
          cancelText: "",
          type: "warning",
          onCancel: () => { },
        }));
        setIsLoading(false);
        return;
      }

      // fetch meal plan, this will have recipes attached to it
      try {
        const { generatedMealPlan, favouriteRecipes, fetchedRecipes } =
          await startGenerateMealPlanAndRecipes(
            endDate,
            startDate,
            mealPlanPreferences,
            excluded,
            useFavouriteRecipes,
            clientData
          );

        setMealPlan({
          ...generatedMealPlan,
          id: mealPlan?.id || 0,
          clientId: clientData.Id,
          startDate: startDate?.toISOString() || "",
          endDate: endDate?.toISOString() || "",
          autoLogMeals: true,
        });

        setRecipes(fetchedRecipes);
      } catch (error: any) {
        console.error("Failed to generate meal plan:", error);
        setConfirmModalProps((prev) => ({
          ...prev,
          open: true,
          title: "Error",
          message: error.message,
          confirmText: "OK",
          type: "error",
          onConfirm: () => {
            closeConfirmModal();
          },
          cancelText: "",
          onCancel: () => { },
          colorScheme: "bg-red-600 hover:bg-red-500",
        }));
      } finally {
        setIsLoading(false);
      }
    };

    const handleStartDateChange = (date: Dayjs | null) => {
      setStartDate(date);
      if (endDate && date && date.isAfter(endDate)) {
        setEndDate(date.endOf("week"));
      }
    };

    const handleEndDateChange = (date: Dayjs | null) => {
      setEndDate(date);
    };

    // set banner open when no meal plan preferences exist
    useEffect(() => {
      if (
        clientData.Id &&
        clientData.isStripeBasicActive &&
        !mealPlanPreferences?.size &&
        !mealPlanPreferences?.plan.accept
      ) {
        setIsBannedOpen(true);
      }
    }, []);

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
    const RecipeListContainer = () => {
      return (
        <div ref={ref} className={shoppingList ? "w-3/4" : ""}>
          {!isLoading && recipes?.length > 0 && (
            <RecipeList
              mealPlan={mealPlan!}
              recipes={recipes}
              startDate={startDate}
              endDate={endDate}
            />
          )}

          {/* Empty State */}
          {recipes?.length === 0 && (
            <EmptyStateDashedBorders>
              {/* Bowl of Fruits SVG Path */}

              {!isLoading && (
                <>
                  <span className="mt-4 block text-lg font-semibold text-gray-300">
                    Your meal plan will appear here once generated. Start by
                    clicking &apos; Generate Meal Plan&apos;!
                  </span>
                  <Image
                    className="opacity-50"
                    src="/aiimages/food/fruits-basket.svg"
                    alt="Empty State"
                    width={64}
                    height={64}
                  />
                </>
              )}
              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex justify-center my-6">
                  <FoodLoader />
                </div>
              )}
            </EmptyStateDashedBorders>
          )}
        </div>
      )
    }

    return (
      <div >
        {isBannedOpen && clientData.Id > 0 && (
          <div className="mx-auto mb-2">
            <GlowyBanner
              title={"Note"}
              subtitle={
                "You have not set any specific preferences for your meals"
              }
              link={ROUTES.MEAL_PLANNER.MEAL_PREFERENCES}
              linkText="Click here to personalize meal plan to refine generator results"
              onDismiss={() => setIsBannedOpen(false)}
            />
          </div>
        )}
        {isBugBannerOpen && clientData.Id > 0 && (
          <div className="mx-auto mb-2">
            <GlowyBanner
              title={"WARNING"}
              subtitle={
                "Existing bug, only one of health labels, diet labels, cautions, or cuisine can be set. E.g. if a health label is set, then you cannot set any diet labels, caution labels, or cuisine labels, or vice versa if you set a diet label, you cannot set a health label etc."
              }
              link={ROUTES.MEAL_PLANNER.MEAL_PREFERENCES}
              linkText="Click here to fix meal preferences"
              onDismiss={() => setIsBugBannerOpen(false)}
            />
          </div>
        )}

        <div className="mx-auto p-4 flex flex-col items-center justify-center max-w-7xl min-h-screen">

          {!isLoading && (
            <ActionButton
              onClick={handleEmailMealPlan}
              disabled={emailLoading}
              text="Email Meal Plan"
              isLoading={emailLoading}
              additionalClasses="top-32 right-14"
            />
          )}

          <h1 className="text-2xl font-bold p-4 text-gray-800">
            Plan Your Meals
          </h1>
          <div className="w-full md:max-w-screen-xl lg:max-w-screen-2xl">
            <div className="mt-4 flex space-x-4 items-start ">
              <div className="w-1/2 flex flex-col space-y-8">
                <ActionPanelButton
                  title="Generate Meal Plan"
                  description={
                    <>
                      <ul className="list-disc list-inside text-sm text-gray-500">
                        <li>
                          Edit your meal preferences to refine the results for
                          meal plan generation.
                        </li>
                        <li>
                          Add filter recipes to exclude specific items from the
                          search.
                        </li>
                        <li>
                          Input the number of days you want recipes generated for.
                        </li>
                      </ul>
                    </>
                  }
                  buttonText="Generate Meal Plan"
                  //    disabled={isBannedOpen}
                  onClick={handleGenerateMealPlan}
                  icon={<PrecisionManufacturingIcon />}
                />

                <div className="flex flex-col mt-4 space-y-4">
                  {/* Date Pickers */}
                  {clientData.Id > 0 && clientData.isStripeBasicActive && (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <div className="flex justify-around space-x-4">
                        <DatePicker
                          format="DD/MM/YYYY"
                          label="Start Date"
                          value={startDate}
                          onChange={handleStartDateChange}
                        />
                        <DatePicker
                          format="DD/MM/YYYY"
                          label="End Date"
                          value={endDate}
                          onChange={handleEndDateChange}
                          disabled={startDate === null}
                          minDate={startDate!}
                        />
                      </div>
                    </LocalizationProvider>
                  )}

                  {/* Energy and Toggle Inputs */}
                  <div className="flex justify-around items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium text-gray-700">
                        Min Energy
                      </label>
                      <input
                        type="number"
                        value={minEnergy || ""}
                        onChange={handleMinEnergyChange}
                        className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium text-gray-700">
                        Max Energy
                      </label>
                      <input
                        type="number"
                        value={maxEnergy || ""}
                        onChange={handleMaxEnergyChange}
                        className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700"
                      />
                    </div>

                    {clientData.Id > 0 && clientData.isStripeBasicActive && (
                      <div className="ml-4">
                        <ToggleInput
                          label="Favourites"
                          subLabel=""
                          enabled={useFavouriteRecipes}
                          onChange={handleToggleFavourite}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {clientData.Id > 0 && clientData.isStripeBasicActive && (
                <div className="w-1/2">
                  <FilterRecipes
                    title="Filter Recipes"
                    excluded={excluded}
                    setExcluded={setExcluded}
                    timeToCook={timeToCook}
                    setTimeToCook={setTimeToCook}
                  />
                </div>
              )}
            </div>

            <div className="mt-6 flex space-x-4">
              {/* Recipes Grid or Empty State */}
              <RecipeListContainer />

              {/* Shopping List Table */}
              {clientData.Id > 0 &&
                clientData.isStripeBasicActive &&
                mealPlan &&
                recipes?.length > 0 && (
                  <div className="w-1/4 text-gray-800">
                    <ShoppingListTable
                      recipes={recipes}
                      shoppingList={shoppingList}
                      setShoppingList={setShoppingList}
                    />
                  </div>
                )}
            </div>

            {clientData.Id > 0 && clientData.isStripeBasicActive ? (
              <span className="text-sm text-gray-500 ">
                <Link
                  title="Edit Meal Preferences"
                  href={"./meal-preferences"}
                  className="mt-4 mr-1 inline-flex justify-center\u00A0py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Edit Meal Preferences
                </Link>
                to customize your meal plan preferences.
              </span>
            ) : (
              // TODO: Add a input to edit preferences if session is not present
              <h3>Edit demo preferences component goes here</h3>
            )}

            <SummaryTable mealPlanPreferences={mealPlanPreferences!} />

            {confirmModalProps && confirmModalProps.open && (
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
        </div>
      </div>
    );
  }
);

export default MealPlanGenerator;

function runDelayForUnAuthorized(
  client: IClientInterface,
  setConfirmModalProps: React.Dispatch<
    React.SetStateAction<ConfirmActionModalProps>
  >,
  closeConfirmModal: () => void,
  canUnAuthGenerate: boolean
) {
  // TODO: check when logged in if !isStripeBasicActive allows this to run for no active subscriptions
  if (!(client.Id > 0) || !client.isStripeBasicActive) {
    const lastMealPlanTime = getCookie(COOKIE_NAME);
    const now = new Date().getTime();
    if (lastMealPlanTime) {
      const remainingTime =
        COOKIE_EXPIRATION_MINUTES * 60 * 1000 -
        (now - Number(lastMealPlanTime));

      if (remainingTime > 0) {
        setConfirmModalProps({
          open: true,
          title: "Please Wait",
          message: `You can only generate a meal plan once every ${COOKIE_EXPIRATION_MINUTES} minutes. Please try again in ${Math.ceil(
            remainingTime / 60000
          )} minutes.`,
          confirmText: "OK",
          onConfirm: closeConfirmModal,
          colorScheme: "bg-yellow-600 hover:bg-yellow-500",
          cancelText: "",
          type: "warning",
        });
        return false;
      }
      canUnAuthGenerate = true;
    }

    setCookie(COOKIE_NAME, String(now), COOKIE_EXPIRATION_MINUTES);
  }
  return canUnAuthGenerate;
}
