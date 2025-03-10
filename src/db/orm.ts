import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// Generic type for query options
export interface QueryOptions {
  select?: Record<string, boolean>;
  include?: Record<string, boolean | object>;
}

// Interface for findMany parameters
export interface FindManyParams extends QueryOptions {
  where?: Record<string, any>;
  orderBy?: Record<string, 'asc' | 'desc'>;
  skip?: number;
  take?: number;
}

/**
 * Generic ORM abstraction layer
 * Provides common CRUD operations for any model
 */
export class BaseModel<T> {
  protected model: any;
  protected modelName: string;

  constructor(modelName: string) {
    if (!prisma[modelName]) {
      throw new Error(`Model ${modelName} does not exist in Prisma schema`);
    }
    this.model = prisma[modelName];
    this.modelName = modelName;
  }

  /**
   * Find a record by its ID
   * @param id - The ID of the record
   * @param options - Additional options like select, include
   * @returns The found record
   */
  async findById(id: string | number, options: QueryOptions = {}): Promise<T | null> {
    return this.model.findUnique({
      where: { id },
      ...options
    });
  }

  /**
   * Find many records with optional filtering
   * @param params - Filter, pagination, sorting parameters
   * @returns Array of records
   */
  async findMany(params: FindManyParams = {}): Promise<T[]> {
    const {
      where = {},
      orderBy = {},
      skip = 0,
      take = 100,
      select = {},
      include = {}
    } = params;

    return this.model.findMany({
      where,
      orderBy,
      skip,
      take,
      select: Object.keys(select).length > 0 ? select : undefined,
      include: Object.keys(include).length > 0 ? include : undefined
    });
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
   * Delete a record by its ID
   * @param id - The ID of the record to delete
   * @returns The deleted record
   */
  async deleteById(id: string | number): Promise<T> {
    return this.model.delete({
      where: { id }
    });
  }

  /**
   * Count records with optional filtering
   * @param where - The filter conditions
   * @returns The count of records
   */
  async count(where: Record<string, any> = {}): Promise<number> {
    return this.model.count({ where });
  }

  /**
   * Execute a transaction with multiple operations
   * @param callback - Function containing transaction operations
   * @returns Result of the transaction
   */
  async transaction<R>(callback: (txModel: any) => Promise<R>): Promise<R> {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const txModel = tx[this.modelName];
      return callback(txModel);
    });
  }
}

// Export the ORM base class and prisma instance
export { prisma };