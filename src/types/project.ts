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
    created_by?: string;
    pinned?: boolean;
};

export type CaseBase = {
    title: string;
    client_name: string;
    created_by: string;
    status: 'draft' | 'in_progress' | 'completed' | 'archived';
    tags: string[];
    summary: string;
    current_output_id: string | null;
    public_shareable_url: string | null;
    pinned: boolean;
};

// Define the Case type by extending CaseBase with the necessary fields
export type Case = CaseBase & {
    case_id: string;
    user_id: string;
    created_at: string;
    updated_at: string;
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
