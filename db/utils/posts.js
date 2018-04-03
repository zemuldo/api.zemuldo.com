const {db, getNextIndex, indexCounters} = require('../mongo')
const ObjectID = require('mongodb').ObjectID
const {redisClient, sub, pub} = require('../../redisclient/app')

const types = {
    dev: {
        name: 'Development',
        icon: 'code',
        topTitle: "Dev articles"
    },
    tech: {
        name: 'Technology',
        icon: 'server',
        topTitle: " Featured in Technology"
    },
    business: {
        name: 'Business',
        icon: 'creative commons',
        topTitle: " Popular in Bsuness"
    },
    reviews: {
        name: 'Reviews',
        icon: 'circle notched'
    },
    tuts: {
        name: 'Tutorials',
        icon: 'code',
        topTitle: " Popular Tutorials"
    }
}

const posts = db.collection('posts')
const titles = db.collection('titles')
const userLikes = db.collection('userLikes')
const photos = db.collection('photos')

module.exports = {
    updateBlog: (queryData) => {
        let bu = {};
        let tu = {}
        return new Promise((resolve,reject) => {
            if (queryData.update.body) {
                bu.body = queryData.update.body
                bu.wordCount = queryData.update.wordCount
            }
            if (queryData.update.body) {
                tu.title = queryData.update.title
                tu.about = queryData.update.about
                tu.wordCount = queryData.update.wordCount
                tu.updated = new Date()
            }

            resolve(Promise.all([
                posts.updateOne({_id: ObjectID(queryData._id)}, {$set: bu}, {upsert: false}),
                titles.updateOne({postID: ObjectID(queryData._id)}, {$set: tu}, {upsert: false})
            ]))
        })
            .then(function (o) {
                return o
            })
            .catch(function (error) {
                return error
            })
    },
    publish: (queryData) => {
        if (!queryData) {
            return ({error: "invalid query params"})
        }
        if (!queryData.title) {
            return ({error: "no tittle sent"})
        }
        if (!queryData.body) {
            return ({error: "no body sent"})
        }
        if (!queryData.topics) {
            return {error: 'invalid topics data'}
        }
        if (!queryData.about) {
            return {error: 'invalid about data'}
        }
        if (!queryData.type) {
            return {error: 'invalid type data'}
        }
        if (!queryData.wordCount) {
            return {error: 'invalid word count data'}
        }
        if (!queryData.author) {
            return {error: 'invalid author data'}
        }
        let date = new Date().toISOString()
        let _id = new ObjectID()
        let thisPost = {
            _id: _id,
            date: date,
            body: queryData.body
        }
        let thisTitle = {
            title: queryData.title,
            date: date,
            likes: 0,
            topics: queryData.topics,
            about: queryData.about,
            headerImage:queryData.headerImage,
            type: queryData.type,
            postID: _id,
            views:0,
            author: queryData.author,
            wordCount: queryData.wordCount
        }
        return getNextIndex(indexCounters['blogIndex'])
            .then(function (counter) {
                if (counter.error || counter.exeption) {
                    return {error: "database indexing error"}
                }
                if (!counter.value) {
                    return {value: 1}
                }
                else {
                    let nextIndexValue = counter.value
                    return {value: nextIndexValue.nextIndex}
                }
            })
            .then(function (nextID) {
                if (nextID.error) {
                    return nextID
                }
                else {
                    thisPost.id = nextID.value
                    thisTitle.id = nextID.value
                    return titles.insertOne(thisTitle)
                }
            })
            .then(function (success) {
                if (!success.error || success.exception) {
                    return posts.insertOne(thisPost)
                }
                else {
                    return success
                }
            })
            .then(function (final) {
                if (!final.error || final.exception) {
                    if (final) {
                        return {state: true}
                    }
                }
            })
            .catch(function (error) {
                return error
            })
    },
    deleteBlog: (queryParam) => {
        return new Promise(function (resolve, reject) {
            if (!queryParam) {
                reject({error: "invalid query params"})
            }
            if (!queryParam.id) {
                reject({error: "invalid query params"})
            }
            if (queryParam.id) {
                queryParam.id = Number(queryParam.id)
            }
            if (queryParam.id.toString() === 'NaN') {
                return {error: 'invalid id data'}
            }
            resolve(Promise.all([titles.removeOne(queryParam), posts.removeOne(queryParam)]))

        })
            .then(function (success) {
                return success
            })
            .catch(function (error) {
                return error
            })
    },
    getPosts: (queryParam, querykey) => {
        return new Promise(function (resolve, reject) {
            if (!queryParam) {
                reject({error: "invalid query params"})
            }
            if (queryParam._id || queryParam.id) {
                reject({error: 'unique supplied'})
            }
            if (queryParam.start) {
                queryParam.start = Number(queryParam.start)
            }
            if (queryParam.topics === 'all') {
                delete queryParam.topics
            }
            if (queryParam.type === 'home') {
                delete queryParam.type
            }
            let start = !queryParam.start ? 0 : queryParam.start.toString() === 'NaN' ? 0 : queryParam.start
            delete queryParam.start
            resolve(titles.find(queryParam).skip(start > 0 ? start : 0).limit(6).toArray())
        })
            .then(function (o) {
                if (o) {
                    redisClient.set(querykey, JSON.stringify(o),'EX', 3600)
                    pub.publish("blogs_cache", JSON.stringify({type:'blogs_cache', key:querykey,data:o, ttl:3600}));
                    return o
                } else {
                    return {error: "not found"}
                }
            })
            .catch(function (err) {
                return err
            })

    },
    getAllPosts: (queryParam, querykey) => {
        return new Promise(function (resolve, reject) {
            if (!queryParam) {
                reject({error: "invalid query params"})
            }
            if (queryParam.start) {
                queryParam.start = Number(queryParam.start)
            }
            let start = !queryParam.start ? 0 : queryParam.start.toString() === 'NaN' ? 0 : queryParam.start
            delete queryParam.start
            resolve(titles.find(queryParam).skip(start > 0 ? start : 0).limit(6).toArray())
        })
            .then(function (o) {
                if (o) {
                    redisClient.set(querykey, JSON.stringify(o),'EX', 3600)
                    pub.publish("blogs_cache", JSON.stringify({type:'blogs_cache', key:querykey,data:o, ttl:3600}));
                    return o
                }
                else {
                    return [];
                }

            })
            .catch(function (err) {
                return err
            })
    },
    getPagedPosts: (queryParam, querykey) => {
        return new Promise(function (resolve, reject) {
            if (!queryParam) {
                reject({error: "invalid query params"})
            }
            if (!queryParam) {
                reject({error: "invalid query params"})
            }
            if (queryParam.start) {
                queryParam.start = Number(queryParam.start)
            }
            let start = !queryParam.start ? 0 : queryParam.start.toString() === 'NaN' ? 0 : queryParam.start;
            delete queryParam.start;
            if (queryParam.topics === 'all') {
                delete queryParam.topics
            }
            resolve(titles.find(queryParam).skip(start > 0 ? start : 0).limit(6).toArray())
        })
            .then(function (o) {
                redisClient.set(querykey, JSON.stringify(o), 'EX', 3600)
                if (o) {
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
    getPost: (queryParam, querykey) => {
        return new Promise(function (resolve, reject) {
            if (!queryParam) {
                reject({error: "invalid query params"})
            }
            if (queryParam._id) {
                queryParam._id = ObjectID(queryParam._id)
            }
            if (queryParam.id) {
                queryParam.id = Number(queryParam.id)
            }
            resolve(posts.findOne(queryParam))

        })
            .then(function (success) {
                if (success) {
                    redisClient.set(querykey, JSON.stringify(success), 'EX', 3600)
                    return success
                }
                else {
                    return {error: 'no matches found'}
                }
            })
            .catch(function (error) {
                return error
            })
    },
    getPostDetails: (queryParam, querykey) => {
        return new Promise(function (resolve, reject) {
            if (!queryParam) {
                reject({error: "invalid query params"})
            }
            if (queryParam._id) {
                queryParam._id = ObjectID(queryParam._id)
            }
            if (queryParam.id) {
                queryParam.id = Number(queryParam.id)
            }
            resolve(titles.findOne(queryParam))
        })
            .then(function (o) {
                if (o) {
                    redisClient.set(querykey, JSON.stringify(o), 'EX', 3600)
                    return o
                } else {
                    return {error: "not found"}
                }
            })
            .catch(function (error) {
                return error
            })
    },
    getFiltered: (queryParam) => {
        return new Promise(async function (resolve, reject) {
            if (!queryParam) {
                reject({error: "invalid query params"})
            }
            if (queryParam._id) {
                reject({error: "unique supplied  for many"})
            }
            if (queryParam.id) {
                reject({error: "unique supplied  for many"})
            }
            if (queryParam._id || queryParam.id || typeof queryParam.filter !== 'string') {
                reject({error: 'unique supplied'})
            }
            let r = new RegExp(queryParam.filter, "i");
            if (queryParam.start) {
                queryParam.start = Number(queryParam.start)
            }
            if (queryParam.topics === 'all') {
                delete queryParam.topics
            }
            let start = !queryParam.start ? 0 : queryParam.start.toString() === 'NaN' ? 0 : queryParam.start
            delete queryParam.start
            resolve(titles.find({title: {$regex: r}}).skip(start > 0 ? start : 0).limit(6).toArray())
        })
            .then(function (o) {
                return o
            })
            .catch(function (e) {
                return e
            })
    },
    getPostsTopic: (queryParam) => {
        return new Promise(function (resolve, reject) {
            if (!queryParam) {
                reject({error: "invalid query params"})
            }
            if (queryParam._id) {
                reject({error: "unique supplied  for many"})
            }
            if (queryParam.id) {
                reject({error: "unique supplied  for many"})
            }
            if (!queryParam.topic) {
                reject({error: 'topic unspecified'})
            }
            if (!types[queryParam.type]) {
                delete queryParam.type
            }
            if (queryParam.start) {
                queryParam.start = Number(queryParam.start)
            }
            if (queryParam.topics === 'all') {
                delete queryParam.topics
            }
            let start = !queryParam.start ? 0 : queryParam.start.toString() === 'NaN' ? 0 : queryParam.start
            delete queryParam.start
            resolve(titles.find({
                topics: queryParam.topic,
                type: queryParam.type
            }).skip(start > 0 ? start : 0).limit(6).toArray())
        })
            .then(function (o) {
                return o
            })
            .catch(function (e) {
                return e
            })
    },
    getMostPop: (queryParam) => {
        return new Promise(function (resolve, reject) {
            if (!queryParam) {
                reject({error: "invalid query params"})
            }
            if (queryParam._id) {
                reject({error: "unique supplied  for many"})
            }
            if (queryParam.id) {
                reject({error: "unique supplied  for many"})
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
    updateBlogLikes: (queryParam) => {
        return new Promise(function (resolve, reject) {
            if (!queryParam) {
                reject({error: "invalid query params"})
            }
            if (!queryParam.title) {
                reject({error: "error in blog tittle"})
            }
            if (queryParam._id || !queryParam.id) {
                reject({error: "no unique supplied  for one"})
            }
            if (!queryParam.userID) {
                reject({error: "unauthorized user"})
            }
            if (queryParam._id) {
                queryParam._id = ObjectID(queryParam._id)
            }
            if (queryParam.id) {
                queryParam.id = Number(queryParam.id)
            }
            if (queryParam.userID) {
                queryParam.userID = Number(queryParam.userID)
            }
            resolve(userLikes.findOne({userID: queryParam.userID}))
        })
            .then(function (success) {
                if (!success) {
                    let like = {
                        userID: queryParam.userID,
                        blogs: {[queryParam.id]: {date: new Date().toDateString(), titles: queryParam.title}}
                    }
                    return userLikes.insertOne(like)
                }
                else {

                    if (success.blogs[queryParam.id]) {
                        return {state: false}
                    }
                    else {
                        success.blogs[queryParam.id] = {date: new Date().toDateString(), titles: queryParam.title}
                        return userLikes.updateOne(
                            {userID: queryParam.userID},
                            {$set: success}
                        )
                    }
                }
            })
            .then(function (success) {
                if (!success) {
                    return {state: false}
                }
                if (success.state === false) {
                    return success
                }
                return titles.updateOne({id: queryParam.id}, {$inc: {"likes": 1}})
            })
            .then(function (final) {
                return final
            })
            .catch(function (err) {
                return {error: err, code: 500}
            })
    },
    getLike: (queryParam) => {
        return new Promise(function (resolve, reject) {
            if (!queryParam) {
                reject({error: "invalid query params"})
            }
            if (!queryParam.postID) {
                reject({error: "error in blog tittle"})
            }
            if (!queryParam.userID) {
                reject({error: "no unique supplied  for one"})
            }
            if (queryParam.user_ID) {
                queryParam.user_ID = ObjectID(queryParam.user_ID)
            }
            if (queryParam.userID) {
                queryParam.userID = Number(queryParam.userID)
            }
            if (queryParam.postID) {
                queryParam.postID = Number(queryParam.postID)
            }
            resolve(userLikes.findOne({userID: queryParam.userID}))
        })
            .then(function (success) {
                if (!success) {
                    return {state: false}
                }
                if (success.blogs[queryParam.postID]) {
                    return {state: true}
                }
                else {
                    return {state: false}
                }
            })
            .catch(function (err) {
                return err
            })

    },
    updateViews:(queryData)=>{
        return new Promise((resolve,reject)=>{
            if(!queryData._id){
                reject({error:'query params missing'})
            }
            if(queryData._id){
                queryData._id = ObjectID(queryData._id)
            }
            resolve(titles.updateOne({_id: queryData._id}, {$inc: {'views': 1} },{upsert:true}))
        })
        .then(o=>{
            return o
        })
        .catch(e=>{
            return e
        })
    },
    insertPhoto:(image)=>{
        photos.insertOne(image)
        .then(o=>{
            return o
        })
        .catch(e=>{
            console.log(e)
            return e
        })
    }
}
