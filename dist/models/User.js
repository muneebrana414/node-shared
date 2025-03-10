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
// File: src/models/User.ts
import { BaseModel } from '../db/orm';
class UserModel extends BaseModel {
    constructor() {
        super('user'); // This should match your Prisma model name
    }
    /**
     * Find user by email
     * @param email - User's email
     * @returns User object
     */
    findByEmail(email_1) {
        return __awaiter(this, arguments, void 0, function* (email, options = {}) {
            return this.model.findUnique(Object.assign({ where: { email } }, options));
        });
    }
    /**
     * Create user with hashed password
     * @param userData - User data including password
     * @returns Created user
     */
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password } = userData, otherData = __rest(userData, ["password"]);
            // Here you would typically hash the password
            const hashedPassword = yield this.hashPassword(password);
            return this.create(Object.assign(Object.assign({}, otherData), { password: hashedPassword }));
        });
    }
    /**
     * Hash password (example implementation)
     * @param password - Plain password
     * @returns Hashed password
     */
    hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            // This is a placeholder - you should use bcrypt or similar
            // Example: return bcrypt.hash(password, 10);
            return `hashed_${password}`;
        });
    }
    /**
     * Get users with their posts
     * @param params - Query parameters including optional filter for published posts
     * @returns Users with their posts
     */
    getUsersWithPosts() {
        return __awaiter(this, arguments, void 0, function* (params = {}) {
            const { includeUnpublished = false } = params, restParams = __rest(params, ["includeUnpublished"]);
            return this.findMany(Object.assign(Object.assign({}, restParams), { include: {
                    posts: {
                        where: includeUnpublished ? undefined : { published: true }
                    }
                } }));
        });
    }
}
// Export a singleton instance
export const UserService = new UserModel();
