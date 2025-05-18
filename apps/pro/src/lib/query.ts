import type { UseQueryResult, UseMutationOptions } from "@tanstack/react-query";

export type ExtractQueryData<T extends () => UseQueryResult<unknown, unknown>> =
  ReturnType<T> extends UseQueryResult<infer Data, unknown> ? Data : never;

export type ExtractMutationArgs<T> = T extends (...args: infer A) => unknown // 1. On infère la liste des args
  ? A extends [infer First, ...unknown[]] // 2. Doit exister un premier élément
    ? First
    : never
  : never;

export type ExtractMutationJSONResponse<T> = T extends (
  ...args: infer A
) => Promise<infer R>
  ? R extends { json: () => Promise<infer J> }
    ? J
    : never
  : never;

export type ApiMutationOptions<TApi> = Omit<
  UseMutationOptions<
    ExtractMutationJSONResponse<TApi>,
    Error,
    ExtractMutationArgs<TApi>,
    unknown
  >,
  "mutationFn"
>;
export function useApiMutation<TApi>(
  fn: TApi,
  options?: ApiMutationOptions<TApi>
) {
  return useApiMutation({
    mutationFn: async (data: ExtractMutationArgs<TApi>) => {
      // Add type assertion since fn is unknown
      const typedFn = fn as (
        data: ExtractMutationArgs<TApi>
      ) => Promise<Response>;
      const response = await typedFn(data);
      if (!response.ok) {
        throw new Error("An error occurred");
      }
      return response.json();
    },
    ...(options || {}),
  });
}
