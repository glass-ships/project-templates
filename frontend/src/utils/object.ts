import merge from "lodash/merge";

/** object with id field */
export type Obj = { id?: string };

/** merge two arrays of objects by id */
export const mergeArrays = (
  arrayA: Obj[],
  arrayB: Obj[],
  /** only include entries that are in array A */
  exclusive = false,
): Obj[] => {
  /** store to keep id-deduped list of entries, in insertion order */
  const result = new Map<string | Obj, Obj>();

  /** merge func */
  const mergeWithResult =
    (add = true) =>
    (object: Obj) => {
      /** entries without an id are keyed by themselves, so each stays separate */
      const key = object.id ?? object;
      /** if add flag true, or entry already in store, add to store */
      if (add || result.has(key))
        /** deep merge array entry with store entry using lodash */
        result.set(key, merge(result.get(key) || {}, object));
    };

  /** run merge func for each array */
  arrayA.forEach(mergeWithResult(true));
  arrayB.forEach(mergeWithResult(!exclusive));

  /** convert store back to array */
  return [...result.values()];
};

/** rename key in object in place */
export const renameKey = (object: { [key: string]: unknown }, oldKey: string, newKey: string): void => {
  if (oldKey in object) {
    object[newKey] = object[oldKey];
    delete object[oldKey];
  }
};

/** safe json stringify */
export const stringify = (value: unknown, space = 0) => {
  try {
    if (value === undefined || value === null) return "";
    else return JSON.stringify(value, null, space);
  } catch (error) {
    console.warn(`Invalid JSON stringify for ${{ value }}`);
    console.debug({ error });
    return "";
  }
};

/** safe json parse */
export const parse = <Type>(value: string, defaultValue: Type) => {
  try {
    return JSON.parse(value) as Type;
  } catch (error) {
    console.warn(`Invalid JSON parse for ${{ value }}`);
    console.debug({ error });
    return defaultValue;
  }
};

// function to ensure that argument is not null or undefined
export function ensure<T>(argument: T | undefined | null, message: string = "This value was promised to be there."): T {
  if (argument === undefined || argument === null) {
    throw new TypeError(message);
  }
  return argument;
}
