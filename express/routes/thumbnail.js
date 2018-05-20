'use strict'
const logger = require('../../tools/logger')
const express = require('express')
const router = express()
const request = require('request');
const { resize } = require('../../tools/thumbnail')

router.get('/image-thumbnail/:width/:height/:blurL/:blurR/:url(*)', function (req, res) {
    logger.status(`performng image resize for ${req.get('host')} ${req.originalUrl}`)
    return new Promise((resolve, reject) => {
        let url = req.params.url,
            toWidth = parseInt(req.params.width, 10),
            toHeight = parseInt(req.params.height, 10),
            blurL = parseInt(req.params.blurL, 10),
            blurR = parseInt(req.params.blurR, 10),
            format = req.headers.accept.match(/(png|jpg|jpeg|gif)/)[0] || url.match(/(png|jpg|jpeg|gif)/)[0];
        res.set('Content-Type', `image/${format}`);
        resolve(resize(request.get(url), format, toWidth, toHeight, blurL, blurR))
    })
        .then(o => {
            res.end(o)
            return true
        })
        .catch(e => {
            return false
        })
});

module.exports = router