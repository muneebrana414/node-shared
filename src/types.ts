/**
 * Common types for the ORM toolkit
 */

// Generic type for query options
export interface QueryOptions {
  select?: Record<string, boolean>;
  include?: Record<string, boolean | object>;
}

// Interface for findMany parameters
export interface FindManyParams extends QueryOptions {
  where?: Record<string, any>;
  orderBy?: Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>;
  skip?: number;
  take?: number;
  cursor?: Record<string, any>;
  distinct?: string[];
}

// Interface for aggregate parameters
export interface AggregateParams {
  where?: Record<string, any>;
  _count?: boolean | Record<string, boolean>;
  _avg?: Record<string, boolean>;
  _sum?: Record<string, boolean>;
  _min?: Record<string, boolean>;
  _max?: Record<string, boolean>;
}

// Interface for update operations
export interface BatchUpdateParams<T> {
  where: Record<string, any>;
  data: Partial<T>;
}

// Interface for delete operations
export interface BatchDeleteParams {
  where: Record<string, any>;
}

// Interface for transaction callback
export type TransactionCallback<R> = (txClient: any) => Promise<R>;

// Model options for when models are defined
export interface ModelOptions {
  modelName?: string;
  softDelete?: boolean;
  timestamps?: boolean;
}
