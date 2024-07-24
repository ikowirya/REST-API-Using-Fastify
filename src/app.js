import Fastify from 'fastify';
import { loggerMiddleware } from './middleware/logger.middleware.js';
import { customErrorHandler } from './utils/errorHandler.utils.js';
import routes from './routes/index.routes.js';
import { registerMongo } from './config/database.config.js';
// import { connectKafka, disconnectKafka } from './config/kafka.config.js';
// import { startConsumer } from './utils/kafkaConsumer.config.js';

const app = Fastify({
    logger: false,
});

await registerMongo(app);
app.addHook('onRequest', loggerMiddleware);
app.register(routes);
app.setErrorHandler(customErrorHandler);

const start = async () => {
    try {
        await app.listen({ port: 3000 });
        console.log(`Server Connected`);
        app.log.info(`Server listening on http://localhost:3000`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();


// // Connect Kafka
// connectKafka().then(() => {
//     app.log.info('Kafka connected');
//     startConsumer().then(() => {
//         app.log.info('Kafka consumer started');
//     }).catch(err => {
//         app.log.error('Failed to start Kafka consumer:', err);
//         process.exit(1);
//     });
// }).catch(err => {
//     app.log.error('Failed to connect Kafka:', err);
//     process.exit(1);
// });

// // Graceful shutdown
// const shutdown = async () => {
//     await disconnectKafka();
//     app.log.info('Kafka disconnected');
//     process.exit(0);
// };

// process.on('SIGINT', shutdown);
// process.on('SIGTERM', shutdown);