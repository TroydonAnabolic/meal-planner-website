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
import { usePathname } from "next/navigation";

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
        return "Search";
      case "View":
        return "View Meal";
      case "Edit":
        return "Edit Meal";
      default:
        return "Search";
    }
  };
  // Initialize activeTab based on the initial action
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>(getDefaultActiveTab());
  const [searchMealSelected, setSearchMealSelected] = useState<boolean>(false);
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
    action === "Add"
      ? [
          {
            name: "Search Meals",
            href: "#",
            current: activeTab === "Search",
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
      if (action === "Add") {
        if (tabName === "Add Meal") {
          setActiveTab(tabName);
          setAction("Add");
        } else if (tabName === "Search Meals") {
          setAction("Add");
          setActiveTab("Search");
        }
      } else if (action === "Edit" || action === "View") {
        if (tabName === "Edit Meal") {
          handleEditMeal();
        } else if (tabName === "View Meal") {
          handleViewMeal();
        }
        setActiveTab(tabName);
      }
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
    if (activeTab === "Search" && action === "Add") {
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
    if (activeTab === "find" && action === "Add") {
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
      >
        <div className="flex justify-center">
          <TabsWithPills tabs={tabs} onTabChange={handleTabChange} />
        </div>

        {/* Conditional Rendering Based on Active Tab, only when we are adding a meal */}
        {activeTab === "Search" && action === "Add" ? (
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
            {searchResults.length && searchMealSelected && (
              <button
                type="button"
                onClick={() => handleTabChange("Search Meals")}
                className="mb-4 inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
              >
                &larr; Back to Search
              </button>
            )}

            <MealInputFields
              action={action}
              meal={meal}
              setMeal={setMeal}
              readOnly={action === "View"}
            />
          </div>
        )}
      </FormModal>
    </>
  );
};

export default MealModalContent;
