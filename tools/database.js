'use strict'
let server = require('mongodb')
let moment = require('moment')
let mongodb = require('mongodb')
let ObjectID = require('mongodb').ObjectID

let {toSentanceCase,normalizeQuery} = require('./utilities')
const MongoDB=mongodb.Db
const Server=server.Server
/*
	ESTABLISH DATABASE CONNECTION
*/


let dbName = process.env.DB_NAME || 'Zemuldo-Main-Site';
let dbHost = process.env.DB_HOST || 'localhost'
let dbPort = process.env.DB_PORT || 27017

let db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1})
db.open((e, d)=>{
    if (e) {
        console.log(e)
    } else {
        console.log('DB Connected: connected to: "'+dbName+'"')
        // if (process.env.NODE_ENV == 'live') {
        //     db.authenticate('dil', 'omera', (e, res)=> {
        //         if (e) {
        //            throw new Error('mongo :: error: not authenticated-User Details Error', e)
        //         }
        //         else {
        //             throw new Error('mongo :: authenticated and connected to database :: "'+dbName+'"')
        //         }
        //     })
        // }
        // else{
        //     log.info('DB Connected: connected to: "'+dbName+'"')
        // }
    }
})

let posts = db.collection('posts')
let titles = db.collection('titles')
let visitors = db.collection('visitors')
let reviews = db.collection('reviews')

