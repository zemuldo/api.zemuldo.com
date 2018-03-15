const {db} = require('../mongo')
const comments = db.collection('comments')
const ObjectID = require('mongodb').ObjectID

module.exports = {
    comment: (queryData) => {
        let postID
        let c
        return new Promise(function (resolve, reject) {
            if (!queryData.postID || !queryData.mess || !queryData.author) {
                reject({error: 'invalid or missing data, check docs'})
            }
            c = {
                author: queryData.author,
                mess: queryData.mess,
                date: new Date(),
                _id: new ObjectID(),
                userID: queryData.userID
            }
            postID = ObjectID(queryData.postID)
            queryData.date = new Date()
            resolve(comments.findOne({postID: ObjectID(queryData.postID)}))

        })

            .then(function (o) {
                if (o) {
                    return comments.updateOne(
                        {postID: postID},
                        {$push: {comments: c}}
                    )
                }
                else {
                    return comments.insertOne({comments: [c], postID: postID})
                }
            })
            .then(o => {
                return c
            })
            .catch(function (e) {
                console.log(e)
                return e
            })
    },
    replyComment: (queryData) => {
        let postID
        let c
        let _id = new ObjectID()
        return new Promise(function (resolve, reject) {
            if (!queryData.postID || !queryData.mess || !queryData.author) {
                reject({error: 'invalid or missing data, check docs'})
            }
            c = {
                author: queryData.author,
                mess: queryData.mess,
                date: new Date(),
                _id: _id,
                parent_id: queryData.parent_id,
                userID: queryData.userID
            }
            postID = ObjectID(queryData.postID)
            resolve(comments.findOne({postID: ObjectID(queryData.postID)}))
        })

            .then(function (o) {
                if (!o) {
                    return {'error': 'non existing comment'}
                }
                else {
                    let comments = o.comments
                    return updateReplies(c, comments)
                }
            })
            .then(o => {
                return comments.updateOne({postID: postID}, {$set: {comments: o}}, {upsert: false})
            })
            .then(o => {
                return {_id: _id}
            })
            .catch(function (e) {
                console.log(e)
                return e
            })
    },
    deleteComment: (queryData) => {
        let postID;
        return new Promise(function (resolve, reject) {
            if (!queryData.postID || !queryData._id) {
                reject({error: 'invalid or missing data, check docs'})
            }
            postID = ObjectID(queryData.postID)
            resolve(comments.findOne({postID: postID}))
        })

            .then(function (o) {
                if (!o) {
                    return {'error': 'non existing comment'}
                }
                else {
                    let comments = o.comments
                    return deleteComments(queryData._id, comments)
                }
            })
            .then(o => {
                return comments.updateOne({postID: postID}, {$set: {comments: o}}, {upsert: false})
            })
            .then(o => {
                return o
            })
            .catch(function (e) {
                console.log(e)
                return e
            })
    },
    getComments: (queryData) => {
        if (queryData.postID) {
            queryData.postID = ObjectID(queryData.postID)
        }

        return comments.findOne(queryData)

            .then(function (o) {
                if (!o) {
                    return {comments: []};
                }
                else {
                    return o
                }
            })
            .catch(function (e) {
                console.log(e)
                return e
            })
    }
}