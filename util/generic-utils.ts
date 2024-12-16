import { UnitOfMeasure } from "@/constants/constants-enums";

/**
 * Toggles the selection of an item in an array.
 *
 * @param array - The current array of selected items.
 * @param value - The item to toggle.
 * @returns A new array with the item toggled.
 */
export const toggleSelectionGeneric = <T extends string>(
  array: T[],
  value: T
): T[] => {
  if (array.includes(value)) {
    return array.filter((item) => item !== value);
  } else {
    return [...array, value];
  }
};

/**
 * Debounce function to limit the rate of API calls.
 * @param func The function to debounce.
 * @param wait The debounce delay in milliseconds.
 * @returns The debounced function.
 */
export function debounce<Func extends (...args: any[]) => void>(
  func: Func,
  wait: number
) {
  let timeout: NodeJS.Timeout;
  const debounced = (...args: Parameters<Func>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
  debounced.cancel = () => clearTimeout(timeout);
  return debounced;
}

/**
 * Converts a data URL to a Blob.
 *
 * @param dataurl - The data URL to convert.
 * @returns A Blob representing the binary data.
 */
// utils/dataURLtoBlob.ts

export const dataURLtoBlob = (dataurl: string): Blob | undefined => {
  try {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1];
    if (!mime) return undefined;
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  } catch (error) {
    console.error("Error converting dataURL to Blob:", error);
    return undefined;
  }
};

/**
 * Conversion factors from each UnitOfMeasure to grams.
 * Add more units and their corresponding factors as needed.
 */
const unitToGramMap: Record<UnitOfMeasure, number> = {
  [UnitOfMeasure.Unit]: 1, // 1 Unit = 1 gram
  [UnitOfMeasure.Ounce]: 28.3495, // 1 Ounce = 28.3495 grams
  [UnitOfMeasure.Gram]: 1, // 1 Gram = 1 gram
  [UnitOfMeasure.Pound]: 453.592, // 1 Pound = 453.592 grams
  [UnitOfMeasure.Kilogram]: 1000, // 1 Kilogram = 1000 grams
  [UnitOfMeasure.Pinch]: 0.36, // Estimated: 1 Pinch ≈ 0.36 grams
  [UnitOfMeasure.Liter]: 1000, // Assuming density similar to water: 1 Liter = 1000 grams
  [UnitOfMeasure.FluidOunce]: 29.5735, // 1 Fluid Ounce ≈ 29.5735 grams (assuming water)
  [UnitOfMeasure.Gallon]: 3785.41, // 1 Gallon ≈ 3785.41 grams (assuming water)
  [UnitOfMeasure.Pint]: 473.176, // 1 Pint ≈ 473.176 grams (assuming water)
  [UnitOfMeasure.Quart]: 946.353, // 1 Quart ≈ 946.353 grams (assuming water)
  [UnitOfMeasure.Milliliter]: 1, // Assuming density similar to water: 1 Milliliter = 1 gram
  [UnitOfMeasure.Drop]: 0.05, // Estimated: 1 Drop ≈ 0.05 grams
  [UnitOfMeasure.Cup]: 240, // 1 Cup ≈ 240 grams (depending on ingredient)
  [UnitOfMeasure.Tablespoon]: 15, // 1 Tablespoon ≈ 15 grams
  [UnitOfMeasure.Teaspoon]: 5, // 1 Teaspoon ≈ 5 grams
};

/**
 * Converts a given weight from the specified unit to grams.
 * @param unit The unit of measure.
 * @param value The weight value to convert.
 * @returns The weight in grams.
 */
export const convertToGrams = (unit: UnitOfMeasure, value: number): number => {
  const factor = unitToGramMap[unit];
  if (!factor) {
    console.warn(
      `No conversion factor found for unit: ${unit}. Defaulting to 0 grams.`
    );
    return 0;
  }
  return value * factor;
};

/**
 * Transforms a string by converting all characters to uppercase
 * and replacing hyphens with underscores.
 * @param label The string to transform.
 * @returns The transformed string.
 */
export const transformLabel = (label: string): string =>
  label.toUpperCase().replace(/-/g, "_");
