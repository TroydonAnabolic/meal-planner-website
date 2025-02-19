"use client";

import React, {
  useState,
  useCallback,
  useOptimistic,
  useEffect,
  useMemo,
} from "react";
import { PlusIcon } from "@heroicons/react/24/outline"; // Import necessary icons
import {
  deleteRecipe,
  saveRecipe,
  updateRecipe,
} from "@/actions/recipes.action";
import CardsWithDetailsContainer from "../ui/cards-with-details";
import RecipeModalContent from "./recipes-modal-content";
import {
  deleteImageFromS3,
  saveImageToS3,
  uploadImageToS3FromBuffer,
} from "@/lib/s3-client";
import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import ToggleInput from "../ui/inputs/toggle-input";
import ConfirmActionModal from "../ui/modals/confirm-action-modal";
import { FormActionType } from "@/models/interfaces/types";
import { crudReducer } from "@/util/state-management";
import RecipeCard from "./recipe-card";
import { usePathname } from "next/navigation";
import { UrlAction } from "@/constants/constants-enums";
import usePagination from "@/hooks/use-pagination";
import CenteredPageNumbers from "../ui/pagination/centered-page-numbers";
import { hostname } from "@/constants/constant-strings";
import { fetchImageAndConvertToBuffer } from "@/lib/image";
import GlowyBanner from "../ui/banner/banner-with-glow";
import { ROUTES } from "@/constants/routes";

type RecipesGridProps = {
  recipesData: IRecipeInterface[] | undefined; // Recipes data fetched from API
  clientId: number; // Client ID for associating recipes
  userId: string;
};

