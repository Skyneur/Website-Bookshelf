export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Calcule les valeurs pour la pagination
 */
export function getPaginationParams(options: PaginationOptions): { limit: number; offset: number } {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const offset = (page - 1) * limit;
  
  return { limit, offset };
}

/**
 * Formate un résultat en résultat paginé
 */
export function formatPaginatedResult<T>(
  data: T[], 
  total: number, 
  options: PaginationOptions
): PaginatedResult<T> {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const pages = Math.ceil(total / limit);
  
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      pages,
      hasNext: page < pages,
      hasPrev: page > 1
    }
  };
}