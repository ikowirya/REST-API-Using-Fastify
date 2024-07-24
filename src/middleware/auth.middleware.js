export async function authMiddleware(request, reply, done) {
  const token = request.headers['authorization'];
  if (!token) {
    return reply.status(401).send({ message: 'Unauthorized' });
  }

  try {
    const user = await verifyToken(token);
    request.user = user;
    done();
  } catch (error) {
    return reply.status(401).send({ message: 'Unauthorized' });
  }
}
