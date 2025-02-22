import React, { useState, useEffect, useCallback } from "react";

import { IMealInterface } from "@/models/interfaces/meal/Meal";
import { fetchEdamamRecipes } from "@/lib/client-side/edamam";
import TabsWithPills from "../ui/tabs-in-pills";
import FormModal from "../ui/modals/form-modal";
import { getEnumKeysByValues } from "@/util/enum-util";
import { MealType, UrlAction } from "@/constants/constants-enums";
import { FormActionType } from "@/models/interfaces/types";
import MealInputFields from "./meal-input-fields";
import MealSearchResultsGrid from "./meal-search-results-grid";
import { mapRecipeToMeal } from "@/util/mappers";
import { usePathname, useSearchParams } from "next/navigation";
import {
  FacebookShareButton,
  FacebookIcon,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
  TwitterShareButton,
  TwitterIcon,
  EmailShareButton,
  EmailIcon,
} from "react-share";
import { macros, nutrientFields } from "@/util/nutrients";

type MealModalContentProps = {
  action: FormActionType | "Search";
  setAction: React.Dispatch<React.SetStateAction<FormActionType | "Search">>;
  page: number;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mealAction: (meal: IMealInterface) => void;
  meal: IMealInterface;
  setMeal: React.Dispatch<React.SetStateAction<IMealInterface | undefined>>;
  deleteButtonText?: string;
  onDelete?: () => void;
  onClose?: () => void;
};

