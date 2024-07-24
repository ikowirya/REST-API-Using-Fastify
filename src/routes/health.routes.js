import { getHealth } from '../controllers/health.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { queryHealthSchema } from '../schemas/health.schema.js';

export default async function (fastify, options) {
  fastify.get('/', {
    // preHandler: authMiddleware,
    schema: queryHealthSchema
  }, getHealth);
}
