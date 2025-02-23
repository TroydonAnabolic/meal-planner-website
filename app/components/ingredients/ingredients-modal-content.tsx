import React, { useState, useEffect, useCallback, useMemo } from "react";

import {
  IIngredient,
  INutrients,
} from "@/models/interfaces/ingredient/ingredient";
import TabsWithPills from "../ui/tabs-in-pills";
import FormModal from "../ui/modals/form-modal";
import { Nutrients, UrlAction } from "@/constants/constants-enums";
import { FormActionType } from "@/models/interfaces/types";
import { usePathname, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { fetchFood } from "@/lib/client-side/edamam";
import { IFoodParser } from "@/models/interfaces/edamam/food/food-response";
import { mapParsedFoodToIngredient } from "@/util/mappers";
import IngredientInputFields from "./ingredient-input-fields";
import IngredientSearchResultsGrid from "./ingredients-search-results-grid";
import { Measure } from "@/models/interfaces/food/food";
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
import { nutrientFields } from "@/util/nutrients";

dayjs.extend(customParseFormat);

type IngredientModalContentProps = {
  action: FormActionType | "Search";
  setAction: React.Dispatch<React.SetStateAction<FormActionType | "Search">>;
  page: number;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ingredientAction: (ingredient: IIngredient) => void;
  ingredient: IIngredient;
  setIngredient: React.Dispatch<React.SetStateAction<IIngredient | undefined>>;
  deleteButtonText?: string;
  onDelete?: () => void;
  onClose?: () => void;
};

const IngredientModalContent: React.FC<IngredientModalContentProps> = ({
  action,
  setAction,
  page,
  open,
  setOpen,
  ingredientAction,
  ingredient,
  setIngredient,
  deleteButtonText,
  onDelete,
  onClose, // Destructure 'onClose'
}) => {
  // State for search query in 'Find New Ingredient' tab
  const [searchQuery, setSearchQuery] = useState<string>("");

  // State to hold search results from Edamam API
  const [searchResults, setSearchResults] = useState<IIngredient[]>([]);
  const [measure, setMeasure] = useState<Measure | null>(null);

  // Loading and error states for search functionality
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showShareIcons, setShowShareIcons] = useState(false);

  const searchParams = useSearchParams();
  // Extract search parameters
  let actionParam = searchParams.get("action");

  // Define the default active tab based on the current action
  const getDefaultActiveTab = () => {
    switch (action) {
      case "Add":
        return "Add Ingredients";
      case "Search":
        return "Search Ingredients";
      case "View":
        return "View Ingredient";
      case "Edit":
        return "Edit Ingredient";
    }
  };
  // Initialize activeTab based on the initial action
  const [activeTab, setActiveTab] = useState<string>(getDefaultActiveTab());
  const pathname = usePathname();

  // Reset activeTab when the modal is opened
  useEffect(() => {
    if (open) {
      setActiveTab(getDefaultActiveTab());
      //setAction("Add");
    }
  }, [open, action]);

  // Define tabs based on the current action
  const tabs = useMemo(() => {
    return action === "Add" ||
      actionParam === UrlAction.Add ||
      action === "Search"
      ? [
          {
            name: "Search Ingredients",
            href: "#",
            current: activeTab === "Search Ingredients",
          },
          {
            name: "Add Ingredients",
            href: "#",
            current: activeTab === "Add Ingredients",
          },
        ]
      : [
          {
            name: "View Ingredient",
            href: "#",
            current: activeTab === "View Ingredient",
          },
          {
            name: "Edit Ingredient",
            href: "#",
            current: activeTab === "Edit Ingredient",
          },
        ];
  }, [activeTab, action, actionParam]);

  const handleEditIngredient = useCallback(() => {
    setAction("Edit");

    const params = new URLSearchParams(window.location.search);
    params.set("action", UrlAction.Edit);
    params.set("id", String(ingredient.id));
    window.history.pushState(null, "", `${pathname}?${params.toString()}`);
  }, [pathname]);

  const handleViewIngredient = useCallback(() => {
    setAction("Edit");

    const params = new URLSearchParams(window.location.search);
    params.set("page", String(page));
    params.set("action", UrlAction.View);
    params.set("id", String(ingredient.id));
    window.history.pushState(null, "", `${pathname}?${params.toString()}`);
  }, [pathname, page]);
  /**
   * Handler for tab changes.
   * Updates the activeTab and action state based on the selected tab.
   */
  const handleTabChange = useCallback(
    (tabName: string) => {
      if (tabName === "Add Ingredient") {
        setAction("Add");
      } else if (tabName === "Search Ingredients") {
        setAction("Search");
      } else if (tabName === "Edit Ingredient") {
        handleEditIngredient();
      } else if (tabName === "View Ingredient") {
        handleViewIngredient();
      }
      setActiveTab(tabName);
    },
    [handleEditIngredient, handleViewIngredient, setAction]
  );

  const handleViewIngredientToAdd = (ingredient: IIngredient) => {
    const updatedIngredient: IIngredient = {
      ...ingredient,
      foodId: null,
    };

    setActiveTab("Add Ingredient");
    setAction("View");
    const params = new URLSearchParams(window.location.search);
    params.set("action", UrlAction.View);
    actionParam = UrlAction.View;
    setIngredient(updatedIngredient);
    setSearchResults([]);
  };

  /**
   * Fetches ingredients from the Edamam API based on the search query.
   * Updates the searchResults state with the fetched ingredients.
   */
  const handleSearch = useCallback(async () => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const results: IFoodParser = await fetchFood(searchQuery);

      const ingredients: IIngredient[] = mapParsedFoodToIngredient(
        results,
        ingredient
      );

      setSearchResults(ingredients);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
      setSearchError("Failed to fetch ingredients. Please try again.");
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
      return "Find ingredients";
    }
    switch (action) {
      case "Add":
        return "Add New Ingredient";
      case "Edit":
        return "Edit Ingredient";
      case "View":
        return "View Ingredient";
      default:
        return "Ingredient";
    }
  };

  /**
   * Determines the dialog description based on the current action.
   */
  const getDialogDescription = () => {
    if (activeTab === "Search Ingredients" && action === "Add") {
      return "Search for new ingredients using the search bar below.";
    }
    switch (action) {
      case "Add":
        return "Manually add a new ingredient.";
      case "Edit":
        return "Edit the selected ingredient.";
      case "View":
        return "View the ingredient details.";
      default:
        return "";
    }
  };

  const handleDuplicate = useCallback(() => {
    const duplicatedIngredient = { ...ingredient, id: 0 }; // Reset ID for new ingredient
    setIngredient(duplicatedIngredient);
    setAction("Add");
    setActiveTab("Add Ingredient");

    const params = new URLSearchParams(window.location.search);
    params.set("action", UrlAction.Add);
    params.delete("id");
    window.history.pushState(null, "", `${pathname}?${params.toString()}`);
  }, [ingredient, setIngredient, setAction, pathname]);

  const toggleShareIcons = () => {
    setShowShareIcons(!showShareIcons);
  };

  // Function to generate the shareable link with
  const generateShareableLink = () => {
    const baseUrl = window.location.origin;

    const filteredNutrients = nutrientFields.reduce(
      (acc: Partial<INutrients>, nutrient) => {
        if (
          ingredient.totalNutrients &&
          ingredient.totalNutrients[
            nutrient.tag as unknown as keyof INutrients
          ] &&
          acc
        ) {
          acc[nutrient.tag as unknown as keyof INutrients] =
            ingredient.totalNutrients[
              nutrient.tag as unknown as keyof INutrients
            ];
        }
        return acc;
      },
      {} as Partial<INutrients>
    );

    const ingredientToShare = {
      ...ingredient,
      totalNutrients: filteredNutrients,
    };

    const ingredientDetails = JSON.stringify(ingredientToShare);

    return `${baseUrl}/ingredient/?ingredient=${encodeURIComponent(
      ingredientDetails
    )}`;
  };

  const facebookHashTag = `I found this ingredient on Meal Planner: ${ingredient.food} ${ingredient.quantity} ${ingredient.measure}`;

  const nutrientDetails = nutrientFields
    .map((nutrient) => {
      const nutrientValue =
        ingredient.totalNutrients &&
        (ingredient.totalNutrients as unknown as INutrients)[
          nutrient.tag as unknown as keyof INutrients
        ]
          ? ` ${nutrient.label} ${
              (ingredient.totalNutrients as unknown as INutrients)[
                nutrient.tag as unknown as keyof INutrients
              ].quantity
            } ${nutrient.unit}`
          : ` ${nutrient.label} 0 ${nutrient.unit}`;
      return nutrientValue;
    })
    .join(" ");

  const facebookHashTagWithNutrients = `I found this ingredient on Meal Planner: ${ingredient.food} ${ingredient.quantity} ${ingredient.measure} ${nutrientDetails}`;

  actionParam = searchParams.get("action");

  const showActionButton =
    action !== "View" &&
    //ingredient.id >= 0 &&
    ingredient.foodId === null;
  /**
   * Handler for viewing ingredient details.
   * This should be passed down to the parent to open the IngredientDetailsDrawer.
   * However, since IngredientDrawersContent is itself inside a drawer,
   * we need to manage IngredientDetailsDrawer state here or lift state up.
   * For simplicity, we'll assume IngredientDetailsDrawer is managed externally.
   */
  // If IngredientDetailsDrawer is managed externally, you can pass a callback to handle details
  // For this example, we'll skip implementation
  // TODO: Implement ingredient search filter
  return (
    <>
      {/* Tabs for navigating between Find and Add Ingredient */}
      <FormModal
        dialogTitle={getDialogTitle()}
        dialogDescription={getDialogDescription()}
        buttonText={showActionButton ? action : undefined}
        open={open}
        setOpen={setOpen}
        formAction={
          showActionButton ? () => ingredientAction(ingredient) : undefined
        }
        // Pass Delete Button Props Only for View and Edit
        deleteButtonText={
          actionParam == (UrlAction.Edit || actionParam == UrlAction.View) &&
          ingredient.id !== 0 &&
          ingredient.foodId === null
            ? deleteButtonText
            : undefined
        }
        onDelete={
          actionParam == (UrlAction.Edit || actionParam == UrlAction.View) &&
          ingredient.id !== 0 &&
          ingredient.foodId === null
            ? onDelete
            : undefined
        }
        onClose={onClose} // Pass 'onClose' prop received from parent
        duplicateButtonText={
          actionParam == (UrlAction.Edit || actionParam == UrlAction.View) &&
          ingredient.id !== 0 &&
          ingredient.foodId === null
            ? "Duplicate"
            : undefined
        }
        onDuplicate={
          actionParam == (UrlAction.Edit || actionParam == UrlAction.View) &&
          ingredient.id !== 0 &&
          ingredient.foodId === null
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
                    url={window.location.origin}
                    title={`Check out this ingredient: ${ingredient.food}`}
                    hashtag={facebookHashTag}
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
                    title={`Check out this ingredient: ${facebookHashTagWithNutrients} ${generateShareableLink()}`}
                    hashtags={["mealplanner"]}
                  >
                    <TwitterIcon size={32} round />
                  </TwitterShareButton>
                  <EmailShareButton
                    url={window.location.origin}
                    subject={`Check out this ingredient: ${ingredient.food}`}
                    body={`I found this ingredient on Meal Planner: ${facebookHashTagWithNutrients} ${generateShareableLink()}`}
                  >
                    <EmailIcon size={32} round />
                  </EmailShareButton>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Conditional Rendering Based on Active Tab, only when we are adding a ingredient */}
        {activeTab === "Search Ingredients" && action === "Search" ? (
          // Find New Ingredient Tab Content
          <div className="space-y-6 py-6">
            {/* Search Bar */}
            <div>
              <label
                htmlFor="search-ingredients"
                className="block text-sm font-medium text-gray-900"
              >
                Search Ingredients
              </label>
              <div className="mt-2">
                <input
                  id="search-ingredients"
                  name="search-ingredients"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for ingredients..."
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
                <IngredientSearchResultsGrid
                  ingredients={searchResults}
                  onViewDetails={handleViewIngredientToAdd}
                  //onAddIngredient={handleAddIngredientFromSearch}
                />
              ) : (
                <p className="text-sm text-gray-500">No ingredients found.</p>
              )}
            </div>
          </div>
        ) : (
          // Add New Ingredient Tab Content
          <div className="space-y-6 py-6">
            <IngredientInputFields
              ingredient={ingredient}
              setIngredient={setIngredient}
            />
          </div>
        )}
      </FormModal>
    </>
  );
};

export default IngredientModalContent;
