'use strict';
const express = require("express");
const router = express();
let Controllers = require('../tools/controllers')
let {validatePost} = require('../tools/utilities')

router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, Authorization, X-Requested-With, Content-Type, Accept");
    res.header("Allow-Control-Access-Method", "POST", "GET");
    next();
});

router.post('/blogs',async (req,res)=>{

    if(Controllers[req.body.query]){
        let validate = await validatePost(req.body)
        if(!validate.error){
            let state = await Controllers.newPost(req.body)
            if(!state.error){
                res.status(200).send(state)
            }
            else {
                res.status(200).send(state)
            }
        }
        else{
            res.status(200).send(validate)
        }
    }
    else {
        res.status(200).send({error:"query method invalid"})
    }
})

module.exports = router
