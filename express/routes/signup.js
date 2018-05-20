'use strict';
const express = require("express");
const db = require('../../db')
const logger = require('../../tools/logger')
const {userSchema} = require('../../db/schemas')
const {signup} = require('../../db/utils/users')
const { hash, validate } = require('../../tools/crypt');
const sjsv = require('sjsv');

const router = express();

router.post('/signup', (req, res) => {
    return new Promise((resolve,reject)=>{
       let validator = new sjsv(userSchema)
       let valid = validator.vaildate(req.body)
        if (valid===true) resolve({valid:true,e:validator.getErrors()})
        else reject({code:400,valid:false,e:validator.getErrors()}) 
    })
    .then(o => {
        let user = req.body
        user.password = hash(req.body.password)
        if(o.valid) return signup(user) 
        else throw {e:valid,code:304}
    })
    .then(o=>{
        res.statusCode = o.code || 200
        res.send(o)
    })
    .catch(e => {
        res.statusCode = e.code || 500
        res.send({error: e.e || 'Internal server error'})
    })
})


module.exports = router
