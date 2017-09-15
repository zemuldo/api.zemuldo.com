'use strict'
let server = require('mongodb')
let moment = require('moment')
let mongodb = require('mongodb')

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

/* login validation methods */
module.exports = {
    addNewBlog: (newData) => {
        return new Promise(function (resolve,reject) {
        let date = new Date().toDateString()
        let thisPost = {
            title:newData.title,
            date:date,
            author:newData.author,
            body:newData.body,
            type:newData.type
        }
        let thisTitle = {
            title:newData.title,
            date:date,
        }
        titles.findOne({title:newData.title}, (e, o)=> {

                if (e){
                    console.log("**********DataBase Error********")
                    reject({error:e})
                }	else{
                    if(o){
                        console.log("**********Record Exists ********")
                        reject({error:'Title: ' + newData.title + ' Exists in ' + newData.type})
                    }
                    else {
                        titles.insertOne(thisTitle, {safe: true}, function (e,o) {
                            if(e){
                                console.log("**********DB Error ********")
                                reject ({error:e})
                            }
                            else {
                                posts.insertOne(thisPost, function (e,o) {
                                    console.log("**********Post Added ********")
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
            console.log(success)
            return success
        })
            .catch(function (e) {
                console.log(e)
                return e
            })
    },
    addVisitor: (newData) => {
        return new Promise(function (resolve,reject) {
            visitors.insertOne(newData, {safe: true}, function (e,o) {
                if(e){
                    console.log("**********DB Error ********")
                    reject ({error:e})
                }
                else {
                    resolve(true)
                }
            });
        })
            .then(function (success) {
                console.log(success)
                return success
            })
            .catch(function (e) {
                console.log(e)
                return e
            })
    },
    getBlog: (queryParam)=> {
        return new Promise(function (resolve,reject) {
            posts.findOne({title:queryParam.title}, (e, o)=> {
                if (e){
                    console.log(e)
                    reject({error:'error in db'})
                }
                else{
                    console.log(o)
                    resolve (o)
                }
            });
        })

    },
    getBlogs: (type)=> {
        return new Promise(function (resolve,reject) {
            posts.find({type:type}).toArray(function (e,o) {
                if(e){
                    reject(e)
                }
                else {
                    for(let i=1;i<o.length;i++){
                        o[i].body = o[i].body.slice(0,140)
                    }
                    resolve(o)
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
                    for(let i=0;i<o.length;i++){
                        o[i].body = o[i].body.slice(0,140)
                        filtered.push(o[i])
                    }
                    resolve(filtered)
                }
            });
        })

    },
    getFilterBlogs: (filter)=> {
        return new Promise(function (resolve,reject) {
            posts.find({}).toArray(function (e,o) {
                if(e){
                    reject(e)
                }
                else {
                    let blogs =[]
                    for(let i=0;i<o.length;i++){
                        let filters = filter.split(' ')
                        for(let j=0;j<filters.length;j++){
                            let index = o[i].title.toLowerCase().search(filters[j].toLowerCase())
                            if(index>=0){
                                if(blogs.length<1){
                                    blogs.push(o[i])
                                    break
                                }
                                else{
                                    o[i].body = o[i].body.slice(0,140)
                                    blogs.push(o[i])
                                    break
                                }
                            }
                        }
                    }

                    resolve(blogs)
                }
            })
        })

    }
}