// TODO: show only one recipe per meal plan for meal plan recipes
const RecipesGrid: React.FC<RecipesGridProps> = ({
  recipesData,
  clientId,
  userId,
}) => {
  const pathname = usePathname();

  // State to control the visibility of the Add Recipe Drawer
  const [modalOpen, setModalOpen] = useState(false);
  const [isBannedOpen, setIsBannedOpen] = useState<boolean>(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  // State to hold the currently selected recipe for viewing details
  const [selectedRecipe, setSelectedRecipe] = useState<
    IRecipeInterface | undefined
  >(undefined);
  const [action, setAction] = useState<FormActionType | "Search">("Add");

  const defaultRecipe: IRecipeInterface = {
    id: 0, // Assuming backend assigns ID
    clientId: clientId,
    mealPlanId: null,
    uri: "default-uri",
    image: "",
    label: "",
    source: "",
    url: "",
    shareAs: "",
    yield: 1,
    dietLabels: [], // Populate as needed
    healthLabels: [], // Populate as needed
    cautions: [], // Populate as needed
    ingredientLines: [], // Populate as needed
    ingredients: [], // Populate as needed
    calories: 0, // Populate as needed
    totalCO2Emissions: 0, // Populate as needed
    co2EmissionsClass: "", // Populate as needed
    totalWeight: 0, // Populate as needed
    totalTime: 0,
    cuisineType: [], // Populate as needed
    mealType: [], // Populate as needed
    mealTypeKey: [], // Populate as needed
    dishType: [], // Populate as needed
    digest: [], // Populate as needed
    totalNutrients: {}, // Populate as needed
    totalDaily: {}, // Populate as needed
    baseTotalNutrients: {},
    baseTotalDaily: {},
    baseTotalWeight: 1,
    dateAdded: new Date().toISOString(),
    avoid: false,
    isCustom: true,
    isFavourite: false,
  };

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.src = "/aiimages/food/default-food.svg";
  };

  // Manage optimistic state for recipes, allowing immediate UI updates on add, update, or delete actions
  const [optimisticRecipes, upsertOptimisticRecipe] = useOptimistic(
    recipesData,
    (state, action: { type: "upsert" | "delete"; item: IRecipeInterface }) =>
      crudReducer<IRecipeInterface>(state, action)
  );

  // New state for the Avoid filter
  const [showAvoided, setShowAvoided] = useState(false);

  // Toggle states for recipes with mealPlanId
  const [showMealPlanRecipes, setShowMealPlanRecipes] = useState(false);

  // Calculate total recipes
  const totalRecipes = recipesData ? recipesData.length : 0;

  // Filtered recipes based on the avoid filter
  const filteredRecipes = useMemo(() => {
    return (
      optimisticRecipes?.filter((recipe) => {
        if (showAvoided && !recipe.avoid) return false;
        if (showMealPlanRecipes && !recipe.mealPlanId) return false;
        return true;
      }) || []
    );
  }, [showAvoided, showMealPlanRecipes, optimisticRecipes]);

  // Initialize pagination
  const { currentPage, changePage } = usePagination({ defaultPage: 1 });

  const recipesPerPage = 12; // Define recipes per page - 3 cols of 4 rows

  // Calculate total pages
  const totalPages = Math.ceil((filteredRecipes?.length || 0) / recipesPerPage);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const actionParam = params.get("action");
    const idParam = params.get("id");

    if (actionParam === UrlAction.View && idParam) {
      const recipe = recipesData?.find((r) => String(r.id) === idParam);
      if (recipe) {
        setSelectedRecipe(recipe);
        setAction("View");
        setModalOpen(true);
      }
    } else if (actionParam === UrlAction.Edit && idParam) {
      const recipe = recipesData?.find((r) => String(r.id) === idParam);
      if (recipe) {
        setSelectedRecipe(recipe);
        setAction("Edit");
        setModalOpen(true);
      }
    } else if (actionParam === UrlAction.Add) {
      setSelectedRecipe(defaultRecipe);
      setAction("Add");
      setModalOpen(true);
    } else {
      setModalOpen(false);
      setSelectedRecipe(undefined);
    }
  }, [recipesData]);

  // Get current recipes for the page
  const currentRecipes = useMemo(() => {
    const indexOfLastRecipe = currentPage * recipesPerPage;
    const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
    return filteredRecipes?.slice(indexOfFirstRecipe, indexOfLastRecipe);
  }, [currentPage, recipesPerPage, filteredRecipes]);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedRecipe(undefined); // Reset selectedRecipe

    // Remove 'action' and 'id' from URL while preserving 'page'
    const params = new URLSearchParams(window.location.search);
    const currentPageParam = params.get("page") || "1"; // Default to page 1 if not present
    params.delete("mealType");
    params.delete("timeScheduled");
    params.delete("mealPlanId");
    params.delete("action");
    params.delete("id");
    params.set("page", String(currentPage)); // Ensure 'page' remains

    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    window.history.replaceState(null, "", newUrl);
  }, [pathname, currentPage]);

  /**
   * Handler for adding a new recipe via the drawer form.
   * Converts form data to a IRecipeInterface object and saves it.
   */
  const handleAddRecipe = useCallback(
    async (recipe: IRecipeInterface) => {
      try {
        recipe.clientId = clientId;
        // Save the new recipe to the backend
        if (!recipe) {
          throw new Error("Recipe data is missing");
        } else if (!recipe.clientId) {
          throw new Error("Client ID is missing");
        }

        // Extract file information
        let objectUrl = recipe.image;

        if (recipe.image && recipe.image.startsWith("data:image")) {
          objectUrl =
            (await saveImageToS3(recipe.image, `client/${userId}/recipes/`)) ||
            "/aiimages/food/default-food.svg";
          if (!objectUrl) {
            throw new Error("Failed to upload the image to S3");
          }
        } else if (recipe.image.includes("edamam")) {
          const buffer = await fetchImageAndConvertToBuffer(recipe.image);

          if (buffer) {
            const contentType = "image/jpeg"; // Adjust content type based on image type
            // Upload the buffer to S3
            const s3Url = await uploadImageToS3FromBuffer(
              buffer,
              "recipes/",
              `${Date.now()}.jpg`,
              contentType
            );
            if (s3Url) {
              objectUrl = s3Url; // Use the S3 URL if upload is successful
            } else {
              console.error("Failed to upload image to S3.");
              objectUrl = "/aiimages/food/default-food.svg"; // Fallback to default if upload fails
            }
          } else {
            objectUrl = recipe.image; // Fallback if fetching the image fails
          }
        }

        // Update the recipe image URL to the S3 URL
        const updatedRecipe = {
          ...recipe,
          image: objectUrl,
          url: recipe.isCustom
            ? `${hostname}/${pathname}?page=${currentPage}&action=${UrlAction.View}&id=`
            : recipe.url,
        };
        const newRecipe = await saveRecipe(updatedRecipe);
        if (newRecipe && newRecipe.id) {
          upsertOptimisticRecipe({ type: "upsert", item: newRecipe });
        }
      } catch (error) {
        console.error("Error saving recipe: ", error);
      }

      // Close the Add Recipe Drawer after saving
      handleCloseModal();
    },
    [pathname, upsertOptimisticRecipe, handleCloseModal, currentPage]
  );

  /**
   * Handler for viewing recipe details.
   * It sets the selected recipe and opens the Recipe Details Drawer.
   */
  const handleViewDetails = useCallback(
    (recipe: IRecipeInterface) => {
      setSelectedRecipe(recipe);
      setAction("View");
      setModalOpen(true);

      const params = new URLSearchParams(window.location.search);
      params.set("page", String(currentPage));
      params.set("action", UrlAction.View);
      params.set("id", String(recipe.id));
      window.history.pushState(null, "", `${pathname}?${params.toString()}`);
    },
    [pathname, currentPage]
  );

  /**
   * Handler for updating a recipe.
   * Updates the recipe in the backend and notifies the parent component.
   */
  const handleUpdateRecipe = useCallback(
    async (recipe: IRecipeInterface) => {
      try {
        // Save the new recipe to the backend
        if (!recipe) {
          throw new Error("Recipe data is missing");
        } else if (!recipe.clientId) {
          throw new Error("Client ID is missing");
        }

        // replace image if it's a new image
        if (
          recipe.image &&
          recipe.image.startsWith("data:image") &&
          !recipe.image.includes("edamam")
        ) {
          const oldImageUrl = recipesData?.find(
            (r) => r.id === recipe.id
          )?.image;

          const newImageUrl =
            (await saveImageToS3(recipe.image, "recipes/")) ||
            "/aiimages/food/default-food.svg";
          if (newImageUrl) {
            recipe.image = newImageUrl;
          } else {
            console.error("Failed to upload the new image to S3.");
            // Handle the error as needed, possibly abort the update
          }

          // Only delete the old image if the new image was uploaded successfully and the old image exists
          if (newImageUrl && oldImageUrl) {
            // Assuming you pass the oldImageUrl
            const deletionSuccess = await deleteImageFromS3(oldImageUrl);
            if (!deletionSuccess) {
              console.error("Failed to delete the old image from S3.");
              // Handle the error as needed, possibly abort the update
            }
          }
        }

        const savedRecipe = await updateRecipe(recipe);
        if (savedRecipe) {
          upsertOptimisticRecipe({ type: "upsert", item: savedRecipe });
          setSelectedRecipe(undefined);
        }
      } catch (error) {
        console.error("Error saving recipe: ", error);
      }

      // Close the Add Recipe Drawer after saving
      handleCloseModal();
    },
    [upsertOptimisticRecipe, handleCloseModal, recipesData]
  );

  const closeConfirmModal = () => {
    setIsConfirmOpen(false);
  };

  const confirmDelete = async () => {
    if (selectedRecipe) {
      await handleDeleteRecipe(selectedRecipe);
      closeConfirmModal();
    }
  };

  /**
   * Handler for deleting a recipe.
   * Removes the recipe from the backend and notifies the parent component.
   */
  const handleDeleteRecipe = useCallback(
    async (recipe: IRecipeInterface) => {
      try {
        if (recipe.image && !recipe.image.includes("edamam")) {
          const deletionSuccess = await deleteImageFromS3(recipe.image);
          if (!deletionSuccess) {
            console.error("Failed to delete the image from S3.");
          }
        }

        const result = await deleteRecipe(recipe);
        // Optimistically update the UI by removing the deleted recipe
        if (result && result.success) {
          upsertOptimisticRecipe({ type: "delete", item: recipe });
          // Remove recipeId from URL if the deleted recipe was being viewed
          handleCloseModal();
        }
        console.log(`Recipe with ID ${recipe.id} deleted successfully.`);
      } catch (error) {
        console.error("Error deleting recipe:", error);
        // Optionally, show an error message to the user
      }
    },
    [upsertOptimisticRecipe, handleCloseModal, closeConfirmModal]
  );

  const handleClickAdd = useCallback(() => {
    setAction("Search");
    setSelectedRecipe(defaultRecipe);
    setModalOpen(true);

    // Update URL with only 'action=Add'
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(currentPage));
    params.set("action", UrlAction.Add);
    params.delete("id"); // Ensure 'id' is removed
    window.history.pushState(null, "", `${pathname}?${params.toString()}`);
  }, [pathname, currentPage]);

  return (
    <div className="flex flex-col min-h-full">
      {isBannedOpen && (
        <div className="mb-2">
          <GlowyBanner
            title={"Warning"}
            subtitle={
              "Recipe images used from search recipes will only be temporarily available for 1 hour. Use the edit feature to use your own image."
            }
            onDismiss={() => setIsBannedOpen(false)}
          />
        </div>
      )}

      {/* Filter Toggle */}
      <div className="flex justify-end p-4 mt-4 space-x-4">
        <ToggleInput
          label="Show Avoided Recipes"
          enabled={showAvoided}
          onChange={() => setShowAvoided(!showAvoided)}
        />
        <ToggleInput
          label="Show Meal Plan Recipes"
          enabled={showMealPlanRecipes}
          onChange={() => setShowMealPlanRecipes(!showMealPlanRecipes)}
        />
      </div>
      <CardsWithDetailsContainer
        title="My Recipes"
        subtitle={`Total Recipes: ${totalRecipes}`}
      >
        {currentRecipes && currentRecipes.length > 0 ? (
          currentRecipes.map((recipe) => (
            <>
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                handleViewDetails={handleViewDetails}
                handleImageError={handleImageError}
                setIsConfirmOpen={setIsConfirmOpen}
                setSelectedRecipe={setSelectedRecipe}
                handleDeleteRecipe={handleDeleteRecipe}
              />
            </>
          ))
        ) : (
          <p className="text-gray-500">No recipes found.</p>
        )}
      </CardsWithDetailsContainer>

      {/* Pagination Component */}
      {totalPages && (
        <div className="py-4">
          <CenteredPageNumbers
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={changePage}
          />
        </div>
      )}

      {/* Recipe Modal */}
      {selectedRecipe && !isConfirmOpen && (
        <RecipeModalContent
          action={action}
          setAction={setAction}
          page={currentPage}
          open={modalOpen}
          setOpen={setModalOpen}
          recipeAction={
            action === "Add" || action === "Search"
              ? handleAddRecipe
              : handleUpdateRecipe
          }
          recipe={selectedRecipe}
          setRecipe={setSelectedRecipe}
          deleteButtonText={
            action === "View" || action === "Edit" ? "Delete" : undefined
          }
          onDelete={() => {
            setIsConfirmOpen(true);
            action === "View" || action === "Edit"
              ? handleDeleteRecipe.bind(null, selectedRecipe)
              : undefined;
          }}
          onClose={handleCloseModal} // Pass 'handleCloseModal' here
        />
      )}

      {/* Confirm Action Modal */}
      <ConfirmActionModal
        open={isConfirmOpen}
        onClose={closeConfirmModal}
        title="Delete Recipe"
        message={`Are you sure you want to delete the recipe "${selectedRecipe?.label}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        colorScheme="bg-red-600 hover:bg-red-700"
      />

      {/* Add Recipe Button */}
      <button
        onClick={handleClickAdd}
        className="fixed bottom-10 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Add new recipe"
      >
        <PlusIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

export default React.memo(RecipesGrid);
