'use strict'
let schemas = require('../db/schemas/index')

function updateReplies(c, cs) {
    return new Promise(function (resolve, reject) {
        cs.forEach(function (thisC) {
            if (thisC._id == c.parent_id) {
                if (thisC.chat) {
                    thisC.chat.comments.push({
                        author: c.author,
                        mess: c.mess,
                        date: new Date(),
                        _id: c._id,
                        userID: c.userID
                    })
                }
                else {
                    thisC.chat = {
                        comments: [
                            {
                                author: c.author,
                                mess: c.mess,
                                date: new Date(),
                                _id: c._id,
                                userID: c.userID
                            }
                        ]
                    }
                }
            }
            if (thisC.chat) {
                updateReplies(c, thisC.chat.comments)
            }
        })
        resolve(cs)
    })
        .then(o => {
            return o
        })
        .catch(e => {
            console.log(e)
        })
}

function deleteComments(_id, cs) {
    return new Promise(function (resolve, reject) {
        cs.map(function (thisC, index) {
            if (thisC._id == _id) {
                cs.splice(index, 1)
                return true
            }
            if (thisC.chat) {
                deleteComments(_id, thisC.chat.comments)
            }
        })
        resolve(cs)
    })
        .then(o => {
            return o
        })
        .catch(e => {
            console.log(e)
        })
}

module.exports = {
    validatePost: (post) => {
        let validator = schemas.post
        return new Promise(function (resolve, reject) {
            if (post) {
                let state = {error: 'invalid data'}
                Object.keys(validator).forEach(function (prop) {
                    if (!post[prop]) {
                        reject({error: "No " + prop + " defined in post"})
                    }
                    else {
                        if (validator[prop].type !== typeof post[prop]) {
                            reject({error: 'Expecting ' + validator[prop].type + " on field " + prop + ' but got ' + typeof post[prop]})
                        }
                        else {
                            state = true
                        }
                    }
                })
                resolve(state)
            }
            else {
                reject({error: 'invalid data '})
            }
        })
            .then(function (success) {
                if (success) {
                    if (!(post.title.length > validator.title.minLen && post.title.length < validator.title.maxLen)) {
                        return {error: "title must be between " + validator.title.minLen + " and " + validator.title.maxLen + ' characters'}
                    }
                    if (!(validator.type[post.type])) {
                        return {error: "No category " + post.type}
                    }
                    if (post.author !== "Danstan Onyango") {
                        return {error: "User  " + post.author + " doesn't exist"}
                    }
                    return true
                }
            })
            .catch(function (err) {
                return err
            })
    },
    toSentanceCase: lower => {
        let arr = lower.split(' ')
        let o = []
        arr.forEach(function (elem) {
            if (elem) {
                let letters = elem.split('')
                letters[0] = letters[0]
                elem = letters.join('')
                o.push(elem)
            }
            else {
                console.log("----------------------------")
            }
        })
        return o.join(' ')
    },
    normalizeQuery: query => {
        Object.keys(query).forEach(function (prop) {
            if (typeof query[prop] === 'string') {
                query[prop] = query[prop].toLocaleLowerCase()
            }
        })

        return query
    },
    shuffle: (array) => {
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
    },
    updateReplies: updateReplies,
    deleteComments: deleteComments,
    setCors: (req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, Authorization, X-Requested-With, Content-Type, Accept');
        res.header('Allow-Control-Access-Method', 'POST');
        next();
    }


}