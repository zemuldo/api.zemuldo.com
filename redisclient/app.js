const redis = require('redis')
const client = redis.createClient(null, null, {detect_buffers: true})

module.exports = {
    redisClient: client,
    redisUtil: (req, res, next) => {
        if (req.body.queryMethod) {
            client.get(`${JSON.stringify(req.body)}`, function (err, data) {
                if (data) {
                    console.log('serving from redis by middleware')
                    res.send(data)
                    return data
                }
                else {
                    console.log('this endpoint not catched')
                    next()
                }
            });
        }
        else next()
    }
};