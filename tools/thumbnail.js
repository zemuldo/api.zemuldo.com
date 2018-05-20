
'use strict';
const gm = require('gm');
const logger = require('./logger')

module.exports = {
    resize: (inputStream, format, toWidth, toHeight,blurL, blurR) => {
        return new Promise((resolve, reject) => {
            return gm(inputStream)
                .resize(toWidth, toHeight)
                .blur(blurL, blurR)
                .toBuffer(format, function (err, buffer) {
                    if (err) reject({error:'<p>thumbnail error</p>'});
                    resolve(buffer)
                })
        })
            .then(o => o)
            .catch(e => {
                logger.error(e)
               return { error:e.error || 'internal server error'}
            })
    }
}