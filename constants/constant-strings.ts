export const defaultFoodImagePath = "/aiimages/food/default-food.svg";
export const hostname =
  process.env.NODE_ENV === "production"
    ? process.env.NEXTAUTH_URL
    : process.env.NEXT_PUBLIC_NEXTAUTH_URL;
