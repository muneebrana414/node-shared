var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
/**
 * Generic ORM abstraction layer
 * Provides common CRUD operations for any model
 */
export class BaseModel {
    constructor(modelName) {
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
    findById(id_1) {
        return __awaiter(this, arguments, void 0, function* (id, options = {}) {
            return this.model.findUnique(Object.assign({ where: { id } }, options));
        });
    }
    /**
     * Find many records with optional filtering
     * @param params - Filter, pagination, sorting parameters
     * @returns Array of records
     */
    findMany() {
        return __awaiter(this, arguments, void 0, function* (params = {}) {
            const { where = {}, orderBy = {}, skip = 0, take = 100, select = {}, include = {} } = params;
            return this.model.findMany({
                where,
                orderBy,
                skip,
                take,
                select: Object.keys(select).length > 0 ? select : undefined,
                include: Object.keys(include).length > 0 ? include : undefined
            });
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
     * Delete a record by its ID
     * @param id - The ID of the record to delete
     * @returns The deleted record
     */
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.delete({
                where: { id }
            });
        });
    }
    /**
     * Count records with optional filtering
     * @param where - The filter conditions
     * @returns The count of records
     */
    count() {
        return __awaiter(this, arguments, void 0, function* (where = {}) {
            return this.model.count({ where });
        });
    }
    /**
     * Execute a transaction with multiple operations
     * @param callback - Function containing transaction operations
     * @returns Result of the transaction
     */
    transaction(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const txModel = tx[this.modelName];
                return callback(txModel);
            }));
        });
    }
}
// Export the ORM base class and prisma instance
export { prisma };
