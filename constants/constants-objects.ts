import { IMealPlanPreferences } from "@/models/interfaces/client/meal-planner-preferences";
import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import { Tier } from "@/types/subscribe";

export const defaultMealPlanPreference: IMealPlanPreferences = {
  size: 7,
  plan: {
    accept: {
      all: [
        {
          health: ["SOY_FREE", "FISH_FREE", "MEDITERRANEAN"],
        },
      ],
    },
    fit: {
      ENERC_KCAL: {
        min: 1000,
        max: 2000,
      },
      "SUGAR.added": {
        max: 20,
      },
    },
    sections: {
      Breakfast: {
        accept: {
          all: [
            {
              dish: [
                "drinks",
                "egg",
                "biscuits and cookies",
                "bread",
                "pancake",
                "cereals",
              ],
            },
            {
              meal: ["breakfast"],
            },
          ],
        },
        fit: {
          ENERC_KCAL: {
            min: 100,
            max: 600,
          },
        },
      },
      Lunch: {
        accept: {
          all: [
            {
              dish: [
                "main course",
                "pasta",
                "egg",
                "salad",
                "soup",
                "sandwiches",
                "pizza",
                "seafood",
              ],
            },
            {
              meal: ["lunch/dinner"],
            },
          ],
        },
        fit: {
          ENERC_KCAL: {
            min: 300,
            max: 900,
          },
        },
      },
      Dinner: {
        accept: {
          all: [
            {
              dish: [
                "seafood",
                "egg",
                "salad",
                "pizza",
                "pasta",
                "main course",
              ],
            },
            {
              meal: ["lunch/dinner"],
            },
          ],
        },
        fit: {
          ENERC_KCAL: {
            min: 200,
            max: 900,
          },
        },
      },
    },
  },
};

