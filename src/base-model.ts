import { PrismaClient, Prisma } from '@prisma/client';
import {
  QueryOptions,
  FindManyParams,
  AggregateParams,
  BatchUpdateParams,
  BatchDeleteParams,
  TransactionCallback
} from './types';

/**
 * Generic ORM abstraction layer
 * Provides common CRUD operations for any model
 */
export class BaseModel<T extends Record<string, any>> {
  protected client: PrismaClient;
  protected model: any;
  protected modelName: string;
  protected softDelete: boolean;

  /**
   * Create a new model instance
   * @param modelName - The name of the Prisma model
   * @param client - An optional Prisma client instance
   * @param options - Additional options for the model
   */
  constructor(
    modelName: string,
    client?: PrismaClient,
    options: { softDelete?: boolean } = {}
  ) {
    this.client = client || new PrismaClient();

    if (!this.client[modelName]) {
      throw new Error(`Model ${modelName} does not exist in Prisma schema`);
    }

    this.model = this.client[modelName];
    this.modelName = modelName;
    this.softDelete = options.softDelete || false;
  }

  /**
   * Find a record by its ID
   * @param id - The ID of the record
   * @param options - Additional options like select, include
   * @returns The found record
   */
  async findById(id: string | number, options: QueryOptions = {}): Promise<T | null> {
    const query: any = {
      where: { id }
    };

    // Handle soft delete
    if (this.softDelete) {
      query.where.deleted = false;
    }

    // Add select and include if provided
    if (options.select) query.select = options.select;
    if (options.include) query.include = options.include;

    return this.model.findFirst(query);
  }

  /**
   * Find first record matching the criteria
   * @param params - Query parameters
   * @returns The first matching record
   */
  async findFirst(params: FindManyParams = {}): Promise<T | null> {
    const { where = {}, ...restParams } = params;

    const query: any = {
      where,
      ...restParams
    };

    // Handle soft delete
    if (this.softDelete) {
      query.where.deleted = false;
    }

    return this.model.findFirst(query);
  }

  /**
   * Find many records with optional filtering
   * @param params - Filter, pagination, sorting parameters
   * @returns Array of records
   */
  async findMany(params: FindManyParams = {}): Promise<T[]> {
    const { where = {}, ...restParams } = params;

    const query: any = {
      where,
      ...restParams
    };

    // Handle soft delete
    if (this.softDelete) {
      query.where.deleted = false;
    }

    return this.model.findMany(query);
  }

  /**
   * Create a new record
   * @param data - The data for the new record
   * @returns The created record
   */
  async create(data: Partial<T>): Promise<T> {
    return this.model.create({ data });
  }

  /**
   * Create multiple records
   * @param data - Array of data for new records
   * @returns The created records
   */
  async createMany(data: Partial<T>[]): Promise<{ count: number }> {
    return this.model.createMany({ data });
  }

  /**
   * Update a record by its ID
   * @param id - The ID of the record to update
   * @param data - The data to update
   * @returns The updated record
   */
  async updateById(id: string | number, data: Partial<T>): Promise<T> {
    return this.model.update({
      where: { id },
      data
    });
  }

  /**
   * Update multiple records
   * @param params - Parameters for the batch update
   * @returns The number of updated records
   */
  async updateMany(params: BatchUpdateParams<T>): Promise<{ count: number }> {
    return this.model.updateMany(params);
  }

  /**
   * Delete a record by its ID
   * @param id - The ID of the record to delete
   * @returns The deleted record
   */
  async deleteById(id: string | number): Promise<T> {
    if (this.softDelete) {
      return this.model.update({
        where: { id },
        data: { deleted: true }
      });
    }

    return this.model.delete({
      where: { id }
    });
  }

  /**
   * Delete multiple records
   * @param params - Parameters for the batch delete
   * @returns The number of deleted records
   */
  async deleteMany(params: BatchDeleteParams): Promise<{ count: number }> {
    if (this.softDelete) {
      return this.model.updateMany({
        where: params.where,
        data: { deleted: true }
      });
    }

    return this.model.deleteMany(params);
  }

  /**
   * Count records with optional filtering
   * @param where - The filter conditions
   * @returns The count of records
   */
  async count(where: Record<string, any> = {}): Promise<number> {
    const query: any = { where };

    // Handle soft delete
    if (this.softDelete) {
      query.where.deleted = false;
    }

    return this.model.count(query);
  }

  /**
   * Perform aggregation operations
   * @param params - Aggregation parameters
   * @returns Result of the aggregation
   */
  async aggregate(params: AggregateParams): Promise<any> {
    const { where = {}, ...aggregations } = params;

    const query: any = { where };

    // Handle soft delete
    if (this.softDelete) {
      query.where.deleted = false;
    }

    // Add aggregation fields
    if (aggregations._count) query._count = aggregations._count;
    if (aggregations._avg) query._avg = aggregations._avg;
    if (aggregations._sum) query._sum = aggregations._sum;
    if (aggregations._min) query._min = aggregations._min;
    if (aggregations._max) query._max = aggregations._max;

    return this.model.aggregate(query);
  }

  /**
   * Execute a transaction with multiple operations
   * @param callback - Function containing transaction operations
   * @returns Result of the transaction
   */
  async transaction<R>(callback: TransactionCallback<R>): Promise<R> {
    return this.client.$transaction(async (tx: Prisma.TransactionClient) => {
      return callback(tx);
    });
  }

  /**
   * Get the Prisma client instance
   * @returns The Prisma client
   */
  getClient(): PrismaClient {
    return this.client;
  }

  /**
   * Get the raw model for performing operations not covered by the abstraction
   * @returns The Prisma model
   */
  getRawModel(): any {
    return this.model;
  }
}
