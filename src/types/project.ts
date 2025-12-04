// Backend returns tags as simple string arrays
export type GlobalTagsResponse = {
    user_id: string;
    tags: string[];
};

export type CreateCaseInput = {
    title: string;
    client_name: string;
    summary: string;
    tags: string[]; // Array of tag names (strings)
    status?: 'draft' | 'in_progress' | 'completed' | 'archived';
};

export type Case = {
    case_id: string;
    title: string;
    client_name: string;
    created_by: string;
    created_at: string;
    updated_at: string;
    status: 'draft' | 'in_progress' | 'completed' | 'archived';
    tags: string[];
    summary: string;
    current_output_id: string | null;
    public_shareable_url: string | null;
};

// Legacy type alias for backward compatibility
export type Project = Case;
export type CreateProjectInput = CreateCaseInput;

// For UI display - keeping the Tag type for component props
export type Tag = {
    id: string;
    name: string;
    createdAt?: string;
};
