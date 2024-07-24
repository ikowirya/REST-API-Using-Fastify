export async function loggerMiddleware(req, reply) {
    console.log({ url: req.url, method: req.method }, 'Request received');
  }
  