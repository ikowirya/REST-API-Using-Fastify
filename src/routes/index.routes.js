import healthRoutes from './health.routes.js';
import userRoutes from './user.routes.js';

export default async function (fastify, options) {
  fastify.register(healthRoutes, { prefix: '/health' });
  fastify.register(userRoutes, { prefix: '/users' });
}
