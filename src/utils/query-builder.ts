/**
 * QueryBuilder - Helper for building complex Prisma queries
 */

// Type for filter operations
export type FilterOperator =
  | 'equals'
  | 'not'
  | 'in'
  | 'notIn'
  | 'lt'
  | 'lte'
  | 'gt'
  | 'gte'
  | 'contains'
  | 'startsWith'
  | 'endsWith';

// Type for field condition
export type FieldCondition = {
  field: string;
  operator: FilterOperator;
  value: any;
};

// Type for logical operations
export type LogicalOperator = 'AND' | 'OR' | 'NOT';

// Type for combined conditions
export type CombinedCondition = {
  operator: LogicalOperator;
  conditions: (FieldCondition | CombinedCondition)[];
};

// Type for any condition
export type Condition = FieldCondition | CombinedCondition;

/**
 * QueryBuilder class to build complex queries
 */
export class QueryBuilder {
  private conditions: Condition[] = [];
  private orderByFields: Record<string, 'asc' | 'desc'>[] = [];
  private limitValue: number | null = null;
  private offsetValue: number | null = null;
  private includeRelations: Record<string, boolean | object> = {};
  private selectFields: Record<string, boolean> = {};

  /**
   * Add a field condition to the query
   * @param field - The field name
   * @param operator - The operator to use
   * @param value - The value to compare with
   * @returns The QueryBuilder instance for chaining
   */
  where(field: string, operator: FilterOperator, value: any): QueryBuilder {
    this.conditions.push({
      field,
      operator,
      value
    });
    return this;
  }

  /**
   * Add an equals condition to the query
   * @param field - The field name
   * @param value - The value to compare with
   * @returns The QueryBuilder instance for chaining
   */
  whereEquals(field: string, value: any): QueryBuilder {
    return this.where(field, 'equals', value);
  }

  /**
   * Add a logical AND condition
   * @param conditions - Array of conditions to combine with AND
   * @returns The QueryBuilder instance for chaining
   */
  whereAnd(conditions: Condition[]): QueryBuilder {
    this.conditions.push({
      operator: 'AND',
      conditions
    });
    return this;
  }

  /**
   * Add a logical OR condition
   * @param conditions - Array of conditions to combine with OR
   * @returns The QueryBuilder instance for chaining
   */
  whereOr(conditions: Condition[]): QueryBuilder {
    this.conditions.push({
      operator: 'OR',
      conditions
    });
    return this;
  }

  /**
   * Add a logical NOT condition
   * @param conditions - Array of conditions to combine with NOT
   * @returns The QueryBuilder instance for chaining
   */
  whereNot(conditions: Condition[]): QueryBuilder {
    this.conditions.push({
      operator: 'NOT',
      conditions
    });
    return this;
  }

  /**
   * Add an ORDER BY clause to the query
   * @param field - The field to order by
   * @param direction - The direction to order by (asc|desc)
   * @returns The QueryBuilder instance for chaining
   */
  orderBy(field: string, direction: 'asc' | 'desc' = 'asc'): QueryBuilder {
    this.orderByFields.push({ [field]: direction });
    return this;
  }

  /**
   * Add a LIMIT clause to the query
   * @param limit - The maximum number of records to return
   * @returns The QueryBuilder instance for chaining
   */
  limit(limit: number): QueryBuilder {
    this.limitValue = limit;
    return this;
  }

  /**
   * Add an OFFSET clause to the query
   * @param offset - The number of records to skip
   * @returns The QueryBuilder instance for chaining
   */
  offset(offset: number): QueryBuilder {
    this.offsetValue = offset;
    return this;
  }

  /**
   * Add relations to include in the query
   * @param relations - Object with relation configuration
   * @returns The QueryBuilder instance for chaining
   */
  include(relations: Record<string, boolean | object>): QueryBuilder {
    this.includeRelations = { ...this.includeRelations, ...relations };
    return this;
  }

  /**
   * Select specific fields in the query
   * @param fields - Object with field configuration
   * @returns The QueryBuilder instance for chaining
   */
  select(fields: Record<string, boolean>): QueryBuilder {
    this.selectFields = { ...this.selectFields, ...fields };
    return this;
  }

  /**
   * Build the where conditions for Prisma
   * @returns The where conditions object
   */
  private buildWhereConditions(): Record<string, any> {
    // If no conditions, return empty object
    if (this.conditions.length === 0) {
      return {};
    }

    // If only one condition and it's a field condition, create direct filter
    if (this.conditions.length === 1 && 'field' in this.conditions[0]) {
      const cond = this.conditions[0] as FieldCondition;
      return {
        [cond.field]: { [cond.operator]: cond.value }
      };
    }

    // For multiple conditions, combine with AND by default
    return {
      AND: this.conditions.map(cond => this.processCondition(cond))
    };
  }

  /**
   * Process a single condition (field or combined)
   * @param condition - The condition to process
   * @returns The processed condition
   */
  private processCondition(condition: Condition): Record<string, any> {
    if ('field' in condition) {
      // It's a field condition
      return {
        [condition.field]: { [condition.operator]: condition.value }
      };
    } else {
      // It's a combined condition
      return {
        [condition.operator]: condition.conditions.map(cond => this.processCondition(cond))
      };
    }
  }

  /**
   * Build the Prisma query object
   * @returns The complete query object for Prisma
   */
  build(): Record<string, any> {
    const query: Record<string, any> = {};

    // Add where conditions
    const whereConditions = this.buildWhereConditions();
    if (Object.keys(whereConditions).length > 0) {
      query.where = whereConditions;
    }

    // Add order by
    if (this.orderByFields.length > 0) {
      if (this.orderByFields.length === 1) {
        query.orderBy = this.orderByFields[0];
      } else {
        query.orderBy = this.orderByFields;
      }
    }

    // Add limit (take) and offset (skip)
    if (this.limitValue !== null) {
      query.take = this.limitValue;
    }
    if (this.offsetValue !== null) {
      query.skip = this.offsetValue;
    }

    // Add include relations
    if (Object.keys(this.includeRelations).length > 0) {
      query.include = this.includeRelations;
    }

    // Add select fields
    if (Object.keys(this.selectFields).length > 0) {
      query.select = this.selectFields;
    }

    return query;
  }

  /**
   * Create a new QueryBuilder instance
   * @returns A new QueryBuilder instance
   */
  static create(): QueryBuilder {
    return new QueryBuilder();
  }
}