export const defaultRecipe: IRecipeInterface = {
  id: 1,
  mealPlanId: 1,
  clientId: 24,
  mealTypeKey: ["lunch"],
  dateAdded: "2021-09-01T00:00:00.000Z",
  avoid: false,
  // Add the other missing properties here
  uri: "http://www.edamam.com/ontologies/edamam.owl#recipe_844e68c48aba460f812255fe2f38ca72",
  label: "Homemade Hummus",
  image:
    "https://edamam-product-images.s3.amazonaws.com/web-img/4a8/4a87e20f552772f871cfb4bdf81ef72e.jpg",
  images: {
    THUMBNAIL: {
      url: "https://edamam-product-images.s3.amazonaws.com/web-img/4a8/4a87e20f552772f871cfb4bdf81ef72e-s.jpg",
      width: 100,
      height: 100,
    },
    SMALL: {
      url: "https://edamam-product-images.s3.amazonaws.com/web-img/4a8/4a87e20f552772f871cfb4bdf81ef72e-m.jpg",
      width: 200,
      height: 200,
    },
    REGULAR: {
      url: "https://edamam-product-images.s3.amazonaws.com/web-img/4a8/4a87e20f552772f871cfb4bdf81ef72e.jpg",
      width: 300,
      height: 300,
    },
    LARGE: {
      url: "https://edamam-product-images.s3.amazonaws.com/web-img/4a8/4a87e20f552772f871cfb4bdf81ef72e-l.jpg",
      width: 600,
      height: 600,
    },
  },
  source: "Food52",
  url: "https://food52.com/recipes/37796-homemade-hummus",
  shareAs:
    "http://www.edamam.com/recipe/homemade-hummus-844e68c48aba460f812255fe2f38ca72/chic",
  yield: 4.0,
  dietLabels: ["High-Fiber", "Low-Sodium"],
  healthLabels: [
    "Sugar-Conscious",
    "Vegan",
    "Vegetarian",
    "Pescatarian",
    "Mediterranean",
    "DASH",
    "Dairy-Free",
    "Gluten-Free",
    "Wheat-Free",
    "Egg-Free",
    "Peanut-Free",
    "Tree-Nut-Free",
    "Soy-Free",
    "Fish-Free",
    "Shellfish-Free",
    "Pork-Free",
    "Red-Meat-Free",
    "Crustacean-Free",
    "Celery-Free",
    "Mustard-Free",
    "Lupine-Free",
    "Mollusk-Free",
    "Alcohol-Free",
    "No oil added",
    "Sulfite-Free",
    "Kosher",
    "Immuno-Supportive",
  ],
  cautions: ["Sulfites"],
  ingredientLines: [
    "250 grams Chic Peas",
    "1 clove of Garlic",
    "100 milliliters Tahini",
    "1 tablespoon Lemon Concentate",
    "1 pinch Salt",
  ],
  ingredients: [
    {
      text: "250 grams Chic Peas",
      quantity: 250.0,
      measure: "gram",
      food: "Peas",
      weight: 250.0,
      foodCategory: "vegetables",
      foodId: "food_bbi35jtbjt7un9bsa2m7eazlsk91",
      image:
        "https://www.edamam.com/food-img/5ed/5ed641d646c028598a90bdb9ece34fc8.jpg",
      recipeId: 1,
    },
    {
      text: "1 clove of Garlic",
      quantity: 1.0,
      measure: "clove",
      food: "Garlic",
      weight: 3.0,
      foodCategory: "vegetables",
      foodId: "food_avtcmx6bgjv1jvay6s6stan8dnyp",
      image:
        "https://www.edamam.com/food-img/6ee/6ee142951f48aaf94f4312409f8d133d.jpg",
      recipeId: 2,
    },
    {
      text: "100 milliliters Tahini",
      quantity: 100.0,
      measure: "milliliter",
      food: "Tahini",
      weight: 101.44206810724408,
      foodCategory: "plant-based protein",
      foodId: "food_aa88tarawf1yl0bu5w3csaucrnx2",
      image:
        "https://www.edamam.com/food-img/eed/eed4bb62c2763575b73a8f05963073fb.jpg",
      recipeId: 3,
    },
    {
      text: "1 tablespoon Lemon Concentate",
      quantity: 1.0,
      measure: "tablespoon",
      food: "Lemon",
      weight: 13.249999999775984,
      foodCategory: "fruit",
      foodId: "food_a6uzc62astrxcgbtzyq59b6fncrr",
      image:
        "https://www.edamam.com/food-img/70a/70acba3d4c734d7c70ef4efeed85dc8f.jpg",
      recipeId: 4,
    },
    {
      text: "1 pinch Salt",
      quantity: 1.0,
      measure: "pinch",
      food: "Salt",
      weight: 0.380208334,
      foodCategory: "Condiments and sauces",
      foodId: "food_btxz81db72hwbra2pncvebzzzum9",
      image:
        "https://www.edamam.com/food-img/694/6943ea510918c6025795e8dc6e6eaaeb.jpg",
      recipeId: 5,
    },
  ],
  calories: 814.3928052380373,
  totalCO2Emissions: 137.710306513772,
  co2EmissionsClass: "A",
  totalWeight: 368.07227644102005,
  totalTime: 0.0,
  cuisineType: ["mediterranean"],
  mealType: ["lunch/dinner"],
  dishType: ["condiments and sauces"],
  totalNutrients: {
    ENERC_KCAL: { label: "Energy", quantity: 814.3928052380373, unit: "kcal" },
    FAT: { label: "Fat", quantity: 55.63058264169664, unit: "g" },
    FASAT: { label: "Saturated", quantity: 7.823925228475392, unit: "g" },
    FATRN: { label: "Trans", quantity: 0.0, unit: "g" },
    FAMS: { label: "Monounsaturated", quantity: 20.682027325770523, unit: "g" },
    FAPU: { label: "Polyunsaturated", quantity: 24.427090573309403, unit: "g" },
    CHOCDF: { label: "Carbs", quantity: 59.73361843871487, unit: "g" },
    "CHOCDF.net": {
      label: "Carbohydrates (net)",
      quantity: 35.61550610474744,
      unit: "g",
    },
    FIBTG: { label: "Fiber", quantity: 24.118112333967428, unit: "g" },
    SUGAR: { label: "Sugars", quantity: 15.033316133719897, unit: "g" },
    PROCNT: { label: "Protein", quantity: 31.13170157822903, unit: "g" },
    CHOLE: { label: "Cholesterol", quantity: 0.0, unit: "mg" },
    NA: { label: "Sodium", quantity: 277.45421191532625, unit: "mg" },
    CA: { label: "Calcium", quantity: 503.6094601369615, unit: "mg" },
    MG: { label: "Magnesium", quantity: 180.68376678520394, unit: "mg" },
    K: { label: "Potassium", quantity: 1060.3155786304012, unit: "mg" },
    FE: { label: "Iron", quantity: 12.885819783099201, unit: "mg" },
    ZN: { label: "Zinc", quantity: 7.829753754888542, unit: "mg" },
    P: { label: "Phosphorus", quantity: 1019.2659385449908, unit: "mg" },
    VITA_RAE: { label: "Vitamin A", quantity: 98.17576204321509, unit: "µg" },
    VITC: { label: "Vitamin C", quantity: 107.95849999988128, unit: "mg" },
    THIA: { label: "Thiamin (B1)", quantity: 1.9138932309082881, unit: "mg" },
    RIBF: {
      label: "Riboflavin (B2)",
      quantity: 0.8157709821472197,
      unit: "mg",
    },
    NIA: { label: "Niacin (B3)", quantity: 10.787842711844577, unit: "mg" },
    VITB6A: { label: "Vitamin B6", quantity: 0.6214486814796145, unit: "mg" },
    FOLDFE: {
      label: "Folate equivalent (total)",
      quantity: 263.46072674507457,
      unit: "µg",
    },
    FOLFD: { label: "Folate (food)", quantity: 263.46072674507457, unit: "µg" },
    FOLAC: { label: "Folic acid", quantity: 0.0, unit: "µg" },
    VITB12: { label: "Vitamin B12", quantity: 0.0, unit: "µg" },
    VITD: { label: "Vitamin D", quantity: 0.0, unit: "µg" },
    TOCPHA: { label: "Vitamin E", quantity: 0.6008801702677743, unit: "mg" },
    VITK1: { label: "Vitamin K", quantity: 62.051, unit: "µg" },
    WATER: { label: "Water", quantity: 213.89524349373954, unit: "g" },
  },
  totalDaily: {
    ENERC_KCAL: { label: "Energy", quantity: 40.71964026190187, unit: "%" },
    FAT: { label: "Fat", quantity: 85.58551175645637, unit: "%" },
    FASAT: { label: "Saturated", quantity: 39.11962614237696, unit: "%" },
    CHOCDF: { label: "Carbs", quantity: 19.911206146238293, unit: "%" },
    FIBTG: { label: "Fiber", quantity: 96.47244933586971, unit: "%" },
    PROCNT: { label: "Protein", quantity: 62.26340315645806, unit: "%" },
    CHOLE: { label: "Cholesterol", quantity: 0.0, unit: "%" },
    NA: { label: "Sodium", quantity: 11.560592163138594, unit: "%" },
    CA: { label: "Calcium", quantity: 50.36094601369615, unit: "%" },
    MG: { label: "Magnesium", quantity: 43.01994447266761, unit: "%" },
    K: { label: "Potassium", quantity: 22.559905928306407, unit: "%" },
    FE: { label: "Iron", quantity: 71.58788768388445, unit: "%" },
    ZN: { label: "Zinc", quantity: 71.17957958989584, unit: "%" },
    P: { label: "Phosphorus", quantity: 145.60941979214155, unit: "%" },
    VITA_RAE: { label: "Vitamin A", quantity: 10.908418004801677, unit: "%" },
    VITC: { label: "Vitamin C", quantity: 119.95388888875698, unit: "%" },
    THIA: { label: "Thiamin (B1)", quantity: 159.4911025756907, unit: "%" },
    RIBF: { label: "Riboflavin (B2)", quantity: 62.75161401132459, unit: "%" },
    NIA: { label: "Niacin (B3)", quantity: 67.42401694902861, unit: "%" },
    VITB6A: { label: "Vitamin B6", quantity: 47.803744729201114, unit: "%" },
    FOLDFE: {
      label: "Folate equivalent (total)",
      quantity: 65.86518168626864,
      unit: "%",
    },
    VITB12: { label: "Vitamin B12", quantity: 0.0, unit: "%" },
    VITD: { label: "Vitamin D", quantity: 0.0, unit: "%" },
    TOCPHA: { label: "Vitamin E", quantity: 4.005867801785162, unit: "%" },
    VITK1: { label: "Vitamin K", quantity: 51.70916666666667, unit: "%" },
  },
  digest: [
    {
      label: "Fat",
      tag: "FAT",
      schemaOrgTag: "fatContent",
      total: 55.63058264169664,
      hasRDI: true,
      daily: 85.58551175645637,
      unit: "g",
    },
    {
      label: "Carbs",
      tag: "CHOCDF",
      schemaOrgTag: "carbohydrateContent",
      total: 59.73361843871487,
      hasRDI: true,
      daily: 19.911206146238293,
      unit: "g",
    },
    {
      label: "Protein",
      tag: "PROCNT",
      schemaOrgTag: "proteinContent",
      total: 31.13170157822903,
      hasRDI: true,
      daily: 62.26340315645806,
      unit: "g",
    },
    {
      label: "Cholesterol",
      tag: "CHOLE",
      schemaOrgTag: "cholesterolContent",
      total: 0.0,
      hasRDI: true,
      daily: 0.0,
      unit: "mg",
    },
    {
      label: "Sodium",
      tag: "NA",
      schemaOrgTag: "sodiumContent",
      total: 277.45421191532625,
      hasRDI: true,
      daily: 11.560592163138594,
      unit: "mg",
    },
  ],
};

