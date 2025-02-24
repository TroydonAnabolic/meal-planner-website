import React, { useState, useEffect, useCallback, useMemo } from "react";

import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import { fetchEdamamRecipes } from "@/lib/client-side/edamam";
import TabsWithPills from "../ui/tabs-in-pills";
import RecipeSearchResultsGrid from "./recipe-search-results-grid";
import FormModal from "../ui/modals/form-modal";
import RecipeInputFields from "./recipe-input-fields";
import { MealType, UrlAction } from "@/constants/constants-enums";
import { FormActionType } from "@/models/interfaces/types";
import { usePathname, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  getMealTypeFromTime,
  getScheduledTimeFromMealTypeKey,
} from "@/util/meal-utils";
import { getEnumKeysByValues } from "@/util/enum-util";
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
  const [showShareIcons, setShowShareIcons] = useState(false);

  const searchParams = useSearchParams();
  // Extract search parameters
  const mealTypeParam = searchParams.get("mealTypeKey");
  const timeScheduledParam = searchParams.get("timeScheduled");
  const mealPlanIdParam = searchParams.get("mealPlanId");
  let actionParam = searchParams.get("action");

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
  }, []);

  const updateRecipeFromSearchParams = () => {
    setRecipe((prevRecipe) => {
      if (!prevRecipe) {
        return {} as IRecipeInterface;
      }

      const updatedRecipe = { ...prevRecipe };

      if (mealTypeParam) {
        updatedRecipe.mealTypeKey = [mealTypeParam];
      }

      if (timeScheduledParam) {
        const scheduledTime = getScheduledTimeFromMealTypeKey(
          mealTypeParam as keyof typeof MealType
        );
        updatedRecipe.timeScheduled = scheduledTime;
        //recipeToAdd.timeScheduled = parseDate(timeScheduledParam);
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
        setActiveTab("Add Recipes");
      } else if (tabName === "Search Recipes") {
        setAction("Search");
        setActiveTab("Search Recipes");
      } else if (tabName === "Edit Recipe") {
        handleEditRecipe();
      } else if (tabName === "View Recipe") {
        handleViewRecipe();
      }
      setActiveTab(tabName);
    },
    [handleEditRecipe, handleViewRecipe, setAction]
  );

  // Handler to reset all fields and state
  const handleClear = () => {
    setAction("Add");
    const params = new URLSearchParams(window.location.search);
    params.set("action", UrlAction.Add);
    actionParam = UrlAction.Add;
  };

  const handleViewRecipeToAdd = (recipe: IRecipeInterface) => {
    recipe.mealTypeKey = getMealTypeFromTime(undefined);

    recipe.baseTotalDaily = recipe.totalDaily;
    recipe.baseTotalNutrients = recipe.totalNutrients;
    recipe.baseTotalWeight = recipe.totalWeight;

    if (mealTypeParam) {
      recipe.mealTypeKey = [mealTypeParam];
    }

    if (timeScheduledParam) {
      const scheduledTime = getScheduledTimeFromMealTypeKey(
        mealTypeParam as keyof typeof MealType
      );
      recipe.timeScheduled = scheduledTime;
      //recipeToAdd.timeScheduled = parseDate(timeScheduledParam);
    }

    if (mealPlanIdParam) {
      recipe.mealPlanId = parseInt(mealPlanIdParam, 10);
    }

    setActiveTab("Add Recipe");
    setAction("View");
    setRecipe(recipe);
    setSearchResults([]);
    const params = new URLSearchParams(window.location.search);
    params.set("action", UrlAction.View);
    actionParam = UrlAction.View;
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

  const handleDuplicate = useCallback(() => {
    const duplicatedIngredient = { ...recipe, id: 0 }; // Reset ID for new ingredient
    setRecipe(duplicatedIngredient);
    setAction("Add");
    setActiveTab("Add Recipes");

    const params = new URLSearchParams(window.location.search);
    params.set("action", UrlAction.Add);
    params.delete("id");
    window.history.pushState(null, "", `${pathname}?${params.toString()}`);
  }, [recipe, setRecipe, setAction, pathname]);
  const toggleShareIcons = () => {
    setShowShareIcons(!showShareIcons);
  };

  // Function to generate the shareable link with filtered nutrients
  const generateShareableLink = () => {
    const baseUrl = window.location.origin;
    const filteredNutrients = macros.reduce((acc, nutrient) => {
      if (recipe.totalNutrients && recipe.totalNutrients[nutrient.tag] && acc) {
        acc[nutrient.tag] = recipe.totalNutrients[nutrient.tag];
      }
      return acc;
    }, {} as IRecipeInterface["totalNutrients"]);

    const recipeToShare = {
      label: recipe.label,
      source: recipe.source,
      totalTime: recipe.totalTime,
      yield: recipe.yield,
      ingredientLines: recipe.ingredientLines,
      totalNutrients: filteredNutrients,
    };

    const recipeDetails = JSON.stringify(recipeToShare);
    return `${baseUrl}/recipe/?recipe=${encodeURIComponent(recipeDetails)}`;
  };

  const shareDescription = `I found this recipe on Meal Planner: ${recipe.label}`;

  const nutrientDetails = nutrientFields
    .map((nutrient) => {
      const nutrientValue =
        recipe.totalNutrients && recipe.totalNutrients[nutrient.tag]
          ? ` ${nutrient.label} ${
              recipe.totalNutrients[nutrient.tag].quantity
            } ${nutrient.unit}`
          : ` ${nutrient.label} 0 ${nutrient.unit}`;
      return nutrientValue;
    })
    .join(" ");

  const shareDescriptionLong = `I found this recipe on Meal Planner: ${recipe.label} ${nutrientDetails}`;
  actionParam = searchParams.get("action");

  const showActionButton =
    action !== "View" && recipe.ingredients.every((i) => i.foodId === "");

  const showDeleteOrDupBtn =
    actionParam == (UrlAction.Edit || actionParam == UrlAction.View) &&
    recipe.id !== 0 &&
    recipe.ingredients.every((i) => i.foodId === "");

  // If RecipeDetailsDrawer is managed externally, you can pass a callback to handle details
  // For this example, we'll skip implementation
  // TODO: Implement recipe search filter
  return (
    <>
      {/* Tabs for navigating between Find and Add Recipe */}
      <FormModal
        dialogTitle={getDialogTitle()}
        dialogDescription={getDialogDescription()}
        buttonText={showActionButton ? action : undefined}
        open={open}
        setOpen={setOpen}
        formAction={showActionButton ? () => recipeAction(recipe) : undefined}
        // Pass Delete Button Props Only for View and Edit
        deleteButtonText={showDeleteOrDupBtn ? deleteButtonText : undefined}
        onDelete={showDeleteOrDupBtn ? onDelete : undefined}
        onClose={onClose} // Pass 'onClose' prop received from parent
        duplicateButtonText={showDeleteOrDupBtn ? "Duplicate" : undefined}
        onDuplicate={showDeleteOrDupBtn ? handleDuplicate : undefined}
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
                    url={window.location.origin}
                    title={`Check out this recipe: ${recipe.label}`}
                    hashtag={`${shareDescriptionLong}`}
                  >
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                  {/* <FacebookMessengerShareButton
                    url={window.location.origin}
                    title={`Check out this ingredient: ${ingredient.food}`}
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
                    title={`Check out this recipe: ${shareDescription} `}
                    hashtags={["mealplanner"]}
                  >
                    <TwitterIcon size={32} round />
                  </TwitterShareButton>
                  <EmailShareButton
                    url={window.location.origin}
                    subject={`Check out this recipe: ${recipe.label}`}
                    body={`I found this recipe on Meal Planner: ${shareDescriptionLong} ${generateShareableLink()}`}
                  >
                    <EmailIcon size={32} round />
                  </EmailShareButton>
                </div>
              )}
            </div>
          )}
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
              recipe={recipe}
              setRecipe={setRecipe}
              handleClear={handleClear}
            />
          </div>
        )}
      </FormModal>
    </>
  );
};

export default RecipeModalContent;
