export const env = () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    mongodb : process.env.MONGO_URI,
    redis: process.env.REDIS_URI,
 });
    