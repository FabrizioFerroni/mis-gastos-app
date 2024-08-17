export interface Pagination {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
