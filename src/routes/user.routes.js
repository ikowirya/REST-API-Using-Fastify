// routes/user.routes.js
import { createUser, getUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controller.js';

export default async function (fastify, options) {
  fastify.post('/', createUser);
  fastify.get('/', getUsers);
  fastify.get('/:id', getUserById);
  fastify.put('/:id', updateUser);
  fastify.delete('/:id', deleteUser);
}
