'use strict';
const express = require("express");
const db = require('../../db')
const logger = require('../../tools/logger')
const {User} = require('../../db/schemas')
const {signup} = require('../../db/utils/users')
const Ajv = require('ajv');

const ajv = new Ajv({allErrors: true});
const router = express();

router.post('/signup', (req, res) => {
    return new Promise((resolve,reject)=>{
        let user = new User(req.body)
        let check = ajv.compile(user.schema);
        var valid = check(user.data);
        if (valid) resolve({valid:true,error:ajv.errorsText(check.errors)})
        else reject({valid:false,error:ajv.errorsText(check.errors)}) 
    })
    .then(o => {
        if(o.valid) return signup(req.body) 
        else throw {e:valid,code:304}
    })
    .then(o=>{
        res.statusCode = o.code || 200
        res.send(o)
    })
    .catch(e => {
        console.log(e)
        res.statusCode(e.code || 500).send(e.e || {error: 'Internal server error'})
    })
})


module.exports = router
