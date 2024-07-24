import fastifyMongo from '@fastify/mongodb';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  url: process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/db-analytic',
};

export async function registerMongo(fastify) {
  try {
    await fastify.register(fastifyMongo, {
      url: dbConfig.url,
    });
    fastify.log.info('MongoDB connected successfully');
  } catch (err) {
    fastify.log.error('Error connecting to MongoDB:', err);
    process.exit(1); 
  }
}

export function getDbClient(fastify) {
  return fastify.mongo.db;
}
