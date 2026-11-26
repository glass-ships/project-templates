export type SuccessResult<T> = readonly [T, null];
export type ErrorResult<E> = readonly [null, E];
/** `[data, null]` if the promise resolved, `[null, error]` if it rejected */
export type Result<T, E> = SuccessResult<T> | ErrorResult<E>;

/**
 * Awaits a promise and returns its result or error as a tuple, instead of throwing.
 *
 * @example
 * ```ts
 * const [data, error] = await tryCatch(request("/users"));
 * if (error) return showError(error);
 * ```
 */
export async function tryCatch<T, E = Error>(promise: Promise<T>): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return [data, null] as const;
  } catch (error) {
    return [null, error as E] as const;
  }
}
