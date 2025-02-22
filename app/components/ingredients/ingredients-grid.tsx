"use client";

import React, {
  useState,
  useCallback,
  useOptimistic,
  useEffect,
  useMemo,
} from "react";
import { PlusIcon } from "@heroicons/react/24/outline"; // Import necessary icons

import CardsWithDetailsContainer from "../ui/cards-with-details";
import {
  deleteImageFromS3,
  saveImageToS3,
  uploadImageToS3FromBuffer,
} from "@/lib/s3-client";
import ToggleInput from "../ui/inputs/toggle-input";
import ConfirmActionModal from "../ui/modals/confirm-action-modal";
import { FormActionType } from "@/models/interfaces/types";
import { crudReducer } from "@/util/state-management";
import { usePathname } from "next/navigation";
import { UrlAction } from "@/constants/constants-enums";
import usePagination from "@/hooks/use-pagination";
import CenteredPageNumbers from "../ui/pagination/centered-page-numbers";
import { hostname } from "@/constants/constant-strings";
import { fetchImageAndConvertToBuffer } from "@/lib/image";
import GlowyBanner from "../ui/banner/banner-with-glow";
import { IIngredient } from "@/models/interfaces/ingredient/ingredient";
import IngredientCard from "./ingredient-card";
import IngredientModalContent from "./ingredients-modal-content";
import {
  addIngredientAction,
  deleteIngredientAction,
  updateIngredientAction,
} from "@/actions/ingredients-action";

type IngredientsGridProps = {
  ingredientsData: IIngredient[] | undefined; // Ingredients data fetched from API
  clientId: number; // Client ID for associating ingredients
  userId: string;
};

