'use strict';
const express = require("express");
const requestIp = require('request-ip');
const router = express();
router.use(requestIp.mw())
let {db} = require('../../db/mongo')

router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, Authorization, X-Requested-With, Content-Type, Accept");
    res.header("Allow-Control-Access-Method", "POST");
    next();
});

router.post('/', (req,res)=>{
    return new Promise(function(resolve,reject){
        if(db[req.body.queryMethod] && req.body.queryData){
            resolve(db[req.body.queryMethod](req.body.queryData))
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
