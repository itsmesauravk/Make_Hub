const redis = require('redis');

// Create a Redis client, specify the host and port if necessary
const redisClient = redis.createClient({
  host: 'localhost', // or '127.0.0.1'
  port: 6379, // default Redis port
});

redisClient.on('error', (error) => {
  console.error(`Redis connection error: ${error}`);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis!');
});

module.exports = redisClient;
