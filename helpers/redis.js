const redis = require('redis');
 
class Redis {
    setCache(key, time, data) {
        const redis_client = redis.createClient(6379)
        let result = redis_client.setex(
            key,
            time,
            data
        );
    
        return result;
    }

    getCache(key) {
        const redis_client = redis.createClient(6379)
        let result = redis_client.get(key)
    
        return result
    }
}

module.exports = Redis
