// src/utils/pagination.ts

import { z } from "zod";

export function toPaginatedResponse<T>({
  items,
  totalCount,
  page,
  limit,
}: {
  items: T[];
  totalCount: number;
  page: number;
  limit: number;
}) {
  const totalPages = Math.ceil(totalCount / limit);
  return {
    pageInfo: {
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      totalCount,
    },
    items,
  };
}

export const paginationSchema = z.object({
  page: z.coerce.number().min(1),
  limit: z.coerce.number().min(1),
});

export const getQueryPagination = (query: z.infer<typeof paginationSchema>) => {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};
