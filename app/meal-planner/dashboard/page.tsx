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

const cards = [
  { name: "Total Meals Planned", href: "#", icon: ClipboardIcon, amount: "25" },
  { name: "Calories Today", href: "#", icon: FireIcon, amount: "1800 kcal" },
  { name: "Remaining Meals", href: "#", icon: CalendarIcon, amount: "2" },
];
type MealStatus = keyof typeof statusStyles;

const meals: {
  id: number;
  name: string;
  href: string;
  calories: string;
  status: MealStatus;
  date: string;
  datetime: string;
}[] = [
  {
    id: 1,
    name: "Breakfast - Oatmeal with Fruits",
    href: "#",
    calories: "300 kcal",
    status: "completed",
    date: "October 2, 2024",
    datetime: "2024-10-02",
  },
  {
    id: 2,
    name: "Lunch - Grilled Chicken Salad",
    href: "#",
    calories: "500 kcal",
    status: "upcoming",
    date: "October 2, 2024",
    datetime: "2024-10-02",
  },
];
const statusStyles = {
  completed: "bg-green-100 text-green-800",
  upcoming: "bg-yellow-100 text-yellow-800",
  missed: "bg-red-100 text-red-800",
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type Props = {};

const Dashboard = (props: Props) => {
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
            {meals.map((meal) => (
              <li key={meal.id}>
                <a
                  href={meal.href}
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
                            {meal.calories}
                          </span>
                        </span>
                        <time dateTime={meal.datetime}>{meal.date}</time>
                      </span>
                    </span>
                    <ChevronRightIcon
                      aria-hidden="true"
                      className="h-5 w-5 flex-shrink-0 text-gray-400"
                    />
                  </span>
                </a>
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
                      <th
                        scope="col"
                        className="hidden bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900 md:block"
                      >
                        Status
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
                    {meals.map((meal) => (
                      <tr key={meal.id} className="bg-white">
                        <td className="w-full max-w-0 whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          <div className="flex">
                            <a
                              href={meal.href}
                              className="group inline-flex space-x-2 truncate text-sm"
                            >
                              <ClipboardIcon
                                aria-hidden="true"
                                className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                              />
                              <p className="truncate text-gray-500 group-hover:text-gray-900">
                                {meal.name}
                              </p>
                            </a>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                          <span className="font-medium text-gray-900">
                            {meal.calories}
                          </span>
                        </td>
                        <td className="hidden whitespace-nowrap px-6 py-4 text-sm text-gray-500 md:block">
                          <span
                            className={classNames(
                              statusStyles[meal.status],
                              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
                            )}
                          >
                            {meal.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                          <time dateTime={meal.datetime}>{meal.date}</time>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination */}
                <nav
                  aria-label="Pagination"
                  className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
                >
                  <div className="hidden sm:block">
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to{" "}
                      <span className="font-medium">10</span> of{" "}
                      <span className="font-medium">20</span> results
                    </p>
                  </div>
                  <div className="flex flex-1 justify-between gap-x-3 sm:justify-end">
                    <a
                      href="#"
                      className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                    >
                      Previous
                    </a>
                    <a
                      href="#"
                      className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                    >
                      Next
                    </a>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
export const metadata: Metadata = {
  title: "Meal Planner - Dashboard",
  description: "Generate personalized meal plans easily.",
};
