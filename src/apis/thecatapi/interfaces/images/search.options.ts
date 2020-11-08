export interface ImageSearchOptions {
    size?: 'full' | 'med' | 'small' | 'thumb';
    mime_types?: string[];
    order?: 'RANDOM' | 'ASC' | 'DESC';
    limit?: number;
    page?: number;
    category_ids?: string[];
    format?: 'json' | 'csv';
    breed_id?: string;
}
