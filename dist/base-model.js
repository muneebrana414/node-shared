var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { PrismaClient } from '@prisma/client';
/**
 * Generic ORM abstraction layer
 * Provides common CRUD operations for any model
 */
export class BaseModel {
    /**
     * Create a new model instance
     * @param modelName - The name of the Prisma model
     * @param client - An optional Prisma client instance
     * @param options - Additional options for the model
     */
    constructor(modelName, client, options = {}) {
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
    findById(id_1) {
        return __awaiter(this, arguments, void 0, function* (id, options = {}) {
            const query = {
                where: { id }
            };
            // Handle soft delete
            if (this.softDelete) {
                query.where.deleted = false;
            }
            // Add select and include if provided
            if (options.select)
                query.select = options.select;
            if (options.include)
                query.include = options.include;
            return this.model.findFirst(query);
        });
    }
    /**
     * Find first record matching the criteria
     * @param params - Query parameters
     * @returns The first matching record
     */
    findFirst() {
        return __awaiter(this, arguments, void 0, function* (params = {}) {
            const { where = {} } = params, restParams = __rest(params, ["where"]);
            const query = Object.assign({ where }, restParams);
            // Handle soft delete
            if (this.softDelete) {
                query.where.deleted = false;
            }
            return this.model.findFirst(query);
        });
    }
    /**
     * Find many records with optional filtering
     * @param params - Filter, pagination, sorting parameters
     * @returns Array of records
     */
    findMany() {
        return __awaiter(this, arguments, void 0, function* (params = {}) {
            const { where = {} } = params, restParams = __rest(params, ["where"]);
            const query = Object.assign({ where }, restParams);
            // Handle soft delete
            if (this.softDelete) {
                query.where.deleted = false;
            }
            return this.model.findMany(query);
        });
    }
    /**
     * Create a new record
     * @param data - The data for the new record
     * @returns The created record
     */
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.create({ data });
        });
    }
    /**
     * Create multiple records
     * @param data - Array of data for new records
     * @returns The created records
     */
    createMany(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.createMany({ data });
        });
    }
    /**
     * Update a record by its ID
     * @param id - The ID of the record to update
     * @param data - The data to update
     * @returns The updated record
     */
    updateById(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.update({
                where: { id },
                data
            });
        });
    }
    /**
     * Update multiple records
     * @param params - Parameters for the batch update
     * @returns The number of updated records
     */
    updateMany(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.updateMany(params);
        });
    }
    /**
     * Delete a record by its ID
     * @param id - The ID of the record to delete
     * @returns The deleted record
     */
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.softDelete) {
                return this.model.update({
                    where: { id },
                    data: { deleted: true }
                });
            }
            return this.model.delete({
                where: { id }
            });
        });
    }
    /**
     * Delete multiple records
     * @param params - Parameters for the batch delete
     * @returns The number of deleted records
     */
    deleteMany(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.softDelete) {
                return this.model.updateMany({
                    where: params.where,
                    data: { deleted: true }
                });
            }
            return this.model.deleteMany(params);
        });
    }
    /**
     * Count records with optional filtering
     * @param where - The filter conditions
     * @returns The count of records
     */
    count() {
        return __awaiter(this, arguments, void 0, function* (where = {}) {
            const query = { where };
            // Handle soft delete
            if (this.softDelete) {
                query.where.deleted = false;
            }
            return this.model.count(query);
        });
    }
    /**
     * Perform aggregation operations
     * @param params - Aggregation parameters
     * @returns Result of the aggregation
     */
    aggregate(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { where = {} } = params, aggregations = __rest(params, ["where"]);
            const query = { where };
            // Handle soft delete
            if (this.softDelete) {
                query.where.deleted = false;
            }
            // Add aggregation fields
            if (aggregations._count)
                query._count = aggregations._count;
            if (aggregations._avg)
                query._avg = aggregations._avg;
            if (aggregations._sum)
                query._sum = aggregations._sum;
            if (aggregations._min)
                query._min = aggregations._min;
            if (aggregations._max)
                query._max = aggregations._max;
            return this.model.aggregate(query);
        });
    }
    /**
     * Execute a transaction with multiple operations
     * @param callback - Function containing transaction operations
     * @returns Result of the transaction
     */
    transaction(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                return callback(tx);
            }));
        });
    }
    /**
     * Get the Prisma client instance
     * @returns The Prisma client
     */
    getClient() {
        return this.client;
    }
    /**
     * Get the raw model for performing operations not covered by the abstraction
     * @returns The Prisma model
     */
    getRawModel() {
        return this.model;
    }
}
