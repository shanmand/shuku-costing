/**
 * Utility functions for safe data handling in React/TypeScript applications.
 * Prevents common runtime errors like "Cannot read properties of undefined (reading 'map')".
 */

/**
 * Ensures that the input is always an array.
 * If the input is null or undefined, returns an empty array.
 * 
 * @param data - The data to check (array, null, or undefined)
 * @returns The original array or an empty array
 */
export function ensureArray<T>(data: T[] | null | undefined): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return [];
}

/**
 * Safely accesses a nested array property.
 * Example: safeGet(recipe, 'stages')
 * 
 * @param obj - The parent object
 * @param key - The key of the array property
 * @returns The array or an empty array
 */
export function safeGetArray<T, K extends keyof T>(obj: T | null | undefined, key: K): T[K] extends any[] ? T[K] : any[] {
  if (!obj || !obj[key] || !Array.isArray(obj[key])) {
    return [] as any;
  }
  return obj[key] as any;
}

/**
 * A functional approach to mapping that is safe against null/undefined.
 * 
 * @param data - The data to map
 * @param mapper - The mapping function
 * @returns The mapped array or an empty array
 */
export function safeMap<T, U>(
  data: T[] | null | undefined,
  mapper: (item: T, index: number) => U
): U[] {
  return ensureArray(data).map(mapper);
}
