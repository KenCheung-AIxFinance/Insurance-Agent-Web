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

export enum RecordFileType {
    INSURANCE_NEEDS = 'INSURANCE_NEEDS',
    RETIREMENT_BUDGET = 'RETIREMENT_BUDGET',
    MEDICAL_EXPENSE = 'MEDICAL_EXPENSE',
}
/*
DocumentType = Literal[
    "protection_gap_analysis",      # 保障缺口分析
    "retirement_planning",          # 退休生活規劃
    "medical_reserve_analysis",     # 醫療儲備分析
    "third_party_calculator",       # 第三方計算器結果
    "bank_statement",               # 銀行對帳單
    "income_statement",             # 收入證明
    "other"                         # 其他類型
]
*/

export type RecordFile = {
    id: string;
    project_id: string;
    type: RecordFileType;
    name: string;
    data: any;
    raw_text?: string;
    created_at: string;
    updated_at: string;
};