export const tiers: Tier[] = [
  {
    name: "Basic Plan",
    id:
      process.env.NODE_ENV === "production"
        ? "price_1QfBDLBYYYaaMgOAoouhmzCC" // $19 actual price to use once fully tested price_1QemxVBYYYaaMgOALwA0dyzb
        : "price_1QfBDLBYYYaaMgOAoouhmzCC", // 0.19c change back to prod later
    href: "/register",
    price: "$19",
    description:
      "Ideal for individuals starting their journey towards a healthier lifestyle.",
    features: [
      "Personalized meal plans",
      "Access to basic recipes",
      "Nutritional tracking",
      "Email support",
    ],
    featured: false,
    active: false, // Active plan
    available: true,
  },
  {
    name: "Premium Plan",
    id: "tier-premium",
    href: "/register/premium",
    price: "$49",
    description:
      "Perfect for those who want a comprehensive meal planning experience.",
    features: [
      "All features of Basic Plan",
      "Advanced recipe options",
      "Customizable meal plans",
      "Priority support",
      "Weekly progress reports",
    ],
    featured: true,
    active: false, // Not active
    available: false,
  },
  {
    name: "Enterprise Plan",
    id: "tier-enterprise",
    href: "/register/enterprise",
    price: "Contact us",
    description: "Tailored solutions for organizations and businesses.",
    features: [
      "All features of Premium Plan",
      "Corporate wellness programs",
      "Dedicated account manager",
      "Custom meal plans for teams",
      "Detailed analytics and reports",
      "24/7 VIP support",
    ],
    featured: false,
    active: false, // Not active
    available: false,
  },
];

export const recipeUriFormat =
  "http://www.edamam.com/ontologies/edamam.owl#recipe_";
export const recipeUrlFormat = "https://api.edamam.com/api/recipes/v2/";
