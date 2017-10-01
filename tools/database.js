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

        .then(function (success) {
            return success
        })
        .catch(function (err) {
            return err
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
    publish: async (queryData) => {
        if(!queryData){
            return ({error:"invalid query params"})
        }
        if (!queryData.title) {
            return ({error:"no tittle sent"})
        }
        if (!queryData.body) {
            return ({error:"no body sent"})
        }
        if(!queryData.topics){
            return {error:'invalid topics data'}
        }
        if(!queryData.type){
            return {error:'invalid type data'}
        }
        if(!queryData.author){
            return {error:'invalid author data'}
        }
        let date = new Date().toDateString()
        let _id = new ObjectID()
        let thisPost = {
            _id: _id,
            date: date,
            body: queryData.body,
        }
        let thisTitle = {
            title: queryData.title.split(' '),
            date: date,
            likes: 0,
            topics: queryData.topics,
            type: queryData.type,
            post_ID: _id,
            author: queryData.author
        }
         return getNextIndex(indexCounters['blogIndex'])
             .then(function (counter) {
                 if(counter.error || counter.exeption){
                     return {error:"internal server error"}
                 }
                 if(!counter.value){
                     return {value:0}
                 }
                 else {
                     let nextIndexValue = counter.value
                     return {value:nextIndexValue.nextIndex}
                 }
             })
             .then(function (nextID) {
                 if(nextID.error){
                     return nextID
                 }
                 else {
                     thisPost.id = nextID.value
                     thisTitle.id = nextID.value
                    return titles.insertOne(thisTitle)
                 }
             })
             .then(function (success) {
                 if(!success.error || success.exception){
                     return posts.insertOne(thisPost)
                 }
                 else {
                     return success
                 }
             })
             .then(function (final) {
                 if(!final.error || final.exception){
                     if(final){
                         return {state:true}
                     }
                 }
             })
             .catch(function (error) {
                 return error
             })

    },
    addVisitor: (newData) => {
        if(newData.query){
            delete newData.query
        }
        return new Promise(function (resolve,reject) {
            if(!newData){
                reject ({error:"invalid data"})
            }
            if (!newData.sessionID) {
                reject ({error:"no sessionID sent"})
            }
            if(newData.sessionID ==='null'){
                reject ({error:"invalid data"})
            }
            if (!newData.country) {
                reject ({error:"no country sent"})
            }
            if(!newData.countryCode){
                reject({error:'invalid countryCode data'})
            }
            if(!newData.regionName){
                reject ({error:'invalid regionName data'})
            }
            if(!newData.isp){
                reject ({error:'invalid isp data'})
            }
            resolve(visitors.findOne({sessionID:newData.sessionID}))
        })
            .then(function (o) {
                if (o) {
                    let update = o
                    update.visits += 1
                    update.network.push(newData.isp)
                    update.countryCode.push(newData.countryCode)
                    return visitors.updateOne({_id: o._id}, update, {upsert: true})
                }
                else {
                    let visitor = {
                        sessionID: newData.sessionID,
                        country: newData.country,
                        countryCode: [newData.countryCode],
                        ipAddress: newData.query,
                        date: [new Date()],
                        region: [newData.regionName],
                        visits: 1,
                        network: [newData.isp]
                    }
                    return visitors.insertOne(visitor, {safe: true})
                }
            })
            .then(function (success) {
                return success
            })
            .catch(function (err) {
                return {error:err}
            })

    },
    newReview: (queryParam)=> {
        return new Promise(function (resolve,reject) {
            if(!queryParam){
                reject({error:"invalid query params"})
            }
            if (!queryParam.message) {
                reject({error:"no message sent"})
            }
            if (queryParam.message.length<3) {
                reject({error:"no message sent"})
            }
            resolve(reviews.insertOne(queryParam, {safe: true}))

            })
            .then(function (success) {
                return success
            })
            .catch(function (err) {
                return {error:err}
            })

    },
    getAllPosts: ()=> {
        return titles.find({}).sort({likes: -1}).limit(10).toArray()
            .then(function (o) {
                if(o){
                    for(let i=0;i<o.length;i++){
                        o[i].title =o[i].title.join(' ')
                    }
                    return o
                }
                else {
                    return []
                }
            })
            .catch(function (err) {
                return err
            })
    },

    getPost: (queryParam)=> {
       return new Promise(function (resolve,reject) {
           if(!queryParam){
               reject({error:"invalid query params"})
           }
           if (queryParam._id) {
               queryParam._id = ObjectID(queryParam._id)
           }
           if(queryParam.id){
               queryParam.id = Number(queryParam.id)
           }
           resolve(posts.findOne(queryParam))

       })
            .then(function (success) {
                if(success){
                    return success
                }
                else{
                    return {error:'no matches found'}
                }
            })
            .catch(function (error) {
                return error
            })
    },
    getPosts: (queryParam)=> {
        return new Promise(function (resolve,reject) {
            if(!queryParam){
                reject({error:"invalid query params"})
            }
            if(queryParam._id || queryParam.id){
                reject ({error:'unique supplied'})
            }
            else {
                resolve(titles.find(queryParam).toArray())
            }
        })

            .then(function (posts) {
                if(posts){
                    return posts
                }else {
                    return {error:"not found"}
                }
            })
            .catch(function (err) {
                return err
            })

    },
    getFiltered: (queryParam)=> {
        return new Promise(async function (resolve,reject) {
            if(!queryParam){
                reject ({error:"invalid query params"})
            }
            if (queryParam._id) {
                reject ({error:"unique supplied  for many"})
            }
            if(queryParam.id){
                reject ({error:"unique supplied  for many"})
            }
            if(queryParam._id || queryParam.id || typeof queryParam.filter!=='string'){
                reject ({error:'unique supplied'})
            }
            else {
                const filters = queryParam.filter.split(' ')
                delete queryParam.filter
                let unfiltered = await titles.find(queryParam).sort({likes:1}).limit(10).toArray()
                resolve([unfiltered,filters])
            }
        })
            .then(function (array) {
                let o = array[0]
                let filters =array[1]
                if(!o[0]){
                    return {data:[]}
                }
                else{
                    let blogs =[]
                    for(let i=0;i<o.length;i++){
                        if(filters.length>1){
                            for(let j=0;j<filters.length;j++){
                                let index = o[i].title.join(' ').search(filters[j].toLowerCase())
                                if(index>0){
                                    o[i].title =o[i].title.join(' ')
                                    blogs.push(o[i])
                                    break
                                }
                            }
                        }
                        else {
                            let index = o[i].title.join(' ').search(filters[0].toLowerCase())
                            if(!(index<0)){
                                o[i].title =o[i].title.join(' ')
                                blogs.push(o[i])
                            }
                        }
                    }
                    let filtered = []
                    if(blogs.length<5){
                        for(let i=0;i<blogs.length;i++){
                            filtered.push(blogs[i])
                        }
                        return (shuffle(filtered))
                    }
                    else {
                        for(let i=0;i<5;i++){
                            filtered.push(blogs[i])
                        }
                        return (shuffle(filtered))
                    }
                }
            })
            .catch(function (err) {
                return {error:err}
            })

    },
    getPostsTopic: (queryParam)=> {
        return new Promise(function (resolve,reject) {
            if(!queryParam){
                reject ({error:"invalid query params"})
            }
            if (queryParam._id) {
                reject ({error:"unique supplied  for many"})
            }
            if(queryParam.id){
                reject ({error:"unique supplied  for many"})
            }
            if(!queryParam.topic){
                reject ({error:'topic unspecified'})
            }
            resolve (titles.find({topics:queryParam.topic}).toArray())
        })
            .then(function (o) {
                return o
            })
            .catch(function (e) {
                return e
            })

    },
    getMostPop: (queryParam)=> {
        return new Promise(function (resolve,reject) {
            if(!queryParam){
                reject ({error:"invalid query params"})
            }
            if (queryParam._id) {
                reject ({error:"unique supplied  for many"})
            }
            if(queryParam.id){
                reject ({error:"unique supplied  for many"})
            }
            resolve(titles.find(queryParam).sort({likes: -1}).limit(1).toArray())
        })
            .then(function (success) {
                return success
            })
            .catch(function (err) {
                return err
            })

    },
    updateBlogLikes: (queryParam)=> {
        return new Promise(function (resolve,reject) {
            if(!queryParam ){
                reject ({error:"invalid query params"})
            }
            if (queryParam._id || !queryParam.id) {
                reject ({error:"no unique supplied  for one"})
            }
            if (queryParam._id) {
                queryParam._id = ObjectID(queryParam._id)
            }
            if(queryParam.id){
                queryParam.id = Number(queryParam.id)
            }
            resolve(titles.updateOne(queryParam, {$inc: {"likes": 1}}))

        })
            .then(function (success) {
                return success
            })
            .catch(function (err) {
                return err
            })
    }

}

module.exports = DB


