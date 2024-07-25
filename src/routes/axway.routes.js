import { fetchMetricsSummary, getMetrics, aggregateByClientName, aggregateByDisplayName, aggregateByServiceName, getMetricsByDate } from '../controllers/axway.controller.js';

export default async function (fastify, options) {
  fastify.get('/', fetchMetricsSummary);
  fastify.post('/konsolidasi-client', aggregateByClientName);
  fastify.post('/konsolidasi-display', aggregateByDisplayName);
  fastify.post('/konsolidasi-service', aggregateByServiceName);
  fastify.post('/konsolidasi', getMetrics);
  fastify.post('/konsolidasi-by-date', getMetricsByDate);
}
