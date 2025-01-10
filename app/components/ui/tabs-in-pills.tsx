// tabs-in-pills.tsx

import { Tab } from "@/models/interfaces/types";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type TabsWithPillsProps = {
  tabs: Tab[];
  onTabChange?: (tabName: string) => void; // Callback when a tab is changed
  fontSize?: string; // Optional font size
};

const TabsWithPills: React.FC<TabsWithPillsProps> = ({
  tabs,
  onTabChange,
  fontSize,
}) => {
  /**
   * Handler for tab clicks.
   * Calls the onTabChange callback if provided.
   */
  const handleTabClick = (tabName: string) => {
    if (onTabChange) {
      onTabChange(tabName);
    }
  };

  return (
    <div>
      {/* Mobile View: Dropdown */}
      <div className="sm:hidden py-4 ">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          defaultValue={tabs.find((tab) => tab.current)?.name || ""}
          value={tabs.find((tab) => tab.current)?.name || ""}
          className={`block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-gray-800 ${fontSize}`}
          onChange={(e) => handleTabClick(e.target.value)}
        >
          {tabs.map((tab) => (
            <option key={tab.name} value={tab.name}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      {/* Desktop View: Horizontal Tabs */}
      <div className="hidden sm:block py-4">
        <nav aria-label="Tabs" className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.name}
              onClick={() => handleTabClick(tab.name)}
              className={classNames(
                tab.current
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-500 hover:text-gray-700",
                `rounded-md px-3 py-2 text-sm font-medium focus:outline-none ${fontSize}`
              )}
              aria-current={tab.current ? "page" : undefined}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default TabsWithPills;