const MealModalContent: React.FC<MealModalContentProps> = ({
  action,
  setAction,
  page,
  open,
  setOpen,
  mealAction,
  meal,
  setMeal,
  deleteButtonText,
  onDelete,
  onClose,
}) => {
  // Define the default active tab based on the current action
  const getDefaultActiveTab = () => {
    switch (action) {
      case "Add":
        return "Add Meal";
      case "Search":
        return "Search Meals";
      case "View":
        return "View Meal";
      case "Edit":
        return "Edit Meal";
      default:
        return "Search Meals";
    }
  };
  // Initialize activeTab based on the initial action
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>(getDefaultActiveTab());
  const [searchMealSelected, setSearchMealSelected] = useState<boolean>(false);
  const [showShareIcons, setShowShareIcons] = useState(false);

  const searchParams = useSearchParams();
  const actionParam = searchParams.get("action");
  // Reset activeTab when the modal is opened
  useEffect(() => {
    if (open) {
      setActiveTab(getDefaultActiveTab());
    }
  }, [open, action]);

  // State for search query in 'Find New Meal' tab
  const [searchQuery, setSearchQuery] = useState<string>("");

  // State to hold search results from Edamam API
  const [searchResults, setSearchResults] = useState<IMealInterface[]>([]);

  // Loading and error states for search functionality
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  // Define tabs based on the current action
  const tabs =
    action === "Add" || actionParam === UrlAction.Add || action === "Search"
      ? [
          {
            name: "Search Meals",
            href: "#",
            current: activeTab === "Search Meals",
          },
          {
            name: "Add Meal",
            href: "#",
            current: activeTab === "Add Meal",
          },
        ]
      : [
          {
            name: "View Meal",
            href: "#",
            current: activeTab === "View Meal",
          },
          {
            name: "Edit Meal",
            href: "#",
            current: activeTab === "Edit Meal",
          },
        ];

  const handleEditMeal = useCallback(() => {
    setAction("Edit");

    const params = new URLSearchParams(window.location.search);
    params.set("action", UrlAction.Edit);
    params.set("id", String(meal.id));
    window.history.pushState(null, "", `${pathname}?${params.toString()}`);
  }, [pathname]);

  const handleViewMeal = useCallback(() => {
    setAction("Edit");

    const params = new URLSearchParams(window.location.search);
    params.set("page", String(page));
    params.set("action", UrlAction.View);
    params.set("id", String(meal.id));
    window.history.pushState(null, "", `${pathname}?${params.toString()}`);
  }, [pathname, page]);

  /**
   * Handler for tab changes.
   * Updates the activeTab and action state based on the selected tab.
   */
  const handleTabChange = useCallback(
    (tabName: string) => {
      if (tabName === "Add Meal") {
        setActiveTab(tabName);
        setAction("Add");
      } else if (tabName === "Search Meals") {
        setAction("Search");
        setActiveTab("Search Meals");
      }
      if (tabName === "Edit Meal") {
        handleEditMeal();
      } else if (tabName === "View Meal") {
        handleViewMeal();
      }
      setActiveTab(tabName);
    },
    [action, setAction]
  );

  const handleViewMealToAdd = (meaToAdd: IMealInterface) => {
    meaToAdd.mealTypeKey = getEnumKeysByValues(
      MealType,
      meaToAdd.mealType as MealType[]
    );

    meaToAdd.image = "/aiimages/food/default-food.svg";
    meaToAdd.mealPlanId = meal.mealPlanId;
    meaToAdd.clientId = meal.clientId;

    setActiveTab("Add");
    setMeal(meaToAdd);
    setSearchMealSelected(true);
    // setSearchResults([]);
  };

  /**
   * Fetches meals from the Edamam API based on the search query.
   * Updates the searchResults state with the fetched meals.
   */
  const handleSearch = useCallback(async () => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const results = await fetchEdamamRecipes(searchQuery);
      const mealsFromSearch: IMealInterface[] = results.map((recipe) =>
        mapRecipeToMeal(recipe, meal.mealPlanId! || 0, false)
      );

      setSearchResults(mealsFromSearch);
    } catch (error) {
      console.error("Error fetching meals:", error);
      setSearchError("Failed to fetch meals. Please try again.");
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  /**
   * useEffect hook to debounce the search input.
   * It delays the API call until the user has stopped typing for 500ms.
   */
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, handleSearch]);

  /**
   * Determines the dialog title based on the current action.
   */
  const getDialogTitle = () => {
    if (activeTab === "Search Meals" && action === "Search") {
      return "Find meals";
    }
    switch (action) {
      case "Add":
        return "Add New Meal";
      case "Edit":
        return "Edit Meal";
      case "View":
        return "View Meal";
      default:
        return "Meal";
    }
  };

  /**
   * Determines the dialog description based on the current action.
   */
  const getDialogDescription = () => {
    if (activeTab === "Search Meals" && action === "Add") {
      return "Search for new meals using the search bar below.";
    }
    switch (action) {
      case "Add":
        return "Manually add a new meal.";
      case "Edit":
        return "Edit the selected meal.";
      case "View":
        return "View the meal details.";
      default:
        return "";
    }
  };

  const handleDuplicate = useCallback(() => {
    const duplicatedMeal = { ...meal, id: 0 }; // Reset ID for new ingredient
    setMeal(duplicatedMeal);
    setAction("Add");
    setActiveTab("Add Meal");

    const params = new URLSearchParams(window.location.search);
    params.set("action", UrlAction.Add);
    params.delete("id");
    window.history.pushState(null, "", `${pathname}?${params.toString()}`);
  }, [meal, setMeal, setAction, pathname]);

  const toggleShareIcons = () => {
    setShowShareIcons(!showShareIcons);
  };

  // Function to generate the shareable link with filtered nutrients
  const generateShareableLink = () => {
    const baseUrl = window.location.origin;
    const filteredNutrients = macros.reduce((acc, nutrient) => {
      if (meal.nutrients && meal.nutrients[nutrient.tag] && acc) {
        acc[nutrient.tag] = meal.nutrients[nutrient.tag];
      }
      return acc;
    }, {} as IMealInterface["nutrients"]);

    const mealToShare = {
      name: meal.name,
      mealTypeKey: meal.mealTypeKey,
      weight: meal.weight,
      ingredientLines: meal.ingredientLines,
      nutrients: filteredNutrients,
    };

    const mealDetails = JSON.stringify(mealToShare);
    return `${baseUrl}/meal/?meal=${encodeURIComponent(mealDetails)}`;
  };

  const shareDescription = `I found this meal on Meal Planner: ${meal.name}`;

  const nutrientDetails = nutrientFields
    .map((nutrient) => {
      const nutrientValue =
        meal.nutrients && meal.nutrients[nutrient.tag]
          ? ` ${nutrient.label} ${meal.nutrients[nutrient.tag].quantity} ${
              nutrient.unit
            }`
          : ` ${nutrient.label} 0 ${nutrient.unit}`;
      return nutrientValue;
    })
    .join(" ");

  const shareDescriptionLong = `I found this meal on Meal Planner: ${meal.name} ${nutrientDetails}`;

  /**
   * Handler for viewing meal details.
   * This should be passed down to the parent to open the MealDetailsDrawer.
   * However, since MealDrawersContent is itself inside a drawer,
   * we need to manage MealDetailsDrawer state here or lift state up.
   * For simplicity, we'll assume MealDetailsDrawer is managed externally.
   */
  // If MealDetailsDrawer is managed externally, you can pass a callback to handle details
  // For this example, we'll skip implementation
  // TODO: Implement meal search filter
  return (
    <>
      {/* Tabs for navigating between Find and Add Meal */}
      <FormModal
        dialogTitle={getDialogTitle()}
        dialogDescription={getDialogDescription()}
        buttonText={action === "View" ? undefined : action}
        open={open}
        setOpen={setOpen}
        formAction={action !== "View" ? () => mealAction(meal) : undefined}
        // Pass Delete Button Props Only for View and Edit
        deleteButtonText={deleteButtonText}
        onDelete={onDelete}
        onClose={onClose}
        duplicateButtonText={
          actionParam == UrlAction.Edit || actionParam == UrlAction.View
            ? "Duplicate"
            : undefined
        }
        onDuplicate={
          actionParam == UrlAction.Edit || actionParam == UrlAction.View
            ? handleDuplicate
            : undefined
        }
      >
        <div className="flex justify-between items-center">
          <TabsWithPills tabs={tabs} onTabChange={handleTabChange} />
          {(actionParam == UrlAction.View || actionParam == UrlAction.Edit) && (
            <div className="relative">
              <button
                type="button"
                onClick={toggleShareIcons}
                className="rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Share
              </button>
              {showShareIcons && (
                <div className="absolute right-0 mt-2 flex space-x-2">
                  <FacebookShareButton
                    url={generateShareableLink()}
                    title={`Check out this meal: ${meal.name}`}
                    hashtag={`#mealplanning #${shareDescription}`}
                  >
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                  {/* <FacebookMessengerShareButton
                    url={generateShareableLink()}
                    title={`Check out this meal: ${meal.name}`}
                    appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID as string}
                    redirectUri={`${window.location.href.replace(
                      "edit",
                      "view"
                    )}`}
                  >
                    <FacebookMessengerIcon size={32} round />
                  </FacebookMessengerShareButton> */}
                  <TwitterShareButton
                    url={generateShareableLink()}
                    title={`Check out this meal: ${shareDescription}`}
                    hashtags={["mealplanner"]}
                  >
                    <TwitterIcon size={32} round />
                  </TwitterShareButton>
                  <EmailShareButton
                    url={window.location.origin}
                    subject={`Check out this meal: ${meal.name}`}
                    body={`I found this meal on Meal Planner: ${shareDescription} ${generateShareableLink()}`}
                  >
                    <EmailIcon size={32} round />
                  </EmailShareButton>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Conditional Rendering Based on Active Tab, only when we are adding a meal */}
        {activeTab === "Search Meals" && action === "Search" ? (
          // Find New Meal Tab Content
          <div className="space-y-6 py-6">
            {/* Search Bar */}
            <div>
              <label
                htmlFor="search-meals"
                className="block text-sm font-medium text-gray-900"
              >
                Search Meals
              </label>
              <div className="mt-2">
                <input
                  id="search-meals"
                  name="search-meals"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for meals..."
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-800"
                />
              </div>
            </div>

            {/* Search Results */}
            <div>
              {isSearching ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : searchError ? (
                <p className="text-sm text-red-500">{searchError}</p>
              ) : searchResults.length > 0 ? (
                <>
                  <div className="flex justify-end mb-4">
                    <button
                      type="button"
                      onClick={() => {
                        setSearchResults([]);
                        setSearchMealSelected(false);
                      }}
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
                    >
                      Clear Search Results
                    </button>
                  </div>
                  <MealSearchResultsGrid
                    meals={searchResults}
                    onViewDetails={handleViewMealToAdd}
                  />
                </>
              ) : (
                <p className="text-sm text-gray-500">No meals found.</p>
              )}
            </div>
          </div>
        ) : (
          // Add New Meal Tab Content
          <div className="space-y-6 py-6">
            {/* Back Button */}
            {searchResults.length > 0 && searchMealSelected && (
              <button
                type="button"
                onClick={() => handleTabChange("Search Meals")}
                className="mb-4 inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
              >
                Back to Search
              </button>
            )}

            <MealInputFields meal={meal} setMeal={setMeal} />
          </div>
        )}
      </FormModal>
    </>
  );
};

export default MealModalContent;
