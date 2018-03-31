'use strict';
const express = require("express");
const requestIp = require('request-ip');
const ObjectID = require('mongodb').ObjectID
let router = express();
let db = require('../../db')
const { redisUtil } = require('../../redisclient/app')
const logger = require('../../tools/logger')
const util = require('../../tools/utilities')
const multer = require('multer');
const formData = multer({ dest: 'express/public/images/mixed/' });
const type = formData.single('image');
const fs = require('fs');
console.log(db)

router.use(requestIp.mw())

router.use(redisUtil)

router.post('/', (req, res) => {
    return new Promise(function (resolve, reject) {
        if (db[req.body.queryMethod] && req.body.queryData) {
            resolve(db[req.body.queryMethod](req.body.queryData, `${JSON.stringify(req.body)}`))
        }
        else {
            res.statusCode = 404;
            reject({ error: "query method or data invalid" })
        }
    })
        .then((o) => {
            logger.success({ date: new Date(), status: 'performed query for', body: req.body, from: req.headers['x-real-ip'] || req.connection.remoteAddress })
            if (o.code && o.code === 401) {
                res.send(o)
                return false
            }
            res.statusCode = 200;
            res.send(o)
        })
        .catch((e) => {
            logger.error({ date: new Date(), status: 'performed query for', body: req.body, from: req.headers['x-real-ip'] || req.connection.remoteAddress })
            logger.error({ date: new Date(), status: 'error', body: req.body, from: req.headers['x-real-ip'] || req.connection.remoteAddress, error: e })
            res.statusCode = 500;
            res.send({ error: 'Internal server error' })
        })

})

router.post('/uploads/images/:info', type, function (req, res) {
    let _id = new ObjectID()
    /** When using the "single"
    data come in "req.file" regardless of the attribute "name". **/
    let tmp_path = req.file.path;

    /** The original name of the uploaded file
        stored in the variable "originalname". **/
    let t = req.file.originalname.split('.')
    let target_path = `express/public/images/mixed/${_id}.${t[t.length - 1]}`;

    /** A better way to copy the uploaded file. **/
    return new Promise((resolve, reject) => {
        resolve(fs.createReadStream(tmp_path).pipe(fs.createWriteStream(target_path)))
    })
        .then(o => {
            return ;
        })
        .then(o => {
            fs.unlinkSync(tmp_path);
            res.send({ _id: _id,name:target_path.split('public')[1] })
        })
        .then(o => {
            return db.insertPhoto({
                _id:_id,
                b64: new Buffer(fs.readFileSync(req.file.path)).toString('base64'),
                info: req.params.info || 'info not specified',
                date: new Date()
            })
        })
        .catch(e => {
            console.log(e)
            res.statusCode = 500
            res.send({ state: 'internal server error' })
        })

});

module.exports = router
