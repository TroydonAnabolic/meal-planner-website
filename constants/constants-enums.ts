export enum ActivityLevel {
  Sedentary = "Sedentary",
  LightlyActive = "LightlyActive",
  Active = "Active",
  VeryActive = "VeryActive",
  HighlyActive = "HighlyActive",
}

export enum GenderType {
  Male = "Male",
  Female = "Female",
}

export enum HealthGoals {
  WeightLoss = "Weight Loss",
  MuscleGain = "Muscle Gain",
  FatLoss = "Fat Loss",
  GeneralHealth = "General Health",
  MaintainWeight = "Maintain Weight",
  // Add more health goals as needed
}

export enum UnitOfMeasure {
  Ounce = "Ounce",
  Gram = "Gram",
  Pound = "Pound",
  Kilogram = "Kilogram",
  Pinch = "Pinch",
  Liter = "Liter",
  FluidOunce = "FluidOunce",
  Gallon = "Gallon",
  Pint = "Pint",
  Quart = "Quart",
  Milliliter = "Milliliter",
  Drop = "Drop",
  Cup = "Cup",
  Tablespoon = "Tablespoon",
  Teaspoon = "Teaspoon",
  Unit = "<unit>",
  // Milligram = "Milligram",
  // Microgram = "Microgram",
  // Unit = "Unit", // for items like eggs, fruits, vegetables, etc.
  // Servings = "Servings", // for items like eggs, fruits, vegetables, etc.
}

/**
 * Extracts the measure key from the URL and maps it to the corresponding UnitOfMeasure enum.
 * @param measureUrl - The measure URL string.
 * @returns The corresponding UnitOfMeasure enum value or the original measure key if no match is found.
 */
export function getUnitOfMeasureFromUrl(
  measureUrl: string
): UnitOfMeasure | string {
  if (!measureUrl) return measureUrl;

  const fragment = measureUrl.split("#")[1];
  if (!fragment) return measureUrl;

  // Remove the 'Measure_' prefix
  const measureKey = fragment.replace("Measure_", "");

  // Convert to CamelCase to match enum keys
  const camelCaseKey = measureKey
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");

  // Check if the camelCaseKey exists in UnitOfMeasure enum
  if (camelCaseKey in UnitOfMeasure) {
    return UnitOfMeasure[camelCaseKey as keyof typeof UnitOfMeasure];
  }

  // If no matching enum key found, return the original measure key
  return measureKey;
}

export enum DayOfTheWeek {
  Sunday = "Sunday",
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
}

export enum UrlAction {
  // Search = "search",
  Add = "add",
  Edit = "edit",
  View = "view",
}

export enum MealNumber {
  Meal1 = "Breakfast",
  Meal2 = "Brunch",
  Meal3 = "Lunch",
  Meal4 = "Snack",
  Meal5 = "Teatime",
  Meal6 = "Dinner",
}

export const MealTimeRanges: Record<MealNumber, string> = {
  [MealNumber.Meal1]: "7:00 AM - 9:00 AM",
  [MealNumber.Meal2]: "9:00 AM - 12:00 PM",
  [MealNumber.Meal3]: "12:00 PM - 3:00 PM",
  [MealNumber.Meal4]: "3:00 PM - 5:00 PM",
  [MealNumber.Meal5]: "5:00 PM - 9:00 PM",
  [MealNumber.Meal6]: "9:00 PM - 11:00 PM",
};

export enum MealType {
  breakfast = "breakfast",
  brunch = "brunch",
  lunch = "lunch/dinner",
  dinner = "lunch/dinner",
  snack = "snack",
  teatime = "teatime",
}

