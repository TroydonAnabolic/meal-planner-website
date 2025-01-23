"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface FooterNavigationItem {
  name: string;
  href: string;
}

interface FooterNavigation {
  solutions: FooterNavigationItem[];
  support: FooterNavigationItem[];
  company: FooterNavigationItem[];
  legal: FooterNavigationItem[];
}

const footerNavigation: FooterNavigation = {
  solutions: [
    { name: "How It Works", href: "/how-it-works" },
    { name: "Browse Foods", href: "/meal-planner/food/browse-food/" },
  ],
  support: [
    { name: "Pricing", href: "/premium-plan" },
    { name: "Contact Us", href: "/contact-us" },
  ],
  company: [
    { name: "About Us", href: "/about-us" },
    { name: "Blog", href: "#" },
  ],
  legal: [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
  ],
};

const Footer: React.FC = () => {
  const location = usePathname();

  // Define routes where the navigation should be hidden
  const noRootNavRoutes = ["/meal-planner"];

  // Check if current route is in noNavRoutes
  const hideNav = noRootNavRoutes.some((route) => location.startsWith(route));

  if (hideNav) {
    return null;
  }

  return (
    <footer
      aria-labelledby="footer-heading"
      className=" bg-gray-900 py-4 px-6 mt-auto"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8 lg:py-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <Image
            src="/meal-planner-logo.png"
            alt="AI Trainer"
            width={100}
            height={100}
            className=""
          />
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">
                  Solutions
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.solutions.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-white"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">
                  Support
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.support.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-white"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">
                  Company
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.company.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-white"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">
                  Legal
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.legal.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-white"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
