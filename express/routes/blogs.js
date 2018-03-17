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
    logger.status({date: new Date(), status: 'performing query for', body: req.body})
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
            if (o.code && o.code === 401) {
                res.send(o)
                return false
            }
            res.statusCode = 200;
            res.send(o)
        })
        .catch((e) => {
            console.log(e)
            res.statusCode = 500;
            res.send({error: 'Internal server error'})
        })

})

module.exports = router
