import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { createUser, getUsers, getUserById, updateUser, deleteUser } from '../src/controllers/user.controller.js';
import { ObjectId } from 'mongodb';

// Set up chai to use sinon-chai
chai.use(sinonChai);

describe('User Controller', () => {
  let db;
  let sandbox;
  let reply;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    db = {
      collection: sandbox.stub()
    };
    reply = {
      code: sandbox.stub().returnsThis(),
      send: sandbox.stub()
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const user = { name: 'John Doe', email: 'john@example.com' };
      const request = { body: user, server: { mongo: { db } } };

      const collection = {
        insertOne: sandbox.stub().resolves()
      };
      db.collection.returns(collection);

      await createUser(request, reply);

      expect(db.collection).to.have.been.calledWith('users');
      expect(collection.insertOne).to.have.been.calledWith(user);
      expect(reply.code).to.have.been.calledWith(201);
      expect(reply.send).to.have.been.calledWith(user);
    });

    it('should handle errors', async () => {
      const user = { name: 'John Doe', email: 'john@example.com' };
      const request = { body: user, server: { mongo: { db } } };

      const collection = {
        insertOne: sandbox.stub().rejects(new Error('Database error'))
      };
      db.collection.returns(collection);

      await createUser(request, reply);

      expect(reply.code).to.have.been.calledWith(500);
    });
  });
  
  describe('getUsers', () => {
    it('should get all users', async () => {
      const request = { server: { mongo: { db } } };

      const users = [{ name: 'John Doe' }, { name: 'Jane Doe' }];
      const collection = {
        find: sandbox.stub().returnsThis(),
        toArray: sandbox.stub().resolves(users)
      };
      db.collection.returns(collection);

      await getUsers(request, reply);

      expect(db.collection).to.have.been.calledWith('users');
      expect(collection.toArray).to.have.been.called;
      expect(reply.send).to.have.been.calledWith(users);
    });

    it('should handle errors', async () => {
      const request = { server: { mongo: { db } } };

      const collection = {
        find: sandbox.stub().returnsThis(),
        toArray: sandbox.stub().rejects(new Error('Database error'))
      };
      db.collection.returns(collection);

      await getUsers(request, reply);

      expect(reply.code).to.have.been.calledWith(500);
    });
  });

  describe('getUserById', () => {
    it('should get a user by ID', async () => {
      const userId = new ObjectId();
      const request = { params: { id: userId.toString() }, server: { mongo: { db } } };

      const user = { name: 'John Doe' };
      const collection = {
        findOne: sandbox.stub().resolves(user)
      };
      db.collection.returns(collection);

      await getUserById(request, reply);

      expect(db.collection).to.have.been.calledWith('users');
      expect(collection.findOne).to.have.been.calledWith({ _id: userId });
      expect(reply.send).to.have.been.calledWith(user);
    });

    it('should handle user not found', async () => {
      const userId = new ObjectId();
      const request = { params: { id: userId.toString() }, server: { mongo: { db } } };

      const collection = {
        findOne: sandbox.stub().resolves(null)
      };
      db.collection.returns(collection);

      await getUserById(request, reply);

      expect(reply.code).to.have.been.calledWith(404);
      expect(reply.send).to.have.been.calledWith({ message: 'User not found' });
    });

    it('should handle errors', async () => {
      const userId = new ObjectId();
      const request = { params: { id: userId.toString() }, server: { mongo: { db } } };

      const collection = {
        findOne: sandbox.stub().rejects(new Error('Database error'))
      };
      db.collection.returns(collection);

      await getUserById(request, reply);

      expect(reply.code).to.have.been.calledWith(500);
    });
  });

  describe('updateUser', () => {
    it('should update a user by ID', async () => {
      const userId = new ObjectId();
      const request = { params: { id: userId.toString() }, body: { name: 'John Smith' }, server: { mongo: { db } } };

      const collection = {
        updateOne: sandbox.stub().resolves({ matchedCount: 1 })
      };
      db.collection.returns(collection);

      await updateUser(request, reply);

      expect(db.collection).to.have.been.calledWith('users');
      expect(collection.updateOne).to.have.been.calledWith({ _id: userId }, { $set: request.body });
      expect(reply.send).to.have.been.calledWith({ message: 'User updated' });
    });

    it('should handle user not found', async () => {
      const userId = new ObjectId();
      const request = { params: { id: userId.toString() }, body: { name: 'John Smith' }, server: { mongo: { db } } };

      const collection = {
        updateOne: sandbox.stub().resolves({ matchedCount: 0 })
      };
      db.collection.returns(collection);

      await updateUser(request, reply);

      expect(reply.code).to.have.been.calledWith(404);
      expect(reply.send).to.have.been.calledWith({ message: 'User not found' });
    });

    it('should handle errors', async () => {
      const userId = new ObjectId();
      const request = { params: { id: userId.toString() }, body: { name: 'John Smith' }, server: { mongo: { db } } };

      const collection = {
        updateOne: sandbox.stub().rejects(new Error('Database error'))
      };
      db.collection.returns(collection);

      await updateUser(request, reply);

      expect(reply.code).to.have.been.calledWith(500);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by ID', async () => {
      const userId = new ObjectId();
      const request = { params: { id: userId.toString() }, server: { mongo: { db } } };

      const collection = {
        deleteOne: sandbox.stub().resolves({ deletedCount: 1 })
      };
      db.collection.returns(collection);

      await deleteUser(request, reply);

      expect(db.collection).to.have.been.calledWith('users');
      expect(collection.deleteOne).to.have.been.calledWith({ _id: userId });
      expect(reply.send).to.have.been.calledWith({ message: 'User deleted' });
    });

    it('should handle user not found', async () => {
      const userId = new ObjectId();
      const request = { params: { id: userId.toString() }, server: { mongo: { db } } };

      const collection = {
        deleteOne: sandbox.stub().resolves({ deletedCount: 0 })
      };
      db.collection.returns(collection);

      await deleteUser(request, reply);

      expect(reply.code).to.have.been.calledWith(404);
      expect(reply.send).to.have.been.calledWith({ message: 'User not found' });
    });

    it('should handle errors', async () => {
      const userId = new ObjectId();
      const request = { params: { id: userId.toString() }, server: { mongo: { db } } };

      const collection = {
        deleteOne: sandbox.stub().rejects(new Error('Database error'))
      };
      db.collection.returns(collection);

      await deleteUser(request, reply);

      expect(reply.code).to.have.been.calledWith(500);
    });
  });
});
