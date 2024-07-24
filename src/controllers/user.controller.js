import { ObjectId } from 'mongodb';
import { getDbClient } from '../config/database.config.js';

// Create a new user
export async function createUser(request, reply) {
    const db = getDbClient(request.server); 
    try {
        const user = request.body;
        await db.collection('users').insertOne(user);
        reply.code(201).send(user);
    } catch (err) {
        reply.code(400).send(err);
    }
}

// Get all users
export async function getUsers(request, reply) {
    const db = getDbClient(request.server); 

    try {
        const users = await db.collection('users').find().toArray();
        reply.send(users);
    } catch (err) {
        reply.code(400).send(err);
    }
}

// Get a single user by ID
export async function getUserById(request, reply) {
    const db = getDbClient(request.server); 
    const userId = request.params.id;

    if (!ObjectId.isValid(userId)) {
        return reply.code(400).send({ message: 'Invalid user ID format' });
    }

    try {
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        if (user) {
            reply.send(user);
        } else {
            reply.code(404).send({ message: 'User not found' });
        }
    } catch (err) {
        reply.code(400).send(err);
    }
}

// Update a user by ID
export async function updateUser(request, reply) {
    const db = getDbClient(request.server); 
    const userId = request.params.id;

    if (!ObjectId.isValid(userId)) {
        return reply.code(400).send({ message: 'Invalid user ID format' });
    }

    try {
        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(userId) },
            { $set: request.body }
        );
        if (result.matchedCount > 0) {
            reply.send({ message: 'User updated' });
        } else {
            reply.code(404).send({ message: 'User not found' });
        }
    } catch (err) {
        reply.code(400).send(err);
    }
}

// Delete a user by ID
export async function deleteUser(request, reply) {
    const db = getDbClient(request.server); 
    const userId = request.params.id;

    if (!ObjectId.isValid(userId)) {
        return reply.code(400).send({ message: 'Invalid user ID format' });
    }

    try {
        const result = await db.collection('users').deleteOne({ _id: new ObjectId(userId) });
        if (result.deletedCount > 0) {
            reply.send({ message: 'User deleted' });
        } else {
            reply.code(404).send({ message: 'User not found' });
        }
    } catch (err) {
        reply.code(400).send(err);
    }
}
