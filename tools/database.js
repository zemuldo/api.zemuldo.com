'use strict'
let server = require('mongodb')
let moment = require('moment')
let mongodb = require('mongodb')
let ObjectID = require('mongodb').ObjectID

let {toSentanceCase,normalizeQuery,shuffle} = require('./utilities')
const MongoDB=mongodb.Db
const Server=server.Server
/*
	ESTABLISH DATABASE CONNECTION
*/

let indexCounters = {
    blogIndex:{
        name:'blogIndex',
        description:'This document contains the index of each unique BLOG in db. and stores the next Index in nextIndex',
        initDate:new Date()
    },
    userIndex:{
        name:'userIndex',
        description:'This document contains the index of each unique USER in db. and stores the next Index in nextIndex',
        initDate:new Date()
    },
    addsIndex:{
        name:'userIndex',
        description:'This document contains the index of each unique ADVERTS in db. and stores the next Index in nextIndex',
        initDate:new Date()
    }
}
let dbName = process.env.DB_NAME || 'Zemuldo-Main-Site';
let dbHost = process.env.DB_HOST || 'localhost'
let dbPort = process.env.DB_PORT || 27017

let db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1})
let posts = db.collection('posts')
let titles = db.collection('titles')
let visitors = db.collection('visitors')
let reviews = db.collection('reviews')
let richText = db.collection('richText')
let counters = db.collection('counters')

function InitCounter(indexObj){
    return  Promise.all([
        counters.findOneAndUpdate(
            { "name" : indexObj.name },
            { $set: { "name" : indexObj.name, initDate:new Date() ,"description":indexObj.description,important:'!!!!!!!NEVER DELETE THIS DOCUMENT'}},
            { sort: { "nextIndex" : 1 }, upsert:true, returnNewDocument : true },
            function (e,o) {
                if(e){
                    return (e)
                }
                else {
                    return (o)
                }
            })
    ])

}

function getNextIndex(indexObj) {
    return new Promise(function (resolve,reject) {
        counters.findOneAndUpdate(
            { "name" : indexObj.name },
            { $set: { "name" : indexObj.name, initDate:new Date() ,"description":indexObj.description,important:'!!!!!!!NEVER DELETE THIS DOCUMENT'}, $inc : { "nextIndex" : 1 } },
            { sort: { "nextIndex" : 1 }, upsert:true, returnNewDocument : true },
            function (e,o) {
                if(e){
                    reject (e)

                }
                else {
                    resolve(o)

                }
            });
    })
}



db.open((e, d)=>{
    console.log("****Connecting to DB****")
    if (e) {
        console.log(e)
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

    console.log("****Initializing database Indexing****")
    Object.keys(indexCounters).forEach(function(prop) {
        InitCounter(indexCounters[prop])
    })
    console.log('DB Connected: connected to: "'+dbName+'"')

})


let DB = {
    newPost: (newData) => {
            if (newData.query) {
                delete newData.query
            }
            let id = getNextIndex(indexCounters['blogIndex'])
            console.log(id)
            let date = new Date().toDateString()
            let _id = new ObjectID()

            let thisPost = {
                _id: _id,
                title: newData.title.split(' '),
                date: date,
                body: newData.body,
                likes: 0,
                type: newData.type,
                images: newData.images,
                author: newData.author,
                topics: newData.topics,
            }
            let thisTitle = {
                title: newData.title.split(' '),
                date: date,
                likes: 0,
                topics: newData.topics,
                type: newData.type,
                postID: _id,
                author: newData.author
            }
           return titles.findOne({title: thisPost.title})
                .then(function (title) {
                    if (title) {
                        console.log(title)
                        return {err: "Tittle " + newData.title + ' exists'}
                    }
                    else {
                        return titles.insertOne(thisTitle, {safe: true})
                    }
                })
                .then(function (success) {
                    console.log(success)
                    if (!success.err) {
                        return posts.insertOne(thisPost, {safe: true})
                    }
                    else {
                        return success
                    }
                })
                .then(function (final) {
                    console.log(final)
                    return final

                })
                .catch(function (e) {
                    return e
                })

    },
}

module.exports = DB


