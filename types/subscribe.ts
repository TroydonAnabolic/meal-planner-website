export type Tier = {
  name: string;
  id: string;
  href: string;
  price: string;
  description: string;
  features: string[];
  featured: boolean;
  active: boolean; // Added property
  available: boolean; // Added property
};