export enum HealthLabels {
  fatFree = "fat-free",
  lowFatAbs = "low-fat-abs",
  sugarConscious = "sugar-conscious",
  lowSugar = "low-sugar",
  lowPotassium = "low-potassium",
  kidneyFriendly = "kidney-friendly",
  ketoFriendly = "keto-friendly",
  plantBased = "plant-based",
  vegan = "vegan",
  vegetarian = "vegetarian",
  pescatarian = "pescatarian",
  paleo = "paleo",
  specificCarbs = "specific-carbs",
  mediterranean = "Mediterranean",
  dash = "DASH",
  dairyFree = "dairy-free",
  glutenFree = "gluten-free",
  wheatFree = "wheat-free",
  eggFree = "egg-free",
  milkFree = "milk-free",
  peanutFree = "peanut-free",
  treeNutFree = "tree-nut-free",
  soyFree = "soy-free",
  fishFree = "fish-free",
  shellfishFree = "shellfish-free",
  porkFree = "pork-free",
  redMeatFree = "red-meat-free",
  crustaceanFree = "crustacean-free",
  celeryFree = "celery-free",
  mustardFree = "mustard-free",
  sesameFree = "sesame-free",
  lupineFree = "lupine-free",
  molluskFree = "mollusk-free",
  alcoholFree = "alcohol-free",
  noOilAdded = "no-oil-added",
  noSugarAdded = "no-sugar-added",
  sulfiteFree = "sulfite-free",
  fodmapFree = "fodmap-free",
  kosher = "kosher",
  alcoholCocktail = "alcohol-cocktail",
  immunoSupportive = "immuno-supportive",
}

export enum DietLabels {
  balanced = "balanced",
  highFiber = "high-fiber",
  highProtein = "high-protein",
  lowCarb = "low-carb",
  lowFat = "low-fat",
  lowSodium = "low-sodium",
}

export enum DishType {
  alcoholCocktail = "alcohol cocktail",
  biscuitsAndCookies = "biscuits and cookies",
  bread = "bread",
  cereals = "cereals",
  condimentsAndSauces = "condiments and sauces",
  desserts = "desserts",
  drinks = "drinks",
  egg = "egg",
  iceCreamAndCustard = "ice cream and custard",
  mainCourse = "main course",
  pancake = "pancake",
  pasta = "pasta",
  pastry = "pastry",
  piesAndTarts = "pies and tarts",
  pizza = "pizza",
  preps = "preps",
  preserve = "preserve",
  salad = "salad",
  sandwiches = "sandwiches",
  seafood = "seafood",
  sideDish = "side dish",
  soup = "soup",
  specialOccasions = "special occasions",
  starter = "starter",
  sweets = "sweets",
}

export enum CuisineType {
  american = "american",
  asian = "asian",
  british = "british",
  caribbean = "caribbean",
  centralEurope = "central europe",
  chinese = "chinese",
  easternEurope = "eastern europe",
  french = "french",
  greek = "greek",
  indian = "indian",
  italian = "italian",
  japanese = "japanese",
  korean = "korean",
  kosher = "kosher",
  mediterranean = "mediterranean",
  mexican = "mexican",
  middleEastern = "middle eastern",
  nordic = "nordic",
  southAmerican = "south american",
  southEastAsian = "south east asian",
  world = "world",
}

export enum AllergyLabels {
  gluten = "gluten",
  wheat = "wheat",
  eggs = "eggs",
  milk = "milk",
  peanuts = "peanuts",
  treeNuts = "tree-nuts",
  soy = "soy",
  fish = "fish",
  shellfish = "shellfish",
  sulfites = "sulfites",
  fodmap = "fodmap",
}

export enum Nutrients {
  /** Added sugar (g) */
  SUGAR_added = "SUGAR.added",

  /** Calcium, Ca (mg) */
  CA = "CA",

  /** Carbohydrate (net) (g) */
  CHOCDF_net = "CHOCDF.net",

  /** Carbohydrate, by difference (g) */
  CHOCDF = "CHOCDF",

  /** Cholesterol (mg) */
  CHOLE = "CHOLE",

  /** Energy (kcal) */
  ENERC_KCAL = "ENERC_KCAL",

  /** Fatty acids, total monounsaturated (g) */
  FAMS = "FAMS",

  /** Fatty acids, total polyunsaturated (g) */
  FAPU = "FAPU",

  /** Fatty acids, total saturated (g) */
  FASAT = "FASAT",

