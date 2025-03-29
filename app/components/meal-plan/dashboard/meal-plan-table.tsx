"use client";
import React from "react";
import Link from "next/link";
import { Nutrients } from "@/constants/constants-enums";
import CenteredPageNumbersLink from "@/app/components/ui/pagination/centred-page-numbers-link";

type MealPlanTableProps = {
    mealsToDisplay: any[];
    currentPage: number;
    totalPages: number;
    getPageLink: (page: number) => string;
};

const MealPlanTable: React.FC<MealPlanTableProps> = ({
    mealsToDisplay,
    currentPage,
    totalPages,
    getPageLink,
}) => {
    // To count re-renders in a client component using useRef
    const renderCount = React.useRef(0);
    renderCount.current++;
    console.log("MealPlanTable renders:", renderCount.current);

    return (
        <div className="hidden sm:block">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="mt-2 flex flex-col">
                    <div className="min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        className="bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Meal
                                    </th>
                                    <th
                                        scope="col"
                                        className="bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900"
                                    >
                                        Calories
                                    </th>
                                    <th
                                        scope="col"
                                        className="bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900"
                                    >
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {mealsToDisplay.map((meal) => (
                                    <tr key={meal.id} className="bg-white">
                                        <td className="w-full max-w-0 whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                            <div className="flex">
                                                <Link
                                                    href={meal.foodSourceUrl || ""}
                                                    className="group inline-flex space-x-2 truncate text-sm"
                                                >
                                                    <p className="truncate text-gray-500 group-hover:text-gray-900">
                                                        {meal.name}
                                                    </p>
                                                </Link>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                                            <span className="font-medium text-gray-900">
                                                {meal.nutrients![Nutrients.ENERC_KCAL]?.quantity.toFixed(1)}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                                            <time dateTime={meal.timeScheduled.toDateString()}>
                                                {meal.timeScheduled.toDateString()}
                                            </time>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* Pagination */}
                        <CenteredPageNumbersLink
                            currentPage={currentPage}
                            totalPages={totalPages}
                            getPageLink={getPageLink}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MealPlanTable;