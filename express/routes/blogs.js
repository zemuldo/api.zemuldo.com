'use strict';
const express = require("express");
const requestIp = require('request-ip');
let router = express();
let db = require('../../db')
const {redisClient, redisUtil} = require('../../redisclient/app')

router.use(requestIp.mw())

router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, Authorization, X-Requested-With, Content-Type, Accept");
    res.header("Allow-Control-Access-Method", "POST");
    next();
});

router.use(redisUtil)

router.post('/', (req,res)=>{
    return new Promise(function(resolve,reject){
        if(db[req.body.queryMethod] && req.body.queryData){
            redisClient.get(`${JSON.stringify(req.body)}`, function (err, data) {
                if (data) {
                    console.log('serving from reddis')
                    console.log(data)
                    resolve(data)
                    return data
                }
                else {
                    resolve(db[req.body.queryMethod](req.body.queryData,`${JSON.stringify(req.body)}`))
                    return true
                }
            });
       }
       else {
           res.statusCode = 401;
           reject({error:"query method or data invalid"})
       }
    })
    .then((o)=>{
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
