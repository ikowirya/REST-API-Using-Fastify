export function customErrorHandler(error, request, reply) {
    if (error.validation) {
        reply.code(400).send({
            message: 'Invalid request data',
            details: error.validation
        });
    } else {
        reply.send(error);
    }
}
