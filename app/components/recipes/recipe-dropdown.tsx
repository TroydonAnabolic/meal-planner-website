"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import { fetchRecipesByClientId } from "@/lib/client-side/recipe";

type RecipeDropdownProps = {
    clientId: number;
    // Called when a recipe is selected.
    onSelect: (recipe: IRecipeInterface) => void;
};

const RecipeDropdown: React.FC<RecipeDropdownProps> = ({ clientId, onSelect }) => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [recipes, setRecipes] = useState<IRecipeInterface[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Trigger fetching recipes only when the search query is not empty.
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setRecipes([]);
            return;
        }

        const loadRecipes = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const localRecipes = await fetchRecipesByClientId(clientId);
                // Filter the fetched recipes based on the search query.
                const filtered = (localRecipes || []).filter((recipe) =>
                    recipe.label.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setRecipes(filtered);
            } catch (err) {
                console.error("Error fetching local recipes:", err);
                setError("Failed to load recipes.");
            } finally {
                setIsLoading(false);
            }
        };

        loadRecipes();
    }, [searchQuery, clientId]);

    return (
        <div className="relative">
            <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-md border border-gray-300 p-2 text-gray-800"
            />
            {isLoading && (
                <p className="mt-2 text-sm text-gray-500">Loading recipes...</p>
            )}
            {error && (
                <p className="mt-2 text-sm text-red-500">{error}</p>
            )}
            {searchQuery && recipes.length > 0 && (
                <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
                    {recipes.map((recipe) => (
                        <li
                            key={recipe.uri}
                            onClick={() => {
                                console.log("onSelect fired with recipe:", recipe);
                                onSelect(recipe);
                            }}
                            className="flex items-center p-2 hover:bg-gray-50 cursor-pointer"
                        >
                            <div className="relative h-12 w-12 flex-shrink-0">
                                {recipe.image ? (
                                    <Image
                                        src={recipe.image}
                                        alt={recipe.label}
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                ) : (
                                    <div className="h-full w-full bg-gray-200" />
                                )}
                            </div>
                            <div className="ml-3 flex-grow">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {recipe.label}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {searchQuery && !isLoading && recipes.length === 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-500">
                    No recipes found.
                </div>
            )}
        </div>
    );
};

export default RecipeDropdown;