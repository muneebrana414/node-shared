// File: src/models/User.ts
import { BaseModel, QueryOptions, FindManyParams } from '../db/orm';

// User interfaces
export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  posts?: Post[];
}

interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  authorId: string;
}

interface CreateUserData {
  email: string;
  name: string;
  password: string;
}

interface UserWithPostsParams extends FindManyParams {
  includeUnpublished?: boolean;
}

class UserModel extends BaseModel<User> {
  constructor() {
    super('user'); // This should match your Prisma model name
  }

  /**
   * Find user by email
   * @param email - User's email
   * @returns User object
   */
  async findByEmail(email: string, options: QueryOptions = {}): Promise<User | null> {
    return this.model.findUnique({
      where: { email },
      ...options
    });
  }

  /**
   * Create user with hashed password
   * @param userData - User data including password
   * @returns Created user
   */
  async createUser(userData: CreateUserData): Promise<User> {
    const { password, ...otherData } = userData;

    // Here you would typically hash the password
    const hashedPassword = await this.hashPassword(password);

    return this.create({
      ...otherData,
      password: hashedPassword
    });
  }

  /**
   * Hash password (example implementation)
   * @param password - Plain password
   * @returns Hashed password
   */
  async hashPassword(password: string): Promise<string> {
    // This is a placeholder - you should use bcrypt or similar
    // Example: return bcrypt.hash(password, 10);
    return `hashed_${password}`;
  }

  /**
   * Get users with their posts
   * @param params - Query parameters including optional filter for published posts
   * @returns Users with their posts
   */
  async getUsersWithPosts(params: UserWithPostsParams = {}): Promise<User[]> {
    const { includeUnpublished = false, ...restParams } = params;

    return this.findMany({
      ...restParams,
      include: {
        posts: {
          where: includeUnpublished ? undefined : { published: true }
        }
      }
    });
  }
}

// Export a singleton instance
export const UserService = new UserModel();