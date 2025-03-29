"use client";
import React from "react";
import Link from "next/link";
import { ClockIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { Nutrients } from "@/constants/constants-enums";
import { IMealInterface } from "@/models/interfaces/meal/Meal";

type MealListProps = {
    meals: IMealInterface[];
};

const MealList: React.FC<MealListProps> = ({ meals }) => {
    return (
        <div className="shadow sm:hidden">
            <ul
                role="list"
                className="mt-2 divide-y divide-gray-200 overflow-hidden shadow sm:hidden"
            >
                {meals.map((meal) => (
                    <li key={meal.id}>
                        <Link
                            href={meal.foodSourceUrl || ""}
                            className="block bg-white px-4 py-4 hover:bg-gray-50"
                        >
                            <span className="flex items-center space-x-4">
                                <span className="flex flex-1 space-x-2 truncate">
                                    <ClockIcon
                                        aria-hidden="true"
                                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                                    />
                                    <span className="flex flex-col truncate text-sm text-gray-500">
                                        <span className="truncate">{meal.name}</span>
                                        <span>
                                            <span className="font-medium text-gray-900">
                                                {meal.nutrients?.[Nutrients.ENERC_KCAL]?.quantity}
                                            </span>
                                        </span>
                                        <time dateTime={meal.timeScheduled.toISOString()}>
                                            {meal.timeScheduled.toISOString()}
                                        </time>
                                    </span>
                                </span>
                                <ChevronRightIcon
                                    aria-hidden="true"
                                    className="h-5 w-5 flex-shrink-0 text-gray-400"
                                />
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MealList;