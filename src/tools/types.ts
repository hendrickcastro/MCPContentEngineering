// Base types following MCPQL patterns
export type ToolSuccessResult<T> = { success: true; data: T; };
export type ToolErrorResult = { success: false; error: string; };
export type ToolResult<T> = ToolSuccessResult<T> | ToolErrorResult;

// Content source types
export interface ContentSource {
  id: string;
  path: string;
  type: 'file' | 'directory';
  size_bytes: number;
  last_modified: string;
  indexed_at: string;
  chunk_count: number;
  metadata?: Record<string, any>;
}

// Content chunk for indexing
export interface ContentChunk {
  id: string;
  content: string;
  file_path: string;
  chunk_index: number;
  start_line: number;
  end_line: number;
  metadata: {
    title?: string;
    headings: string[];
    tags: string[];
    front_matter?: Record<string, any>;
  };
}

// Search result types
export interface SearchResult {
  content_id: string;
  file_path: string;
  title: string;
  excerpt: string;
  relevance_score: number;
  match_type: 'exact' | 'partial' | 'semantic';
  highlighted_text?: string;
  metadata: Record<string, any>;
  chunk_index: number;
}

// Configuration interfaces
export interface ContentConfig {
  source_type: 'file' | 'directory';
  source_path: string;
  file_extensions: string[];
  excluded_patterns: string[];
  max_file_size_mb: number;
  max_index_size_mb: number;
  chunk_size: number;
  chunk_overlap: number;
  enable_semantic_search: boolean;
  index_refresh_interval: number;
}

// Rule and pattern types
export interface RulePattern {
  id: string;
  title: string;
  category: string;
  type: 'business-rule' | 'design-pattern' | 'coding-standard' | 'process';
  description: string;
  content: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  examples: string[];
  related_rules: string[];
  source_file: string;
  last_updated: string;
}

// Statistics and analytics types
export interface ContentStats {
  overview: {
    total_files: number;
    total_chunks: number;
    total_size_bytes: number;
    unique_authors: number;
    content_languages: string[];
    last_update: string;
  };
  content_breakdown: {
    by_type: Record<string, number>;
    by_category: Record<string, number>;
    by_size_range: Record<string, number>;
    by_age: Record<string, number>;
  };
  quality_metrics: {
    average_chunk_size: number;
    metadata_completeness: number;
    link_validity: number;
    content_freshness_score: number;
  };
}

// Error types
export interface ContentError {
  file_path: string;
  error_message: string;
  error_type: 'READ_ERROR' | 'PARSE_ERROR' | 'INDEX_ERROR' | 'VALIDATION_ERROR';
  timestamp: string;
}
