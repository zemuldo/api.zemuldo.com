const redis = require('redis')
const client = redis.createClient(null, null, {detect_buffers: true})

module.exports = {
    redisClient: client,
    redisUtil: (req, res, next) => {
        if (req.body.queryMethod) {
            client.get(`${JSON.stringify(req.body)}`, function (err, data) {
                if (data) {
                    console.log(data)
                    res.send(data)
                    return data
                }
                else {
                    next()
                }
            });
        }
        else next()
    }
};