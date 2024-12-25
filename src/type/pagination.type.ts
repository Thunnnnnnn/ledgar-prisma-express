export interface Pagination {
    skip: number | undefined;
    take: number | undefined;
    page: number;
    itemsPerPage: number;
  }