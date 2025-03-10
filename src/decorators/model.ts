import { PrismaClient } from '@prisma/client';
import { BaseModel } from '../base-model';
import { ModelOptions } from '../types';

/**
 * Model decorator - Makes creating models easier with TypeScript decorators
 * @param options - Options for the model
 */
export function Model(options: ModelOptions = {}) {
  return function <T extends { new(...args: any[]): BaseModel<any> }>(target: T) {
    return class extends target {
      constructor(...args: any[]) {
        const modelName = options.modelName || target.name.toLowerCase().replace('model', '');

        // Check if a client was passed as the first argument
        let client: PrismaClient;
        if (args.length > 0 && args[0] instanceof PrismaClient) {
          client = args[0];
        } else {
          client = new PrismaClient();
        }

        // Pass options to the parent constructor
        super(modelName, client, {
          softDelete: options.softDelete || false
        });
      }
    };
  };
}

/**
 * Create a repository factory function
 * @param modelClass - The model class to instantiate
 * @param client - Optional PrismaClient instance
 * @returns A factory function for creating repositories
*/
export function createRepository<T extends Record<string, any>, M extends BaseModel<T>>(
  modelClass: new (client?: PrismaClient) => M,
  client?: PrismaClient
): () => M {
  return () => new modelClass(client);
}

