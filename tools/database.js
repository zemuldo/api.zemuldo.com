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
                    for(let i=1;i<o.length;i++){
                        o[i].body = o[i].body.slice(0,140)
                    }
                    resolve(o)
                }
            });
        })

    }
}

