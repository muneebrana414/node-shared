/**
 * QueryBuilder - Helper for building complex Prisma queries
 */
/**
 * QueryBuilder class to build complex queries
 */
export class QueryBuilder {
    constructor() {
        this.conditions = [];
        this.orderByFields = [];
        this.limitValue = null;
        this.offsetValue = null;
        this.includeRelations = {};
        this.selectFields = {};
    }
    /**
     * Add a field condition to the query
     * @param field - The field name
     * @param operator - The operator to use
     * @param value - The value to compare with
     * @returns The QueryBuilder instance for chaining
     */
    where(field, operator, value) {
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
    whereEquals(field, value) {
        return this.where(field, 'equals', value);
    }
    /**
     * Add a logical AND condition
     * @param conditions - Array of conditions to combine with AND
     * @returns The QueryBuilder instance for chaining
     */
    whereAnd(conditions) {
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
    whereOr(conditions) {
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
    whereNot(conditions) {
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
    orderBy(field, direction = 'asc') {
        this.orderByFields.push({ [field]: direction });
        return this;
    }
    /**
     * Add a LIMIT clause to the query
     * @param limit - The maximum number of records to return
     * @returns The QueryBuilder instance for chaining
     */
    limit(limit) {
        this.limitValue = limit;
        return this;
    }
    /**
     * Add an OFFSET clause to the query
     * @param offset - The number of records to skip
     * @returns The QueryBuilder instance for chaining
     */
    offset(offset) {
        this.offsetValue = offset;
        return this;
    }
    /**
     * Add relations to include in the query
     * @param relations - Object with relation configuration
     * @returns The QueryBuilder instance for chaining
     */
    include(relations) {
        this.includeRelations = Object.assign(Object.assign({}, this.includeRelations), relations);
        return this;
    }
    /**
     * Select specific fields in the query
     * @param fields - Object with field configuration
     * @returns The QueryBuilder instance for chaining
     */
    select(fields) {
        this.selectFields = Object.assign(Object.assign({}, this.selectFields), fields);
        return this;
    }
    /**
     * Build the where conditions for Prisma
     * @returns The where conditions object
     */
    buildWhereConditions() {
        // If no conditions, return empty object
        if (this.conditions.length === 0) {
            return {};
        }
        // If only one condition and it's a field condition, create direct filter
        if (this.conditions.length === 1 && 'field' in this.conditions[0]) {
            const cond = this.conditions[0];
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
    processCondition(condition) {
        if ('field' in condition) {
            // It's a field condition
            return {
                [condition.field]: { [condition.operator]: condition.value }
            };
        }
        else {
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
    build() {
        const query = {};
        // Add where conditions
        const whereConditions = this.buildWhereConditions();
        if (Object.keys(whereConditions).length > 0) {
            query.where = whereConditions;
        }
        // Add order by
        if (this.orderByFields.length > 0) {
            if (this.orderByFields.length === 1) {
                query.orderBy = this.orderByFields[0];
            }
            else {
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
    static create() {
        return new QueryBuilder();
    }
}
