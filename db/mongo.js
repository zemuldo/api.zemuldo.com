'use strict'
let server = require('mongodb')
let mongodb = require('mongodb')
const logger = require('../tools/logger')

let {
    updateReplies,
    deleteComments
} = require('../tools/utilities')
const MongoDB = mongodb.Db
const Server = server.Server
/*
	ESTABLISH DATABASE CONNECTION
*/

const indexCounters = {
    blogIndex: {
        name: 'blogIndex',
        description: 'This document contains the index of each unique BLOG in db. and stores the next Index in nextIndex',
        initDate: new Date()
    },
    userIndex: {
        name: 'userIndex',
        description: 'This document contains the index of each unique USER in db. and stores the next Index in nextIndex',
        initDate: new Date()
    },
    addsIndex: {
        name: 'addsIndex',
        description: 'This document contains the index of each unique ADVERTS in db. and stores the next Index in nextIndex',
        initDate: new Date()
    }
}
let dbName = process.env.DB_NAME || 'Zemuldo-Main-Site';
let dbHost = process.env.DB_HOST || 'localhost'
let dbPort = process.env.DB_PORT || 27017

let db = new MongoDB(dbName, new Server(dbHost, dbPort, {
    auto_reconnect: true
}), {
    w: 1
})

let counters = db.collection('counters')

const collections = {
    posts: db.collection('posts'),
    users: db.collection('users'),
    avatars: db.collection('avatars'),
    titles: db.collection('titles'),
    visitors: db.collection('visitors'),
    reviews: db.collection('reviews'),
    comments: db.collection('comments'),
    counters: db.collection('counters'),
    userLikes: db.collection('userLikes')
}

function InitCounter(indexObj) {
    collections.counters.findOneAndUpdate({
            "name": indexObj.name
        }, {
            $set: {
                "name": indexObj.name,
                initDate: new Date(),
                "description": indexObj.description,
                important: '!!!!!!!NEVER DELETE THIS DOCUMENT',
                nextIndex: 1
            }
        }, {
            $sort: {
                "nextIndex": 1
            },
            upsert: true,
            returnNewDocument: true
        })
        .then(function (success) {
            return success
        })
        .catch(function (err) {
            return err
        })

}

function getNextIndex(indexObj) {
    return new Promise(function (resolve, reject) {
            collections.counters.findOneAndUpdate({
                    "name": indexObj.name
                }, {
                    $set: {
                        "name": indexObj.name,
                        initDate: new Date(),
                        "description": indexObj.description,
                        important: '!!!!!!!NEVER DELETE THIS DOCUMENT'
                    },
                    $inc: {
                        nextIndex: 1
                    }
                }, {
                    sort: {
                        "nextIndex": 1
                    },
                    upsert: true,
                    returnNewDocument: true
                },
                function (e, o) {
                    if (e) {
                        reject(e)
                    } else {
                        resolve(o)
                    }
                });
        })
        .then(function (success) {
            return success
        })
        .catch(function (err) {
            return err
        })
}

function checkCounters() {
    let query = {
        $or: []
    }
    let i = 0;
    return new Promise(function (resolve, reject) {
            Object.keys(indexCounters).forEach(function (prop) {
                i++
                query.$or.push({
                    name: indexCounters[prop].name
                });
            })
            resolve(query)
        })
        .then(function (query) {
            return counters.find(query).toArray()
        })
        .then(function (o) {
            logger.status({
                mess: 'Checking database Indexing'
            })
            if (o.length === 0) {
                logger.status({
                    mess: 'Database Indexing not initialized',
                    next: 'Initializing database Indexing'
                })
                Object.keys(indexCounters).forEach(function (prop) {
                    InitCounter(indexCounters[prop])
                })
                logger.status({
                    mess: `DB Connected: connected to: ${dbName}`
                })
                return true
            } else if (i === o.length) {
                logger.info({
                    mess: 'DB counter initailaized already and fine'
                })
                logger.status({
                    mess: `DB Connected: connected to: ${dbName}`
                })
            } else {
                logger.error({
                    mess: `db counter init error`
                })
                process.exit(12);
                logger.error({
                    mess: `db counter init error`
                })
                process.exit(12);
            }
        })
        .then(o => {
            logger.info({
                mess: 'Creating Index on id field',
                task: 'Create Index'
            })
            return Promise.all([collections.posts.createIndex({
                id: -1
            }), collections.titles.createIndex({
                id: -1
            })])
        })
        .then(o => {
           logger.info({mess:'Created Index on id field'})
        })
        .catch(function (err) {
            logger.error({
                mess: `db counter init error`
            })
            process.exit(12);
        })

}

function dataURItoBlob(dataURI, callback) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    let byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    let bb = new Blob([ab]);
    return bb;
}

db.open((e, d) => {
    logger.db({
        task: 'Connecting to Mongodb',
        date: new Date(),
        task: 'Connecting'
    })
    if (e) {
        logger.error(e.error || e)
    } else {
        /*
        if (process.env.NODE_ENV == 'live') {
            db.authenticate('dil', 'omera', (e, res)=> {
                if (e) {
                   throw new Error('mongo :: error: not authenticated-User Details Error', e)
                }
                else {
                    throw new Error('mongo :: authenticated and connected to database :: "'+dbName+'"')
                }
            })
        }
        else{
            log.info('DB Connected: connected to: "'+dbName+'"')
        }*/
    }
    checkCounters()

})

module.exports = {
    db: db,
    indexCounters: indexCounters,
    getNextIndex: getNextIndex,
    collections: collections
};