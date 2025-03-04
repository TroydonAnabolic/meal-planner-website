export const defaultFoodImagePath = "/aiimages/food/default-food.svg";
export const hostname =
  process.env.NODE_ENV === "production"
    ? process.env.AUTH_TRUST_HOST_PROD
    : process.env.AUTH_TRUST_HOST;
