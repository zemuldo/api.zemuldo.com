'use strict'
const {db, getNextIndex} = require('../mongo')
const ObjectID = require('mongodb').ObjectID
const crypto = require('crypto')
const fs = require('fs')

const users = db.collection('users')
const avatars = db.collection('avatars')
const visitors = db.collection('visitors')
let reviews = db.collection('reviews')

module.exports = {
    registerUser: (queryData) => {
        let user;
        let _id = new ObjectID()
        let avatar;
        let imgStr;
        return new Promise(async function (resolve, reject) {
            if (!queryData) {
                reject({error: "invalid query params"})
            }
            if (!queryData.firstName) {
                reject({error: "no firstName sent"})
            }
            if (!queryData.lastName) {
                reject({error: "no lastName sent"})
            }
            if (!queryData.userName) {
                reject({error: 'invalid userName data'})
            }
            if (!queryData.email) {
                reject({error: 'invalid email data'})
            }
            if (!queryData.password) {
                reject({error: 'invalid password data'})
            }
            if (!queryData.avatar) {
                reject({error: 'invalid imagePreviewUrl data'})
            }
            let date = new Date()
            let password = crypto.createHash('sha256').update(queryData.password).digest().toString('hex');
            imgStr = JSON.parse(queryData.avatar)
            let av = {
                rect: imgStr.rect,
                width: imgStr.width,
                height: imgStr.height,
                borderRadius: imgStr.borderRadius,
                scale: imgStr.scale
            };
            user = {
                _id: _id,
                firstName: queryData.firstName,
                lastName: queryData.lastName,
                userName: queryData.userName.toLowerCase(),
                email: queryData.email.toLowerCase(),
                password: password,
                avatar: av,
                created: date.toISOString(),
                date:new Date(),
                errors: {}
            }
            avatar = {
                imageURL: queryData.avatar,
                userName: queryData.userName,
                id: queryData.id
            }

            resolve(getNextIndex(indexCounters['userIndex']))
        })
            .then(function (counter) {
                if (counter.error || counter.exeption) {
                    return {error: "internal server error", code: 500}
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
                    queryData.id = nextID.value
                    user.id = nextID.value;
                    return Promise.all([users.findOne({email: user.email}), users.findOne({userName: user.userName})])
                }
            })
            .then(function (success) {
                if (success[0]) {
                    return {error: "email taken", code: 406}
                }
                if (success[1]) {
                    return {error: "username taken", code: 406}
                }
                if (!success[0] && !success[1] && !success.err) {
                    let format = imgStr.img.split(';base64')[0].split('/')[1]
                    let file = './express/public/avatars/' + _id + '.' + format
                    user.avatarURL = '/avatars/' + _id + '.' + format
                    fs.writeFile(file, imgStr.img.split(';base64,').pop(), 'base64', function (e) {
                        if (e) {
                            console.log(e);
                            user.errors.pics = false
                        }
                    });
                    return Promise.all([users.insertOne(user), avatars.insertOne(avatar)])
                }
                else {
                    return {error: "username or email taken", code: 406}
                }
            })
            .then(function (final) {
                if (!final.error || final.exception) {
                    if (final) {
                        return {state: true, code: 200}
                    }
                }
                else {
                    return final
                }
            })
            .catch(function (error) {
                if (error.code) {
                    return error
                }
                else {
                    error.code = 500;
                    error.info = 'internal server error'
                    return error
                }
            })
    },
    loginUser: (queryParam) => {
        return new Promise(function (resolve, reject) {
            if (!queryParam && !queryParam.dara) {
                reject({error: "invalid query params", code: 304})
            }
            if (queryParam._id) {
                queryParam._id = ObjectID(queryParam._id)
            }
            if (queryParam.id) {
                queryParam.id = Number(queryParam.id)
            }
            if (queryParam.userName) {
                queryParam.userName = queryParam.userName.toLowerCase()
            }

            resolve(users.findOne({userName: queryParam.userName}))

        })
            .then(function (success) {
                let password = crypto.createHash('sha256').update(queryParam.password).digest().toString('hex');
                if (success) {
                    if (success.password == password) {
                        let user = {};
                        Object.assign(user, success)
                        user.password = null
                        return success
                    }
                    else {
                        return {error: 'Invalid Username or password', code: 404}
                    }
                }
                else {
                    return {error: 'Account not found, Signup Now', code: 404}
                }
            })
            .catch(function (error) {
                if (error.code) {
                    return error
                }
                else {
                    return {error: 'Internal Server Error, try later', code: 500}
                    return error
                }
            })
    },
    validateUser: (queryParam) => {
        return new Promise(function (resolve, reject) {
            if (!queryParam) {
                reject({error: "invalid query params", code: 500})
            }
            if (!queryParam._id) {
                reject({error: "invalid query params", code: 500})
            }
            if (!queryParam.id) {
                reject({error: "invalid query params", code: 500})
            }
            if (!queryParam.userName) {
                reject({error: "invalid query params", code: 500})
            }
            if (queryParam._id) {
                queryParam._id = ObjectID(queryParam._id)
            }
            if (queryParam.id) {
                queryParam.id = Number(queryParam.id)
            }
            if (queryParam.userName) {
                queryParam.userName = queryParam.userName.toLowerCase()
            }
            if (queryParam.id.toString() === 'NaN') {
                return {error: 'invalid id data'}
            }
            resolve(users.findOne({userName: queryParam.userName, id: queryParam.id, _id: queryParam._id}))

        })
            .then(function (success) {
                if (success) {
                    return {state: true}
                }
                else {
                    return {state: false}
                }
            })
            .catch(function (error) {
                if (error.code) {
                    return error
                }
                else {
                    error.code = 500
                    return {state: false}
                }
            })
    },
    getAvatar: (queryParam) => {
        return new Promise(function (resolve, reject) {
            if (!queryParam) {
                reject({error: "invalid query params"})
            }
            if (!queryParam._id && !queryParam.id) {
                reject({error: "invalid query params"})
            }
            if (queryParam._id) {
                queryParam._id = ObjectID(queryParam._id)
            }
            if (queryParam.id) {
                queryParam.id = Number(queryParam.id)
            }
            resolve(avatars.findOne(queryParam))

        })
            .then(function (success) {
                if (success) {
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
    addVisitor: (newData) => {
        return new Promise(function (resolve, reject) {
            if (!newData) {
                reject({error: "invalid data"})
            }
            if (!newData.sessionID) {
                reject({error: "no sessionID sent"})
            }
            if (newData.sessionID === 'null') {
                reject({error: "invalid data"})
            }
            if (!newData.country) {
                reject({error: "no country sent"})
            }
            if (!newData.countryCode) {
                reject({error: 'invalid countryCode data'})
            }
            if (!newData.regionName) {
                reject({error: 'invalid regionName data'})
            }
            if (!newData.isp) {
                reject({error: 'invalid isp data'})
            }
            resolve(visitors.findOne({sessionID: newData.sessionID}))
        })
            .then(function (o) {
                if (o) {
                    let update = o
                    if (!o.user) {
                        if (o.user.id === 0)
                            update.user = newData.user
                        else {
                            update['account' + new Date().toDateString()] = newData.user
                        }
                    }

                    update.visits += 1
                    update.network.push(newData.isp)
                    update.countryCode.push(newData.countryCode)
                    return visitors.updateOne({_id: o._id}, update, {upsert: true})
                }
                else {
                    let visitor = {
                        user: newData.user,
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
                return {sessionID: newData.sessionID,}
            })
            .catch(function (err) {
                return {error: err}
            })

    },
    newReview: (queryParam) => {
        return new Promise(function (resolve, reject) {
            if (!queryParam) {
                reject({error: "invalid query params"})
            }
            if (!queryParam.message) {
                reject({error: "no message sent"})
            }
            if (queryParam.message.length < 3) {
                reject({error: "no message sent"})
            }
            resolve(reviews.insertOne(queryParam, {safe: true}))

        })
            .then(function (success) {
                return success
            })
            .catch(function (err) {
                return {error: err}
            })

    }
}