  /** Fatty acids, total trans (g) */
  FATRN = "FATRN",

  /** Fiber, total dietary (g) */
  FIBTG = "FIBTG",

  /** Folate, DFE (µg) */
  FOLDFE = "FOLDFE",

  /** Folate, food (µg) */
  FOLFD = "FOLFD",

  /** Folic acid (µg) */
  FOLAC = "FOLAC",

  /** Iron, Fe (mg) */
  FE = "FE",

  /** Magnesium (mg) */
  MG = "MG",

  /** Niacin (mg) */
  NIA = "NIA",

  /** Phosphorus, P (mg) */
  P = "P",

  /** Potassium, K (mg) */
  K = "K",

  /** Protein (g) */
  PROCNT = "PROCNT",

  /** Riboflavin (mg) */
  RIBF = "RIBF",

  /** Sodium, Na (mg) */
  NA = "NA",

  /** Sugar alcohols (g) */
  SUGAR_alcohol = "Sugar.alcohol",

  /** Sugars, total (g) */
  SUGAR = "SUGAR",

  /** Thiamin (mg) */
  THIA = "THIA",

  /** Total lipid (fat) (g) */
  FAT = "FAT",

  /** Vitamin A, RAE (µg) */
  VITA_RAE = "VITA_RAE",

  /** Vitamin B-12 (µg) */
  VITB12 = "VITB12",

  /** Vitamin B-6 (mg) */
  VITB6A = "VITB6A",

  /** Vitamin C, total ascorbic acid (mg) */
  VITC = "VITC",

  /** Vitamin D (D2 + D3) (µg) */
  VITD = "VITD",

  /** Vitamin E (alpha-tocopherol) (mg) */
  TOCPHA = "TOCPHA",

  /** Vitamin K (phylloquinone) (µg) */
  VITK1 = "VITK1",

  /** Water (g) */
  WATER = "WATER",

  /** Zinc, Zn (mg) */
  ZN = "ZN",
}

export const mealToDishMapping: Record<MealNumber, DishType[]> = {
  [MealNumber.Meal1]: [
    DishType.bread,
    DishType.biscuitsAndCookies,
    DishType.cereals,
    DishType.egg,
  ], // Breakfast at 8:00 AM
  [MealNumber.Meal2]: [DishType.pancake, DishType.pastry], // Brunch at 10:30 AM
  [MealNumber.Meal3]: [DishType.mainCourse, DishType.salad, DishType.seafood], // Lunch at 1:00 PM
  [MealNumber.Meal4]: [
    DishType.desserts,
    DishType.soup,
    DishType.drinks,
    DishType.egg,
  ], // Snack at 4:00 PM
  [MealNumber.Meal5]: [DishType.sandwiches, DishType.salad, DishType.starter], // Teatime at 5:30 PM
  [MealNumber.Meal6]: [DishType.mainCourse, DishType.salad, DishType.seafood], // Dinner at 8:00 PM
};

// Function to get DishTypes for a given MealType
export const getDishTypesForMealType = (
  mealType: MealNumber | undefined
): DishType[] => {
  return mealType ? mealToDishMapping[mealType] || [] : [];
};

export enum MicroNutrients {
  sugar = "SUGAR",
  sugarAdded = "SUGAR.added",
  sugarAlcohol = "Sugar.alcohol",
  cholesterol = "CHOLE",
}

// Function to get unit of measure from string value
// export function getUnitOfMeasureFromString(
//   value: string
// ): UnitOfMeasure | undefined {
//   return Object.values(UnitOfMeasure).find((unit) => unit === value);
// }

