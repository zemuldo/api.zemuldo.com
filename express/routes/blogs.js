'use strict';
const express = require("express");
const requestIp = require('request-ip');
let router = express();
let db = require('../../db')
const {redisUtil} = require('../../redisclient/app')
const logger = require('../../tools/logger')

router.use(requestIp.mw())

router.use(redisUtil)

router.post('/', (req, res) => {
    return new Promise(function (resolve, reject) {
        if (db[req.body.queryMethod] && req.body.queryData) {
            resolve(db[req.body.queryMethod](req.body.queryData, `${JSON.stringify(req.body)}`))
        }
        else {
            res.statusCode = 404;
            reject({error: "query method or data invalid"})
        }
    })
        .then((o) => {
            logger.success({date: new Date(), status: 'performed query for', body: req.body, from: req.headers['x-real-ip'] || req.connection.remoteAddress})
            if (o.code && o.code === 401) {
                res.send(o)
                return false
            }
            res.statusCode = 200;
            res.send(o)
        })
        .catch((e) => {
            logger.error({date: new Date(), status: 'performed query for', body: req.body, from: req.headers['x-real-ip'] || req.connection.remoteAddress})
            logger.error({date: new Date(), status: 'error', body: req.body, from: req.headers['x-real-ip'] || req.connection.remoteAddress,error:e})
            res.statusCode = 500;
            res.send({error: 'Internal server error'})
        })

})

module.exports = router
