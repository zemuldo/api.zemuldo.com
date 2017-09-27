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
    if(req.body.query ==='getIp'){
        res.send({ip:req.clientIp})
    }
    else {
        if(Controllers[req.body.query]){
            let state = await Controllers[req.body.query](req.body)
            if(!state.error){
                res.status(200).send(state)
            }
            else {
                res.status(200).send(state)
            }
        }
        else {
            res.status(200).send({error:"query method invalid"})
        }
    }

})

module.exports = router
