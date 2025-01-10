import React, { useState, useEffect, useCallback, useMemo } from "react";

import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import { fetchEdamamRecipes } from "@/lib/edamam";
import TabsWithPills from "../ui/tabs-in-pills";
import RecipeSearchResultsGrid from "./recipe-search-results-grid";
import FormModal from "../ui/modals/form-modal";
import RecipeInputFields from "./recipe-input-fields";
import { getEnumKeysByValues } from "@/util/enum-util";
import { MealType, UrlAction } from "@/constants/constants-enums";
import { FormActionType } from "@/models/interfaces/types";
import { usePathname, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { parseDate } from "@/util/date-util";

dayjs.extend(customParseFormat);

type RecipeModalContentProps = {
  action: FormActionType | "Search";
  setAction: React.Dispatch<React.SetStateAction<FormActionType | "Search">>;
  page: number;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  recipeAction: (recipe: IRecipeInterface) => void;
  recipe: IRecipeInterface;
  setRecipe: React.Dispatch<React.SetStateAction<IRecipeInterface | undefined>>;
  deleteButtonText?: string;
  onDelete?: () => void;
  onClose?: () => void;
};

const RecipeModalContent: React.FC<RecipeModalContentProps> = ({
  action,
  setAction,
  page,
  open,
  setOpen,
  recipeAction,
  recipe,
  setRecipe,
  deleteButtonText,
  onDelete,
  onClose, // Destructure 'onClose'
}) => {
  // State for search query in 'Find New Recipe' tab
  const [searchQuery, setSearchQuery] = useState<string>("");

  // State to hold search results from Edamam API
  const [searchResults, setSearchResults] = useState<IRecipeInterface[]>([]);

  // Loading and error states for search functionality
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  // Extract search parameters
  const mealTypeParam = searchParams.get("mealType");
  const timeScheduledParam = searchParams.get("timeScheduled");
  const mealPlanIdParam = searchParams.get("mealPlanId");
  const actionParam = searchParams.get("action");

  // Define the default active tab based on the current action
  const getDefaultActiveTab = () => {
    switch (action) {
      case "Add":
        return "Add Recipes";
      case "Search":
        return "Search Recipes";
      case "View":
        return "View Recipe";
      case "Edit":
        return "Edit Recipe";
    }
  };
  // Initialize activeTab based on the initial action
  const [activeTab, setActiveTab] = useState<string>(getDefaultActiveTab());
  const pathname = usePathname();

  // Reset activeTab when the modal is opened
  useEffect(() => {
    if (open) {
      setActiveTab(getDefaultActiveTab());
    }
  }, [open, action]);

  // Define tabs based on the current action
  const tabs = useMemo(() => {
    return action === "Add" ||
      actionParam === UrlAction.Add ||
      action === "Search"
      ? [
          {
            name: "Search Recipes",
            href: "#",
            current: activeTab === "Search Recipes",
          },
          {
            name: "Add Recipe",
            href: "#",
            current: activeTab === "Add Recipe",
          },
        ]
      : [
          {
            name: "View Recipe",
            href: "#",
            current: activeTab === "View Recipe",
          },
          {
            name: "Edit Recipe",
            href: "#",
            current: activeTab === "Edit Recipe",
          },
        ];
  }, [activeTab, action, actionParam]);

  useEffect(() => {
    // Update recipe state based on search parameters
    updateRecipeFromSearchParams();
  }, [mealTypeParam, timeScheduledParam, mealPlanIdParam]);

  const updateRecipeFromSearchParams = () => {
    setRecipe((prevRecipe) => {
      if (!prevRecipe) {
        return {} as IRecipeInterface;
      }

      const updatedRecipe = { ...prevRecipe };

      if (mealTypeParam) {
        updatedRecipe.mealTypeKey = mealTypeParam
          .split(",")
          .map((type) => type.toLowerCase()) as string[];
      }

      if (timeScheduledParam) {
        updatedRecipe.timeScheduled = parseDate(timeScheduledParam);
      }

      if (mealPlanIdParam) {
        updatedRecipe.mealPlanId = parseInt(mealPlanIdParam, 10);
      }

      return updatedRecipe;
    });
    if (actionParam && actionParam === UrlAction.Add) {
      setActiveTab("Search Recipes");
      setAction("Search");
    }
  };

  const handleEditRecipe = useCallback(() => {
    setAction("Edit");

    const params = new URLSearchParams(window.location.search);
    params.set("action", UrlAction.Edit);
    params.set("id", String(recipe.id));
    window.history.pushState(null, "", `${pathname}?${params.toString()}`);
  }, [pathname]);

  const handleViewRecipe = useCallback(() => {
    setAction("Edit");

    const params = new URLSearchParams(window.location.search);
    params.set("page", String(page));
    params.set("action", UrlAction.View);
    params.set("id", String(recipe.id));
    window.history.pushState(null, "", `${pathname}?${params.toString()}`);
  }, [pathname, page]);
  /**
   * Handler for tab changes.
   * Updates the activeTab and action state based on the selected tab.
   */
  const handleTabChange = useCallback(
    (tabName: string) => {
      if (tabName === "Add Recipe") {
        setAction("Add");
      } else if (tabName === "Search Recipes") {
        setAction("Search");
      } else if (tabName === "Edit Recipe") {
        handleEditRecipe();
      } else if (tabName === "View Recipe") {
        handleViewRecipe();
      }
      setActiveTab(tabName);
    },
    [handleEditRecipe, handleViewRecipe, setAction]
  );

  const handleViewRecipeToAdd = (recipe: IRecipeInterface) => {
    recipe.mealTypeKey = getEnumKeysByValues(
      MealType,
      recipe.mealType as MealType[]
    );

    recipe.baseTotalDaily = recipe.totalDaily;
    recipe.baseTotalNutrients = recipe.totalNutrients;
    recipe.baseTotalWeight = recipe.totalWeight;
    // recipe.image = "/aiimages/food/default-food.svg";

    if (mealTypeParam) {
      recipe.mealTypeKey = mealTypeParam
        .split(",")
        .map((type) => type.toLowerCase()) as string[];
    }

    if (timeScheduledParam) {
      recipe.timeScheduled = parseDate(timeScheduledParam);
    }

    if (mealPlanIdParam) {
      recipe.mealPlanId = parseInt(mealPlanIdParam, 10);
    }

    setActiveTab("Add Recipe");
    setAction("Add");
    setRecipe(recipe);
    setSearchResults([]);
  };

  /**
   * Fetches recipes from the Edamam API based on the search query.
   * Updates the searchResults state with the fetched recipes.
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
      setSearchResults(results);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setSearchError("Failed to fetch recipes. Please try again.");
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
      return "Find recipes";
    }
    switch (action) {
      case "Add":
        return "Add New Recipe";
      case "Edit":
        return "Edit Recipe";
      case "View":
        return "View Recipe";
      default:
        return "Recipe";
    }
  };

  /**
   * Determines the dialog description based on the current action.
   */
  const getDialogDescription = () => {
    if (activeTab === "Search Recipes" && action === "Add") {
      return "Search for new recipes using the search bar below.";
    }
    switch (action) {
      case "Add":
        return "Manually add a new recipe.";
      case "Edit":
        return "Edit the selected recipe.";
      case "View":
        return "View the recipe details.";
      default:
        return "";
    }
  };

  /**
   * Handler for adding a recipe from search results.
   * Sets isCustom to false before adding.
   */
  const handleAddRecipeFromSearch = useCallback(
    async (recipeToAdd: IRecipeInterface) => {
      setRecipe(recipeToAdd);

      if (mealTypeParam) {
        recipeToAdd.mealTypeKey = mealTypeParam
          .split(",")
          .map((type) => type.toLowerCase()) as string[];
      } else {
        recipeToAdd.mealTypeKey = getEnumKeysByValues(
          MealType,
          recipeToAdd.mealType as MealType[]
        );
      }

      if (timeScheduledParam) {
        recipeToAdd.timeScheduled = parseDate(timeScheduledParam);
      }

      if (mealPlanIdParam) {
        recipeToAdd.mealPlanId = parseInt(mealPlanIdParam, 10);
      }

      const updatedRecipe: IRecipeInterface = {
        ...recipeToAdd,
        isCustom: false,
        clientId: recipe.clientId,
        // image: "/aiimages/food/default-food.svg",
      };
      if (recipeAction) {
        await recipeAction(updatedRecipe);
        console.log("recipeAction called successfully");
      } else {
        console.error("recipeAction is not defined");
      }
    },
    [recipe.clientId, recipeAction]
  );

  /**
   * Handler for viewing recipe details.
   * This should be passed down to the parent to open the RecipeDetailsDrawer.
   * However, since RecipeDrawersContent is itself inside a drawer,
   * we need to manage RecipeDetailsDrawer state here or lift state up.
   * For simplicity, we'll assume RecipeDetailsDrawer is managed externally.
   */
  // If RecipeDetailsDrawer is managed externally, you can pass a callback to handle details
  // For this example, we'll skip implementation
  // TODO: Implement recipe search filter
  return (
    <>
      {/* Tabs for navigating between Find and Add Recipe */}
      <FormModal
        dialogTitle={getDialogTitle()}
        dialogDescription={getDialogDescription()}
        buttonText={action === "View" ? undefined : action}
        open={open}
        setOpen={setOpen}
        formAction={action !== "View" ? () => recipeAction(recipe) : undefined}
        // Pass Delete Button Props Only for View and Edit
        deleteButtonText={deleteButtonText}
        onDelete={onDelete}
        onClose={onClose} // Pass 'onClose' prop received from parent
      >
        <div className="flex justify-center">
          <TabsWithPills tabs={tabs} onTabChange={handleTabChange} />
        </div>

        {/* Conditional Rendering Based on Active Tab, only when we are adding a recipe */}
        {activeTab === "Search Recipes" && action === "Search" ? (
          // Find New Recipe Tab Content
          <div className="space-y-6 py-6">
            {/* Search Bar */}
            <div>
              <label
                htmlFor="search-recipes"
                className="block text-sm font-medium text-gray-900"
              >
                Search Recipes
              </label>
              <div className="mt-2">
                <input
                  id="search-recipes"
                  name="search-recipes"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for recipes..."
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
                <RecipeSearchResultsGrid
                  recipes={searchResults}
                  onViewDetails={handleViewRecipeToAdd}
                  onAddRecipe={handleAddRecipeFromSearch}
                />
              ) : (
                <p className="text-sm text-gray-500">No recipes found.</p>
              )}
            </div>
          </div>
        ) : (
          // Add New Recipe Tab Content
          <div className="space-y-6 py-6">
            <RecipeInputFields
              action={action}
              recipe={recipe}
              setRecipe={setRecipe}
              readOnly={action === "View"}
            />
          </div>
        )}
      </FormModal>
    </>
  );
};

export default RecipeModalContent;
