export interface PaginationMeta {
    page: number;
    per_page: number;
    from: number;
    to: number;
    total?: number;
    last_page?: number;
}
