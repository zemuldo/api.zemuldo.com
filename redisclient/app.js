const redis = require('redis')
const client = redis.createClient(null, null, {detect_buffers: true})
const sub = redis.createClient(), pub = redis.createClient();

let msg_count = 0;
 
sub.on("message", function (channel, message) {
    let {ttl, data, key} = JSON.parse(message)
    if(client.get('queries')){
        client.get('queries', function (err, data) {
            if (data) {
                return data
            }
            else {
            }
        });
    }
});
 
sub.subscribe("api_cache");
sub.subscribe("system_log");
sub.subscribe("secure_channel");

module.exports = {
    redisClient: client,
    pub:pub,
    sub:sub,
    redisUtil: (req, res, next) => {
        if (req.body.queryMethod) {
            client.get(`${JSON.stringify(req.body)}`, function (err, data) {
                if (data) {
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