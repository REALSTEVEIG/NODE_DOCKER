module.exports = {
    MONGO_IP: process.env.MONGO_IP || "mongo",
    MONGO_PORT: process.env.MONGO_PORT || 27017,
    MONGO_USER: process.env.MONGO_USER || "stephen",
    MONGO_PASSWORD: process.env.MONGO_PASSWORD || "steve1234",
    REDIS_URL: process.env.REDIS_URL || "redis",  // Use "redis" as the default value
    REDIS_PORT: process.env.REDIS_PORT || 6379,
    SESSION_SECRET: process.env.SESSION_SECRET || "secret",
  };
  