export function getMeasureDescriptionFromString(
  value: string
): string | undefined {
  switch (value?.toLowerCase()) {
    case "ounce":
      return "http://www.edamam.com/ontologies/edamam.owl#Measure_ounce";
    case "gram":
      return "http://www.edamam.com/ontologies/edamam.owl#Measure_gram";
    case "pound":
      return "http://www.edamam.com/ontologies/edamam.owl#Measure_pound";
    case "kilogram":
      return "http://www.edamam.com/ontologies/edamam.owl#Measure_kilogram";
    case "pinch":
      return "http://www.edamam.com/ontologies/edamam.owl#Measure_pinch";
    case "liter":
      return "http://www.edamam.com/ontologies/edamam.owl#Measure_liter";
    case "fluidounce":
      return "http://www.edamam.com/ontologies/edamam.owl#Measure_fluid_ounce";
    case "gallon":
      return "http://www.edamam.com/ontologies/edamam.owl#Measure_gallon";
    case "pint":
      return "http://www.edamam.com/ontologies/edamam.owl#Measure_pint";
    case "quart":
      return "http://www.edamam.com/ontologies/edamam.owl#Measure_quart";
    case "milliliter":
      return "http://www.edamam.com/ontologies/edamam.owl#Measure_milliliter";
    case "drop":
      return "http://www.edamam.com/ontologies/edamam.owl#Measure_drop";
    case "cup":
      return "http://www.edamam.com/ontologies/edamam.owl#Measure_cup";
    case "tablespoon":
      return "http://www.edamam.com/ontologies/edamam.owl#Measure_tablespoon";
    case "teaspoon":
      return "http://www.edamam.com/ontologies/edamam.owl#Measure_teaspoon";
    case "<unit>":
      return "http://www.edamam.com/ontologies/edamam.owl#Measure_unit";
    default:
      return undefined;
  }
}

export function getMeasureDescription(
  measure: UnitOfMeasure
): string | undefined {
  switch (measure) {
    case UnitOfMeasure.Ounce:
      return "http://www.edamam.com/ontologies/edamam.owl#Measure_ounce";
    case UnitOfMeasure.Gram:
      return "http://www.edamam.com/ontologies/edamam.owl#Measure_gram";
    case UnitOfMeasure.Pound:
      return "http://www.edamam.com/ontologies/edamam.owl#Measure_pound";
    case UnitOfMeasure.Kilogram:
      return "http://www.edamam.com/ontologies/edamam.owl#Measure_kilogram";
    case UnitOfMeasure.Pinch:
      return "http://www.edamam.com/ontologies/edamam.owl#Measure_pinch";
    case UnitOfMeasure.Liter:
      return "http://www.edamam.com/ontologies/edamam.owl#Measure_liter";
    case UnitOfMeasure.FluidOunce:
      return "http://www.edamam.com/ontologies/edamam.owl#Measure_fluid_ounce";
    case UnitOfMeasure.Gallon:
      return "http://www.edamam.com/ontologies/edamam.owl#Measure_gallon";
    case UnitOfMeasure.Pint:
      return "http://www.edamam.com/ontologies/edamam.owl#Measure_pint";
    case UnitOfMeasure.Quart:
      return "http://www.edamam.com/ontologies/edamam.owl#Measure_quart";
    case UnitOfMeasure.Milliliter:
      return "http://www.edamam.com/ontologies/edamam.owl#Measure_milliliter";
    case UnitOfMeasure.Drop:
      return "http://www.edamam.com/ontologies/edamam.owl#Measure_drop";
    case UnitOfMeasure.Cup:
      return "http://www.edamam.com/ontologies/edamam.owl#Measure_cup";
    case UnitOfMeasure.Tablespoon:
      return "http://www.edamam.com/ontologies/edamam.owl#Measure_tablespoon";
    case UnitOfMeasure.Teaspoon:
      return "http://www.edamam.com/ontologies/edamam.owl#Measure_teaspoon";
    case UnitOfMeasure.Unit:
      return "http://www.edamam.com/ontologies/edamam.owl#Measure_unit";
    default:
      return undefined;
  }
}

// Enum for BudgetConstraint frequency options
export enum Frequency {
  Daily = "Daily",
  Weekly = "Weekly",
  Monthly = "Monthly",
  Yearly = "Yearly",
}

export enum CookingSkills {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
}

