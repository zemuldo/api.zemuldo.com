'use strict';
const express = require("express");
const requestIp = require('request-ip');
let router = express();
let db = require('../../db')
const {redisClient, redisUtil} = require('../../redisclient/app')
const {setCors} = require('../../tools/utilities')

router.use(requestIp.mw())

router.use(setCors);

router.use(redisUtil)

router.post('/', (req,res)=>{
    return new Promise(function(resolve,reject){
        if(db[req.body.queryMethod] && req.body.queryData){
            resolve(db[req.body.queryMethod](req.body.queryData,`${JSON.stringify(req.body)}`))
       }
       else {
           res.statusCode = 401;
           reject({error:"query method or data invalid"})
       }
    })
    .then((o)=>{
        redisClient.set(`${JSON.stringify(req.body)}`,JSON.stringify(o),'EX', 60)
        res.statusCode = 200;
        res.send(o)
    })
    .catch((e)=>{
        console.log(e)
        res.statusCode = 500;
        res.send({error:'Internal server error'})
    })

})

module.exports = router
