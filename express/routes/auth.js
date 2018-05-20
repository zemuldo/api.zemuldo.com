'use strict';
const express = require("express");
const db = require('../../db')
const logger = require('../../tools/logger')
const {loginSchema} = require('../../db/schemas')
const {login} = require('../../db/utils/users')
const sjsv = require('sjsv');
const jwt = require('jsonwebtoken');
let expiry = 60 * 5

const router = express();

function generateToken(user) {
    
    user.token = jwt.sign(user, process.env.JWT_KEY, {
        expiresIn: expiry
     });

    return user

  }

router.post('/login', (req, res) => {
    return new Promise((resolve,reject)=>{
       let validator = new sjsv(loginSchema)
       let valid = validator.vaildate(req.body)
        if (valid===true) resolve({valid:true,e:validator.getErrors()})
        else reject({code:400,valid:false,e:validator.getErrors()}) 
    })
    .then(o => {
        if(o.valid) return login(req.body) 
        else throw {e:valid,code:400}
    })
    .then(o=>{
        if(!o.id) throw o
        return generateToken(o)
    })
    .then(o=>{
        res.cookie('ztoken',o.token,  { secure:false, maxAge: 60*60*24*1000});
        res.statusCode = o.code || 200
        res.send(o)
    })
    .catch(e => {
        res.statusCode = e.code || 500
        res.send({error: e.e || 'Internal server error'})
    })
})

module.exports = router