// TODO: show only one ingredient per meal plan for meal plan ingredients
const IngredientsGrid: React.FC<IngredientsGridProps> = ({
  ingredientsData,
  clientId,
  userId,
}) => {
  const pathname = usePathname();

  // State to control the visibility of the Add Ingredient Drawer
  const [modalOpen, setModalOpen] = useState(false);
  const [isBannedOpen, setIsBannedOpen] = useState<boolean>(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  // State to hold the currently selected ingredient for viewing details
  const [selectedIngredient, setSelectedIngredient] = useState<
    IIngredient | undefined
  >(undefined);
  const [action, setAction] = useState<FormActionType | "Search">("Add");

  const defaultIngredient: IIngredient = {
    id: 0,
    clientId: clientId,
    measure: "",
    food: "",
    weight: 0,
    foodId: null, // Empty string for non-custom ingredients, null should be explicitly set if custom
    image: "",
  };

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.src = "/aiimages/food/default-food.svg";
  };

  // Manage optimistic state for ingredients, allowing immediate UI updates on add, update, or delete actions
  const [optimisticIngredients, upsertOptimisticIngredient] = useOptimistic(
    ingredientsData,
    (state, action: { type: "upsert" | "delete"; item: IIngredient }) =>
      crudReducer<IIngredient>(state, action)
  );

  // Toggle states for ingredients with mealPlanId
  const [showCustomIngredients, setShowCustomIngredients] = useState(false);

  // Calculate total ingredients
  const totalIngredients = ingredientsData ? ingredientsData.length : 0;

  // Filtered ingredients based on the avoid filter
  const filteredCustomIngredients = useMemo(() => {
    return (
      optimisticIngredients?.filter((ingredient) => {
        if (showCustomIngredients && !ingredient.foodId) return false;
        return true;
      }) || []
    );
  }, [showCustomIngredients, optimisticIngredients]);

  // Initialize pagination
  const { currentPage, changePage } = usePagination({ defaultPage: 1 });

  const ingredientsPerPage = 10; // Define ingredients per page

  // Calculate total pages
  const totalPages = Math.ceil(
    (filteredCustomIngredients?.length || 0) / ingredientsPerPage
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const actionParam = params.get("action");
    const idParam = params.get("id");

    if (actionParam === UrlAction.View && idParam) {
      const ingredient = ingredientsData?.find((r) => String(r.id) === idParam);
      if (ingredient) {
        setSelectedIngredient(ingredient);
        setAction("View");
        setModalOpen(true);
      }
    } else if (actionParam === UrlAction.Edit && idParam) {
      const ingredient = ingredientsData?.find((r) => String(r.id) === idParam);
      if (ingredient) {
        setSelectedIngredient(ingredient);
        setAction("Edit");
        setModalOpen(true);
      }
    } else if (actionParam === UrlAction.Add) {
      setSelectedIngredient(defaultIngredient);
      setAction("Add");
      setModalOpen(true);
    } else {
      setModalOpen(false);
      setSelectedIngredient(undefined);
    }
  }, [ingredientsData]);

  // Get current ingredients for the page
  const currentIngredients = useMemo(() => {
    const indexOfLastIngredient = currentPage * ingredientsPerPage;
    const indexOfFirstIngredient = indexOfLastIngredient - ingredientsPerPage;
    return filteredCustomIngredients?.slice(
      indexOfFirstIngredient,
      indexOfLastIngredient
    );
  }, [currentPage, ingredientsPerPage, filteredCustomIngredients]);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedIngredient(undefined); // Reset selectedIngredient

    // Remove 'action' and 'id' from URL while preserving 'page'
    const params = new URLSearchParams(window.location.search);
    const currentPageParam = params.get("page") || "1"; // Default to page 1 if not present
    // params.delete("mealType");
    // params.delete("timeScheduled");
    // params.delete("mealPlanId");
    params.delete("action");
    params.delete("id");
    params.set("page", String(currentPage)); // Ensure 'page' remains

    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    window.history.replaceState(null, "", newUrl);
  }, [pathname, currentPage]);

  /**
   * Handler for adding a new ingredient via the drawer form.
   * Converts form data to a IIngredientInterface object and saves it.
   */
  const handleAddIngredient = useCallback(
    async (ingredient: IIngredient) => {
      try {
        ingredient.clientId = clientId;
        // Save the new ingredient to the backend
        if (!ingredient) {
          throw new Error("Ingredient data is missing");
        } else if (!ingredient.clientId) {
          throw new Error("Client ID is missing");
        }

        // Extract file information
        let objectUrl = ingredient.image;

        if (ingredient.image && ingredient.image.startsWith("data:image")) {
          objectUrl =
            (await saveImageToS3(
              ingredient.image,
              `client/${userId}/ingredients/`
            )) || "/aiimages/food/default-food.svg";
          if (!objectUrl) {
            throw new Error("Failed to upload the image to S3");
          }
          // TODO: save image to s3 if possible
        } else if (ingredient.image.includes("edamam")) {
          const buffer = await fetchImageAndConvertToBuffer(ingredient.image);

          if (buffer) {
            const contentType = "image/jpeg"; // Adjust content type based on image type
            // Upload the buffer to S3
            const s3Url = await uploadImageToS3FromBuffer(
              buffer,
              "ingredients/",
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
            objectUrl = ingredient.image; // Fallback if fetching the image fails
          }
        }

        // Update the ingredient image URL to the S3 URL
        const updatedIngredient = {
          ...ingredient,
          image: objectUrl, //,
          // url: `${hostname}/${pathname}?page=${currentPage}&action=${UrlAction.View}&id=`,
        };
        const newIngredient = await addIngredientAction(updatedIngredient);
        if (newIngredient && newIngredient.id) {
          upsertOptimisticIngredient({ type: "upsert", item: newIngredient });
        }
      } catch (error) {
        console.error("Error saving ingredient: ", error);
      }

      // Close the Add Ingredient Drawer after saving
      handleCloseModal();
    },
    [pathname, upsertOptimisticIngredient, handleCloseModal, currentPage]
  );

  /**
   * Handler for viewing ingredient details.
   * It sets the selected ingredient and opens the Ingredient Details Drawer.
   */
  const handleViewDetails = useCallback(
    (ingredient: IIngredient) => {
      setSelectedIngredient(ingredient);
      setAction("View");
      setModalOpen(true);

      const params = new URLSearchParams(window.location.search);
      params.set("page", String(currentPage));
      params.set("action", UrlAction.View);
      params.set("id", String(ingredient.id));
      window.history.pushState(null, "", `${pathname}?${params.toString()}`);
    },
    [pathname, currentPage]
  );

  /**
   * Handler for updating a ingredient.
   * Updates the ingredient in the backend and notifies the parent component.
   */
  const handleUpdateIngredient = useCallback(
    async (ingredient: IIngredient) => {
      try {
        // Save the new ingredient to the backend
        if (!ingredient) {
          throw new Error("Ingredient data is missing");
        } else if (!ingredient.clientId) {
          throw new Error("Client ID is missing");
        }

        // replace image if it's a new image
        if (
          ingredient.image &&
          ingredient.image.startsWith("data:image") &&
          !ingredient.image.includes("edamam")
        ) {
          const oldImageUrl = ingredientsData?.find(
            (r) => r.id === ingredient.id
          )?.image;

          const newImageUrl =
            (await saveImageToS3(ingredient.image, "ingredients/")) ||
            "/aiimages/food/default-food.svg";
          if (newImageUrl) {
            ingredient.image = newImageUrl;
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

        const savedIngredient = await updateIngredientAction(ingredient);
        if (savedIngredient) {
          upsertOptimisticIngredient({ type: "upsert", item: savedIngredient });
          setSelectedIngredient(undefined);
        }
      } catch (error) {
        console.error("Error saving ingredient: ", error);
      }

      // Close the Add Ingredient Drawer after saving
      handleCloseModal();
    },
    [upsertOptimisticIngredient, handleCloseModal, ingredientsData]
  );

  const closeConfirmModal = () => {
    setIsConfirmOpen(false);
  };

  const confirmDelete = async () => {
    if (selectedIngredient) {
      await handleDeleteIngredient(selectedIngredient);
      closeConfirmModal();
    }
  };

  /**
   * Handler for deleting a ingredient.
   * Removes the ingredient from the backend and notifies the parent component.
   */
  const handleDeleteIngredient = useCallback(
    async (ingredient: IIngredient) => {
      try {
        if (ingredient.image && !ingredient.image.includes("edamam")) {
          const deletionSuccess = await deleteImageFromS3(ingredient.image);
          if (!deletionSuccess) {
            console.error("Failed to delete the image from S3.");
          }
        }

        const result = await deleteIngredientAction(ingredient);
        // Optimistically update the UI by removing the deleted ingredient
        if (result && result.success) {
          upsertOptimisticIngredient({ type: "delete", item: ingredient });
          // Remove ingredientId from URL if the deleted ingredient was being viewed
          handleCloseModal();
        }
        console.log(
          `Ingredient with ID ${ingredient.id} deleted successfully.`
        );
      } catch (error) {
        console.error("Error deleting ingredient:", error);
        // Optionally, show an error message to the user
      }
    },
    [upsertOptimisticIngredient, handleCloseModal, closeConfirmModal]
  );

  const handleClickAdd = useCallback(() => {
    setAction("Search");
    setSelectedIngredient(defaultIngredient);
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
              "Ingredient images used from search ingredients will only be temporarily available for 1 hour. Use the edit feature to use your own image."
            }
            onDismiss={() => setIsBannedOpen(false)}
          />
        </div>
      )}

      {/* Filter Toggle */}
      <div className="flex justify-end p-4 mt-4 space-x-4">
        <ToggleInput
          label="Show Custom Ingredients"
          enabled={showCustomIngredients}
          onChange={() => setShowCustomIngredients(!showCustomIngredients)}
        />
      </div>
      <CardsWithDetailsContainer
        title="My Ingredients"
        subtitle={`Total Ingredients: ${totalIngredients}`}
      >
        {currentIngredients && currentIngredients.length > 0 ? (
          currentIngredients.map((ingredient) => (
            <>
              <IngredientCard
                key={ingredient.id}
                ingredient={ingredient}
                handleViewDetails={handleViewDetails}
                handleImageError={handleImageError}
                setIsConfirmOpen={setIsConfirmOpen}
                setSelectedIngredient={setSelectedIngredient}
                handleDeleteIngredient={handleDeleteIngredient}
              />
            </>
          ))
        ) : (
          <p className="text-gray-500">No ingredients found.</p>
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

      {/* Ingredient Modal */}
      {selectedIngredient && !isConfirmOpen && (
        <IngredientModalContent
          action={action}
          setAction={setAction}
          page={currentPage}
          open={modalOpen}
          setOpen={setModalOpen}
          ingredientAction={
            action === "Add" || action === "Search"
              ? handleAddIngredient
              : handleUpdateIngredient
          }
          ingredient={selectedIngredient}
          setIngredient={setSelectedIngredient}
          deleteButtonText={
            action === "View" || action === "Edit" ? "Delete" : undefined
          }
          onDelete={() => {
            setIsConfirmOpen(true);
            action === "View" || action === "Edit"
              ? handleDeleteIngredient.bind(null, selectedIngredient)
              : undefined;
          }}
          onClose={handleCloseModal} // Pass 'handleCloseModal' here
        />
      )}

      {/* Confirm Action Modal */}
      <ConfirmActionModal
        open={isConfirmOpen}
        onClose={closeConfirmModal}
        title="Delete Ingredient"
        message={`Are you sure you want to delete the ingredient "${selectedIngredient?.food}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        colorScheme="bg-red-600 hover:bg-red-700"
      />

      {/* Add Ingredient Button */}
      <button
        onClick={handleClickAdd}
        className="fixed bottom-10 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Add new ingredient"
      >
        <PlusIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

export default React.memo(IngredientsGrid);
