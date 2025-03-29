import { getMealsByClientId } from "@/lib/meal";
import { IMealInterface } from "@/models/interfaces/meal/Meal";
import dayjs from "dayjs";
import { Nutrients } from "@/constants/constants-enums";
import { ROUTES } from "@/constants/routes";
import {
    CalendarIcon,
    ClipboardIcon,
    CheckCircleIcon,
    FireIcon,
} from "@heroicons/react/24/outline";
import CardList from "./meal-card";
import MealPlanTable from "./meal-plan-table";
import MealList from "./meal-list";


type MealsSectionProps = {
    clientId: number;
    searchParams: { [key: string]: string | string[] | undefined };
};

const ITEMS_PER_PAGE = 5;

const MealsSection = async ({ clientId, searchParams }: MealsSectionProps) => {
    // Fetch meals
    const meals: IMealInterface[] = (await getMealsByClientId(clientId)) as IMealInterface[];

    // Process dates, filtering, calculations, etc.
    const startOfWeek = dayjs().startOf("week");
    const endOfWeek = dayjs().endOf("week");
    const mealsThisWeek = meals.filter((meal) => {
        const mealDate = dayjs(meal.timeScheduled);
        return mealDate.isAfter(startOfWeek) && mealDate.isBefore(endOfWeek);
    });
    const startOfToday = dayjs().startOf("day");
    const endOfToday = dayjs().endOf("day");
    const mealsToday = meals.filter((meal) => {
        const mealDate = dayjs(meal.timeScheduled);
        return mealDate.isAfter(startOfToday) && mealDate.isBefore(endOfToday);
    });
    const sortedMealsToday = mealsToday.sort(
        (a, b) => dayjs(a.timeScheduled).valueOf() - dayjs(b.timeScheduled).valueOf()
    );
    const totalEnergy = mealsToday.reduce(
        (total, meal) => total + (meal.nutrients?.[Nutrients.ENERC_KCAL]?.quantity || 0),
        0
    );
    const mealsTodayWithConsumption = mealsToday.filter(
        (meal) => {
            const mealDate = dayjs(meal.timeScheduled);
            return mealDate.isAfter(startOfToday) && mealDate.isBefore(endOfToday) && meal.timeConsumed !== null;
        }
    );

    // Cards data
    const cards = [
        {
            name: "Total Meals Planned Today",
            href: "#",
            icon: ClipboardIcon, // make sure to import this
            amount: sortedMealsToday.length,
        },
        {
            name: "Calories Today",
            href: "#",
            icon: FireIcon,
            amount: totalEnergy.toFixed(1),
        },
        {
            name: "Remaining Meals",
            href: "#",
            icon: CalendarIcon,
            amount: sortedMealsToday.length - mealsTodayWithConsumption.length,
        },
    ];

    const { page } = searchParams;
    const currentPage = parseInt((page as string) || "1", 10);
    const totalPages = Math.ceil(mealsThisWeek.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const mealsToDisplay = mealsThisWeek.slice(startIndex, endIndex);
    const getPageLink = (page: number) => `${ROUTES.MEAL_PLANNER.DASHBOARD}?page=${page}`;

    return (
        <div>
            <CardList cards={cards} />
            <MealList meals={mealsThisWeek} />
            <MealPlanTable
                mealsToDisplay={mealsToDisplay}
                currentPage={currentPage}
                totalPages={totalPages}
                getPageLink={getPageLink}
            />
        </div>
    );
};

export default MealsSection;