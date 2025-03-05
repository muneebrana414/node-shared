import * as dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || '3000';
export const LOG_LEVEL = process.env.LOG_LEVEL || 'debug';
export const SWAGGER_BASE_PATH = process.env.SWAGGER_BASE_PATH || '';
export const APOLLO_BASE_PATH = process.env.APOLLO_BASE_PATH || '';
export const { SWAGGER_HOST } = process.env;
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
