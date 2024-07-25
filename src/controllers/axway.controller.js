import axios from 'axios';
import { getDbClient } from '../config/database.config.js';
import https from 'https';
import moment from 'moment-timezone';
import dotenv from 'dotenv';
import { dateSchema } from '../schemas/axway.schema.js';
dotenv.config();

const agent = new https.Agent({
    rejectUnauthorized: false,
});

export async function fetchMetricsSummary(request, reply) {
    const db = getDbClient(request.server);
    const username = process.env.API_USERNAME;
    const password = process.env.API_PASSWORD;
    const apiUrl = process.env.API_URL;

    try {
        const currentDateData = moment().tz('Asia/Jakarta').format();
        const auth = Buffer.from(`${username}:${password}`).toString('base64');
        const response = await axios.get(apiUrl, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`,
            },
            httpsAgent: agent,
        });

        const data = response.data.result
        const dataWithDate = data.map(item => ({
            createdAt: currentDateData,
            ...item
        }));
        await db.collection('metrics').insertMany(dataWithDate);
        reply.code(200).send(dataWithDate);
    } catch (err) {
        console.error('Error fetching metrics summary:', err.cause);
        reply.code(400).send({ error: 'Failed to fetch metrics summary' });
    }
}

export async function getMetrics(request, reply) {
    const db = getDbClient(request.server);
    const { SERVICENAME = '', DISPLAYNAME = '', CLIENTNAME = '' } = request.body;
    try {
        if (SERVICENAME || DISPLAYNAME || CLIENTNAME) {
            const query = {};
            if (SERVICENAME) query.SERVICENAME = SERVICENAME;
            if (DISPLAYNAME) query.DISPLAYNAME = DISPLAYNAME;
            if (CLIENTNAME) query.CLIENTNAME = CLIENTNAME;

            const metricsData = await db.collection('metrics').find(query).toArray();
            reply.code(200).send(metricsData);
        } else {
            const metricsData = await db.collection('metrics').find().toArray();
            reply.code(200).send(metricsData);
        }
    } catch (err) {
        console.error('Error fetching metrics data:', err);
        reply.code(400).send({ error: 'Failed to fetch metrics data' });
    }
}

export async function aggregateByServiceName(request, reply) {
    const db = getDbClient(request.server);
    const { SERVICENAME = '' } = request.body || {};

    try {
        const matchStage = SERVICENAME ? { SERVICENAME } : {};

        const pipeline = [
            { $match: matchStage },
            {
                $group: {
                    _id: "$SERVICENAME",
                    totalFailures: { $sum: "$totalFailures" },
                    totalSuccesses: { $sum: "$totalSuccesses" },
                    totalExceptions: { $sum: "$totalExceptions" },
                    totalNumMessages: { $sum: "$totalNumMessages" }
                }
            },
            {
                $project: {
                    _id: 0,
                    SERVICENAME: "$_id",
                    totalFailures: 1,
                    totalSuccesses: 1,
                    totalExceptions: 1,
                    totalNumMessages: 1
                }
            }
        ];

        const aggregatedData = await db.collection('metrics').aggregate(pipeline).toArray();
        reply.code(200).send(aggregatedData);
    } catch (err) {
        console.error('Error aggregating by service name:', err);
        reply.code(400).send({ error: 'Failed to aggregate by service name' });
    }
}

export async function aggregateByDisplayName(request, reply) {
    const db = getDbClient(request.server);
    const { DISPLAYNAME = '' } = request.body || {};

    try {
        const matchStage = DISPLAYNAME ? { DISPLAYNAME } : {};
        const pipeline = [
            { $match: matchStage },
            {
                $group: {
                    _id: "$DISPLAYNAME",
                    totalFailures: { $sum: "$totalFailures" },
                    totalSuccesses: { $sum: "$totalSuccesses" },
                    totalExceptions: { $sum: "$totalExceptions" },
                    totalNumMessages: { $sum: "$totalNumMessages" }
                }
            },
            {
                $project: {
                    _id: 0,
                    DISPLAYNAME: "$_id",
                    totalFailures: 1,
                    totalSuccesses: 1,
                    totalExceptions: 1,
                    totalNumMessages: 1
                }
            }
        ];

        const aggregatedData = await db.collection('metrics').aggregate(pipeline).toArray();
        reply.code(200).send(aggregatedData);
    } catch (err) {
        console.error('Error aggregating by display name:', err);
        reply.code(400).send({ error: 'Failed to aggregate by display name' });
    }
}

export async function aggregateByClientName(request, reply) {
    const db = getDbClient(request.server);
    const { CLIENTNAME = '' } = request.body || {};

    try {
        const matchStage = CLIENTNAME ? { CLIENTNAME } : {};


        const pipeline = [
            { $match: matchStage },
            {
                $group: {
                    _id: "$CLIENTNAME",
                    totalFailures: { $sum: "$totalFailures" },
                    totalSuccesses: { $sum: "$totalSuccesses" },
                    totalExceptions: { $sum: "$totalExceptions" },
                    totalNumMessages: { $sum: "$totalNumMessages" }
                }
            },
            {
                $project: {
                    _id: 0,
                    CLIENTNAME: "$_id",
                    totalFailures: 1,
                    totalSuccesses: 1,
                    totalExceptions: 1,
                    totalNumMessages: 1
                }
            }
        ];

        const aggregatedData = await db.collection('metrics').aggregate(pipeline).toArray();
        reply.code(200).send(aggregatedData);
    } catch (err) {
        console.error('Error aggregating by client name:', err);
        reply.code(400).send({ error: 'Failed to aggregate by client name' });
    }
}

export async function getMetricsByDate(request, reply) {
    const db = getDbClient(request.server);
    const { startDate, endDate } = request.body;
    
    const { error } = dateSchema.validate({ startDate, endDate });
    if (error) {
        return reply.code(400).send({ error: `Invalid input: ${error.message}` });
    }

    try {
        const query = {
            "createdAt": {
                "$gte": `${startDate}T00:00:00.000Z`,
                "$lt": `${endDate}T23:59:59.999Z`,
            }
        };
        const metricsData = await db.collection('metrics').find(query).toArray();
        reply.code(200).send(metricsData);
    } catch (err) {
        console.error('Error fetching metrics data by date:', err);
        reply.code(400).send({ error: 'Failed to fetch metrics data by date' });
    }
}
