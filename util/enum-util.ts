export function getEnumKeyByValue<T extends Record<string, string | number>>(
  enumObj: T,
  value: T[keyof T]
): keyof T | undefined {
  const entries = Object.entries(enumObj) as [keyof T, T[keyof T]][];
  const entry = entries.find(([key, val]) => val === value);
  return entry ? entry[0] : undefined;
}

// utils/reverseEnumMapping.ts

/**
 * Reverse maps multiple values of an enum to their corresponding keys.
 *
 * @param enumObj - The enum object to reverse map.
 * @param values - An array of values for which to find the corresponding keys.
 * @returns An array of keys corresponding to the provided values.
 */
export function getEnumKeysByValues<
  T extends { [key: string]: string | number },
  V extends T[keyof T]
>(enumObj: T, values: V[]): Array<keyof T> {
  return values
    .map((value) => getEnumKeyByValue(enumObj, value))
    .filter((key): key is keyof T => key !== undefined);
}
