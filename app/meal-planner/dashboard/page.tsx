import {
  CalendarIcon,
  ClipboardIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import {
  ClockIcon,
  ChevronRightIcon,
  FireIcon,
} from "@heroicons/react/20/solid";
import { Metadata } from "next";
import { auth } from "@/auth";
import { Session } from "next-auth";
import { IMealInterface } from "@/models/interfaces/meal/Meal";
import { getMealsByClientId } from "@/lib/meal";
import { Nutrients } from "@/constants/constants-enums";
import Link from "next/link";
import dayjs from "dayjs";
import CenteredPageNumbers from "@/app/components/ui/pagination/centered-page-numbers";
import { ROUTES } from "@/constants/routes";

type DashboardProps = {
  searchParams: { [key: string]: string | string[] | undefined }; // Parse query params from the URL
};
const ITEMS_PER_PAGE = 5;

const DashboardPage: React.FC<DashboardProps> = async ({ searchParams }) => {
  const session = (await auth()) as Session;
  const clientId = session.user.clientId;

  const meals: IMealInterface[] = (await getMealsByClientId(
    Number(clientId)
  )) as IMealInterface[];

  // Get the start and end of the current week (Sunday as the first day)
  const startOfWeek = dayjs().startOf("week");
  const endOfWeek = dayjs().endOf("week");

  // Filter meals for the current week
  const mealsThisWeek = meals.filter((meal) => {
    const mealDate = dayjs(meal.timeScheduled);
    return mealDate.isAfter(startOfWeek) && mealDate.isBefore(endOfWeek);
  });

  // Filter meals for the current week
  // Get the start and end of today
  const startOfToday = dayjs().startOf("day");
  const endOfToday = dayjs().endOf("day");

  // Filter meals for today
  const mealsToday = meals.filter((meal) => {
    const mealDate = dayjs(meal.timeScheduled);
    return mealDate.isAfter(startOfToday) && mealDate.isBefore(endOfToday);
  });

  // Optionally, sort the meals by timeScheduled in ascending order
  const sortedMealsToday = mealsToday.sort(
    (a, b) =>
      dayjs(a.timeScheduled).valueOf() - dayjs(b.timeScheduled).valueOf()
  );

  // Calculate total "Energy" nutrient for today's meals
  const totalEnergy = mealsToday.reduce((total, meal) => {
    const mealEnergy = meal.nutrients?.[Nutrients.ENERC_KCAL]?.quantity || 0; // Safely access the "Energy" nutrient
    return total + mealEnergy;
  }, 0);

  // Filter meals for today with timeConsumed defined
  const mealsTodayWithConsumption = mealsToday.filter((meal) => {
    const mealDate = dayjs(meal.timeScheduled);
    return (
      mealDate.isAfter(startOfToday) &&
      mealDate.isBefore(endOfToday) &&
      meal.timeConsumed !== null
    );
  });

  const cards = [
    {
      name: "Total Meals Planned Today",
      href: "#",
      icon: ClipboardIcon,
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

  const { page } = await searchParams;
  const currentPage = await parseInt((page as string) || "1", 10);

  // Calculate total pages
  const totalPages = Math.ceil(mealsThisWeek.length / ITEMS_PER_PAGE);

  // Get meals for the current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const mealsToDisplay = mealsThisWeek.slice(startIndex, endIndex);
  const getPageLink = (page: number) =>
    `${ROUTES.MEAL_PLANNER.DASHBOARD}?page=${page}`;

  return (
    <main className="flex-1 pb-8">
      {/* Page header */}
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
          <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
            <div className="min-w-0 flex-1">
              {/* Profile */}
              <div className="flex items-center">
                <div>
                  <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9">
                    Welcome back, Meal Planner!
                  </h1>
                  <dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                    <dt className="sr-only">User</dt>
                    <dd className="flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6">
                      <CheckCircleIcon
                        aria-hidden="true"
                        className="mr-1.5 h-5 w-5 flex-shrink-0 text-green-400"
                      />
                      Staying on track today!
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-medium leading-6 text-gray-900">
            Today&apos;s Overview
          </h2>
          <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card */}
            {cards.map((card) => (
              <div
                key={card.name}
                className="overflow-hidden rounded-lg bg-white shadow"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <card.icon
                        aria-hidden="true"
                        className="h-6 w-6 text-gray-400"
                      />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="truncate text-sm font-medium text-gray-500">
                          {card.name}
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {card.amount}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <a
                      href={card.href}
                      className="font-medium text-cyan-700 hover:text-cyan-900"
                    >
                      View details
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <h2 className="mx-auto mt-8 max-w-6xl px-4 text-lg font-medium leading-6 text-gray-900 sm:px-6 lg:px-8">
          Meal Plan Progress
        </h2>

        {/* Activity list (smallest breakpoint only) */}
        <div className="shadow sm:hidden">
          <ul
            role="list"
            className="mt-2 divide-y divide-gray-200 overflow-hidden shadow sm:hidden"
          >
            {mealsThisWeek.map((meal) => (
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
                            {meal.nutrients![Nutrients.ENERC_KCAL].quantity}
                          </span>
                        </span>
                        <time dateTime={`meal.timeScheduled`}>
                          {meal.timeScheduled.toISOString()}`
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

        {/* Meal plan table (small breakpoint and up) */}
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
                      {/* <th
                        scope="col"
                        className="hidden bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900 md:block"
                      >
                        Status
                      </th> */}
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
                              {meal && (
                                <ClipboardIcon
                                  aria-hidden="true"
                                  className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                />
                              )}

                              <p className="truncate text-gray-500 group-hover:text-gray-900">
                                {meal.name}
                              </p>
                            </Link>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                          <span className="font-medium text-gray-900">
                            {meal.nutrients![
                              Nutrients.ENERC_KCAL
                            ].quantity.toFixed(1)}
                          </span>
                        </td>
                        {/* <td className="hidden whitespace-nowrap px-6 py-4 text-sm text-gray-500 md:block">
                          <span
                            className={classNames(
                              statusStyles[meal.status],
                              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
                            )}
                          >
                            {meal.status}
                          </span>
                        </td> */}
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
                <CenteredPageNumbers
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={getPageLink}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
export const metadata: Metadata = {
  title: "Meal Planner - Dashboard",
  description: "Generate personalized meal plans easily.",
};
