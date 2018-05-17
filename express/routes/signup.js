'use strict';
const express = require("express");
const db = require('../../db')
const logger = require('../../tools/logger')
const {user} = require('../../db/schemas')
var Ajv = require('ajv');
var ajv = new Ajv({allErrors: true});

const check = ajv.compile(user);

const validateUser =  (data)=> {
  var valid = check(data);
  if (valid) return {vaild:true}
  else return {error:ajv.errorsText(check.errors)}
}

const router = express();

router.post('/signup', (req, res) => {
    return new Promise((resolve,reject)=>{
        let valid = validateUser(req.body)
        if(!valid.error) resolve({valid:true})
        else reject({valid:false, error:valid.error})
    })
    .then(o => {
        res.send(o)
    })
    .catch(e => {
        console.log(e)
        res.send(e)
    })
})


module.exports = router
