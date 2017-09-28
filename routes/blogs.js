'use strict';
const express = require("express");
const router = express();
let Controllers = require('../tools/controllers')

router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, Authorization, X-Requested-With, Content-Type, Accept");
    res.header("Allow-Control-Access-Method", "POST", "GET");
    next();
});

router.post('/',async (req,res)=>{
    console.log(req.body.query)
    if(req.body.query ==='getIp'){
        res.send({ip:req.clientIp})
    }
    else {
        if(Controllers[req.body.query]){
            await Controllers[req.body.query](req.body)
                .then(function (success) {
                    res.status(200).send(success)
                })
                .catch(function (err) {
                    res.status(200).send(err)
                })
        }
        else {
            res.status(200).send({error:"query method invalid"})
        }
    }

})

module.exports = router
