import Link from "next/link";

interface NavigationItem {
  name: string;
  href: string; // The href will be used as the route path
  current: boolean;
}

interface SecondaryNavigationProps {
  items: NavigationItem[];
}

const SecondaryNavigation: React.FC<SecondaryNavigationProps> = ({ items }) => {
  return (
    <header className="border-b border-gray-200 z-1">
      <nav className="flex overflow-x-auto py-4">
        <ul
          role="list"
          className="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-800 sm:px-6 lg:px-8"
        >
          {items.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={item.current ? "text-indigo-400" : ""}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default SecondaryNavigation;