/* login validation methods */
module.exports = {
    addNewBlog: (newData) => {
        return new Promise(function (resolve,reject) {
        let date = new Date().toDateString()
        let _id = new ObjectID()
        let thisPost = {
            _id:_id,
            title:newData.title.toLocaleLowerCase(),
            date:date,
            body:newData.body,
            likes:1000000,
            type:newData.type,
            images:newData.images,
            author:newData.author
        }
        let thisTitle = {
            title:newData.title.toLocaleLowerCase(),
            date:date,
            likes:1000000,
            topics:newData.topics,
            type:newData.type,
            postID:_id
        }
        titles.findOne({title:thisPost.title}, (e, o)=> {

                if (e){
                    reject({error:e})
                }	else{
                    if(o){
                        reject({error:'Title: ' + newData.title + ' Exists in ' + newData.type})
                    }
                    else {
                        titles.insertOne(thisTitle, {safe: true}, function (e,o) {
                            if(e){
                                reject ({error:e})
                            }
                            else {
                                posts.insertOne(thisPost, function (e,o) {
                                    if(e){
                                        reject({error:'database error'})
                                    }
                                    else {
                                        resolve({state:'true'})
                                    }
                                });
                            }
                        });
                    }
                }
            })
        })
    .then(function (success) {
            return success
        })
            .catch(function (e) {
                return e
            })
    },
    addVisitor: (newData) => {
        return new Promise(function (resolve,reject) {
            let visitor = {
                sessionID:newData.sessionID,
                country:newData.country,
                countryCode:[newData.countryCode],
                ipAddress:newData.query,
                date:[new Date()],
                region:[newData.regionName],
                visits:1,
                network:[newData.isp]
            }
            visitors.findOne({sessionID:newData.sessionID},(e,o)=>{
                if(e){
                    reject(e)
                }
                else {
                    if(o){
                        let visits = o.visits +1
                        //o.region.push(newData.regionName)
                        o.visits +=1
                        o.network.push(newData.isp)
                        o.countryCode.push(newData.countryCode)
                        visitors.updateOne({_id:o._id},o, {upsert: true}, function (e,o) {
                            if(e){
                                reject ({error:e})
                            }
                            else {
                                let user = {
                                    sessionID:newData.sessionID,
                                    country:newData.country,
                                    region:newData.regionName,
                                    status:'known',
                                    visits:visits
                                }
                                resolve(user)
                            }
                        });
                    }
                    else {
                        visitors.insertOne(visitor, {safe: true}, function (e,o) {
                            if(e){
                                reject ({error:e})
                            }
                            else {
                                let user = {
                                    sessionID:newData.sessionID,
                                    country:newData.country,
                                    region:newData.regionName,
                                    status:"new",
                                    visits:1
                                }
                                resolve(user)
                            }
                        });
                    }

                }
            })

        })
            .then(function (success) {
                return success
            })
            .catch(function (e) {
                return e
            })
    },
    getBlog: (queryParam)=> {
        let validQuery = normalizeQuery(queryParam)
        return new Promise(function (resolve,reject) {
            posts.findOne(validQuery, (e, o)=> {
                if (e){
                    reject({error:'error in db'})
                }
                else{
                    if(o){
                        o.title = toSentanceCase(o.title)
                        resolve(o)
                    }
                    else {
                        reject({error:"not found"})
                    }
                }
            });
        })

    },
    addReview: (review)=> {
        return new Promise(function (resolve,reject) {
            reviews.insertOne(review, {safe: true}, function (e,o) {
                if(e){
                    reject ({error:e})
                }
                else {
                    resolve(true)
                }
            });
        })

    },
    getBlogs: (queryParam)=> {
        let validQuery = normalizeQuery(queryParam)
        return new Promise(function (resolve,reject) {
            posts.find(validQuery).toArray(function (e,ot) {
                let filtered = []
                let o = shuffle(ot)
                if(o.length<5){
                    for(let i=0;i<o.length;i++){
                        if(i===0){
                            o[i].title = toSentanceCase(o[i].title)
                            filtered.push(o[i])
                            continue
                        }
                        o[i].title = toSentanceCase(o[i].title)
                        o[i].body = o[i].body.slice(0,140)
                        filtered.push(o[i])
                    }
                    resolve(filtered)
                }
                else {
                    for(let i=0;i<5;i++){
                        o[i].title = toSentanceCase(o[i].title)
                        o[i].body = o[i].body.slice(0,140)
                        filtered.push(o[i])
                    }
                    resolve(filtered)
                }
            });
        })

    },
    getAllBlogs: ()=> {
        return new Promise(function (resolve,reject) {
            posts.find({}).toArray(function (e,o) {
                if(e){
                    reject(e)
                }
                else {
                    let filtered = []
                    if(o.length<5){
                        for(let i=0;i<o.length;i++){
                            if(i===0){
                                o[i].title = toSentanceCase(o[i].title)
                                filtered.push(o[i])
                                continue
                            }
                            o[i].title = toSentanceCase(o[i].title)
                            o[i].body = o[i].body.slice(0,140)
                            filtered.push(o[i])
                        }
                        resolve(shuffle(filtered))
                    }
                    else {
                        for(let i=0;i<5;i++){
                            if(i===0){
                                o[i].title = toSentanceCase(o[i].title)
                                filtered.push(o[i])
                                continue
                            }
                            o[i].title = toSentanceCase(o[i].title)
                            o[i].body = o[i].body.slice(0,140)
                            filtered.push(o[i])
                        }
                        resolve(shuffle(filtered))
                    }
                }
            });
        })

    },
    getFilterBlogs: (query)=> {
        let filter = query.filter
        delete query.filter
        let validQuery = normalizeQuery(query)
        return new Promise(function (resolve,reject) {
            posts.find(validQuery).toArray(function (e,o) {
                if(e){
                    reject(e)
                }
                else {
                    let blogs =[]
                    for(let i=0;i<o.length;i++){
                        let filters = filter.split(' ')
                        if(filters.length>1){
                            for(let j=0;j<filters.length;j++){
                                let index = o[i].title.toLowerCase().search(filters[j].toLowerCase())
                                if(index>0){
                                    if(blogs.length<1){
                                        o[i].title = toSentanceCase(o[i].title)
                                        blogs.push(o[i])
                                        break
                                    }
                                    else{
                                        o[i].title = toSentanceCase(o[i].title)
                                        o[i].body = o[i].body.slice(0,140)
                                        blogs.push(o[i])
                                        break
                                    }
                                }
                            }
                        }
                        else {
                            let index = o[i].title.toLowerCase().search(filters[0].toLowerCase())
                            if(!(index<0)){
                                if(blogs.length<1){
                                    o[i].title = toSentanceCase(o[i].title)
                                    blogs.push(o[i])
                                }
                                else{
                                    o[i].title = toSentanceCase(o[i].title)
                                    o[i].body = o[i].body.slice(0,140)
                                    blogs.push(o[i])
                                }
                            }
                        }
                    }
                    let filtered = []
                    if(blogs.length<5){
                        for(let i=0;i<blogs.length;i++){
                            o[i].title = toSentanceCase(o[i].title)
                            blogs[i].body = blogs[i].body.slice(0,140)
                            filtered.push(blogs[i])
                        }
                        resolve(shuffle(filtered))
                    }
                    else {
                        for(let i=0;i<5;i++){
                            o[i].title = toSentanceCase(o[i].title)
                            blogs[i].body = blogs[i].body.slice(0,140)
                            filtered.push(blogs[i])
                        }
                        resolve(shuffle(filtered))
                    }
                }
            })
        })

    }
}
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