export enum Countries {
  AF = "Afghanistan",
  AX = "Åland Islands",
  AL = "Albania",
  DZ = "Algeria",
  AS = "American Samoa",
  AD = "Andorra",
  AO = "Angola",
  AI = "Anguilla",
  AQ = "Antarctica",
  AG = "Antigua and Barbuda",
  AR = "Argentina",
  AM = "Armenia",
  AW = "Aruba",
  AU = "Australia",
  AT = "Austria",
  AZ = "Azerbaijan",
  BS = "Bahamas",
  BH = "Bahrain",
  BD = "Bangladesh",
  BB = "Barbados",
  BY = "Belarus",
  BE = "Belgium",
  BZ = "Belize",
  BJ = "Benin",
  BM = "Bermuda",
  BT = "Bhutan",
  BO = "Bolivia",
  BQ = "Bonaire, Sint Eustatius and Saba",
  BA = "Bosnia and Herzegovina",
  BW = "Botswana",
  BV = "Bouvet Island",
  BR = "Brazil",
  IO = "British Indian Ocean Territory",
  BN = "Brunei Darussalam",
  BG = "Bulgaria",
  BF = "Burkina Faso",
  BI = "Burundi",
  CV = "Cabo Verde",
  KH = "Cambodia",
  CM = "Cameroon",
  CA = "Canada",
  KY = "Cayman Islands",
  CF = "Central African Republic",
  TD = "Chad",
  CL = "Chile",
  CN = "China",
  CX = "Christmas Island",
  CC = "Cocos (Keeling) Islands",
  CO = "Colombia",
  KM = "Comoros",
  CG = "Congo",
  CD = "Congo, Democratic Republic of the",
  CK = "Cook Islands",
  CR = "Costa Rica",
  CI = "Côte d'Ivoire",
  HR = "Croatia",
  CU = "Cuba",
  CW = "Curaçao",
  CY = "Cyprus",
  CZ = "Czech Republic",
  DK = "Denmark",
  DJ = "Djibouti",
  DM = "Dominica",
  DO = "Dominican Republic",
  EC = "Ecuador",
  EG = "Egypt",
  SV = "El Salvador",
  GQ = "Equatorial Guinea",
  ER = "Eritrea",
  EE = "Estonia",
  ET = "Ethiopia",
  FK = "Falkland Islands (Malvinas)",
  FO = "Faroe Islands",
  FJ = "Fiji",
  FI = "Finland",
  FR = "France",
  GF = "French Guiana",
  PF = "French Polynesia",
  TF = "French Southern Territories",
  GA = "Gabon",
  GM = "Gambia",
  GE = "Georgia",
  DE = "Germany",
  GH = "Ghana",
  GI = "Gibraltar",
  GR = "Greece",
  GL = "Greenland",
  GD = "Grenada",
  GP = "Guadeloupe",
  GU = "Guam",
  GT = "Guatemala",
  GG = "Guernsey",
  GN = "Guinea",
  GW = "Guinea-Bissau",
  GY = "Guyana",
  HT = "Haiti",
  HM = "Heard Island and McDonald Islands",
  VA = "Holy See",
  HN = "Honduras",
  HK = "Hong Kong",
  HU = "Hungary",
  IS = "Iceland",
  IN = "India",
  ID = "Indonesia",
  IR = "Iran, Islamic Republic of",
  IQ = "Iraq",
  IE = "Ireland",
  IM = "Isle of Man",
  IL = "Israel",
  IT = "Italy",
  JM = "Jamaica",
  JP = "Japan",
  JE = "Jersey",
  JO = "Jordan",
  KZ = "Kazakhstan",
  KE = "Kenya",
  KI = "Kiribati",
  KP = "Korea, Democratic People's Republic of",
  KR = "Korea, Republic of",
  KW = "Kuwait",
  KG = "Kyrgyzstan",
  LA = "Lao People's Democratic Republic",
  LV = "Latvia",
  LB = "Lebanon",
  LS = "Lesotho",
  LR = "Liberia",
  LY = "Libya",
  LI = "Liechtenstein",
  LT = "Lithuania",
  LU = "Luxembourg",
  MO = "Macao",
  MK = "Macedonia, the former Yugoslav Republic of",
  MG = "Madagascar",
  MW = "Malawi",
  MY = "Malaysia",
  MV = "Maldives",
  ML = "Mali",
  MT = "Malta",
  MH = "Marshall Islands",
  MQ = "Martinique",
  MR = "Mauritania",
  MU = "Mauritius",
  YT = "Mayotte",
  MX = "Mexico",
  FM = "Micronesia, Federated States of",
  MD = "Moldova, Republic of",
  MC = "Monaco",
  MN = "Mongolia",
  ME = "Montenegro",
  MS = "Montserrat",
  MA = "Morocco",
  MZ = "Mozambique",
  MM = "Myanmar",
  NA = "Namibia",
  NR = "Nauru",
  NP = "Nepal",
  NL = "Netherlands",
  NC = "New Caledonia",
  NZ = "New Zealand",
  NI = "Nicaragua",
  NE = "Niger",
  NG = "Nigeria",
  NU = "Niue",
  NF = "Norfolk Island",
  MP = "Northern Mariana Islands",
  NO = "Norway",
  OM = "Oman",
  PK = "Pakistan",
  PW = "Palau",
  PS = "Palestine, State of",
  PA = "Panama",
  PG = "Papua New Guinea",
  PY = "Paraguay",
  PE = "Peru",
  PH = "Philippines",
  PN = "Pitcairn",
  PL = "Poland",
  PT = "Portugal",
  PR = "Puerto Rico",
  QA = "Qatar",
  RE = "Réunion",
  RO = "Romania",
  RU = "Russian Federation",
  RW = "Rwanda",
  BL = "Saint Barthélemy",
  SH = "Saint Helena, Ascension and Tristan da Cunha",
  KN = "Saint Kitts and Nevis",
  LC = "Saint Lucia",
  MF = "Saint Martin (French part)",
  PM = "Saint Pierre and Miquelon",
  VC = "Saint Vincent and the Grenadines",
  WS = "Samoa",
  SM = "San Marino",
  ST = "Sao Tome and Principe",
  SA = "Saudi Arabia",
  SN = "Senegal",
  RS = "Serbia",
  SC = "Seychelles",
  SL = "Sierra Leone",
  SG = "Singapore",
  SX = "Sint Maarten (Dutch part)",
  SK = "Slovakia",
  SI = "Slovenia",
  SB = "Solomon Islands",
  SO = "Somalia",
  ZA = "South Africa",
  GS = "South Georgia and the South Sandwich Islands",
  SS = "South Sudan",
  ES = "Spain",
  LK = "Sri Lanka",
  SD = "Sudan",
  SR = "Suriname",
  SJ = "Svalbard and Jan Mayen",
  SZ = "Swaziland",
  SE = "Sweden",
  CH = "Switzerland",
  SY = "Syrian Arab Republic",
  TW = "Taiwan, Province of China",
  TJ = "Tajikistan",
  TZ = "Tanzania, United Republic of",
  TH = "Thailand",
  TL = "Timor-Leste",
  TG = "Togo",
  TK = "Tokelau",
  TO = "Tonga",
  TT = "Trinidad and Tobago",
  TN = "Tunisia",
  TR = "Turkey",
  TM = "Turkmenistan",
  TC = "Turks and Caicos Islands",
  TV = "Tuvalu",
  UG = "Uganda",
  UA = "Ukraine",
  AE = "United Arab Emirates",
  GB = "United Kingdom",
  US = "United States",
  UM = "United States Minor Outlying Islands",
  UY = "Uruguay",
  UZ = "Uzbekistan",
  VU = "Vanuatu",
  VE = "Venezuela, Bolivarian Republic of",
  VN = "Viet Nam",
  VG = "Virgin Islands, British",
  VI = "Virgin Islands, U.S.",
  WF = "Wallis and Futuna",
  EH = "Western Sahara",
  YE = "Yemen",
  ZM = "Zambia",
  ZW = "Zimbabwe",
}
