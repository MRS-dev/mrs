import { UseQueryResult } from "@tanstack/react-query";

type MrsQueryProps<T> = {
  Loading?: React.ReactNode;
  Error?: React.ReactNode;
  Empty?: React.ReactNode;
  Data?: React.ReactNode;
  query: UseQueryResult<T, unknown>;
};

export const MrsQuery = <T,>({
  Loading = null,
  Error = null,
  Empty = null,
  Data = null,
  query,
}: MrsQueryProps<T>) => {
  // 1) Loading
  if (query.isLoading) {
    return <>{Loading}</>;
  }

  // 2) Error
  if (query.error) {
    return <>{Error}</>;
  }

  const data = query.data;

  // 3) Empty (prend le pas si data est undefined/null, OU si c'est un array vide)
  const isEmptyArray = Array.isArray(data) && data.length === 0;
  if (data == null || isEmptyArray) {
    return <>{Empty}</>;
  }

  // 4) Data existante (non-array ou array non-vide)
  return <>{Data}</>;
};
