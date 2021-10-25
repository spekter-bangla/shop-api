interface PageInfo {
  page: number;
  limit: number;
}

export interface PaginationResult<T> {
  result: T[];
  totalResult: number;
  totalPage: number;
  previous: PageInfo | null;
  current: PageInfo;
  next: PageInfo | null;
}

export const addPagination = (
  page: number | string = 1,
  limit: number | string = 80,
) => {
  if (typeof page === "string") {
    page = parseInt(page);
  }
  if (typeof limit === "string") {
    limit = parseInt(limit);
  }
  if (page < 1) {
    page = 1;
  }

  if (limit < 1 || limit > 80) {
    limit = 80;
  }

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  return [
    {
      $facet: {
        metadata: [{ $count: "total" }],
        result: [{ $skip: startIndex }, { $limit: limit }],
      },
    },
    {
      $project: {
        result: 1,
        totalResult: {
          $ifNull: [{ $arrayElemAt: ["$metadata.total", 0] }, 0],
        },
        totalPage: {
          $ceil: {
            $divide: [
              {
                $ifNull: [{ $arrayElemAt: ["$metadata.total", 0] }, 0],
              },
              limit,
            ],
          },
        },
        previous:
          startIndex > 0
            ? {
                page: { $literal: page - 1 },
                limit: { $literal: limit },
              }
            : undefined,
        current: {
          page: { $literal: page },
          limit: { $literal: limit },
        },
        next: {
          $cond: {
            if: {
              $lt: [
                endIndex,
                {
                  $arrayElemAt: ["$metadata.total", 0],
                },
              ],
            },
            then: {
              page: { $literal: page + 1 },
              limit: { $literal: limit },
            },
            else: undefined,
          },
        },
      },
    },
  ];
};
