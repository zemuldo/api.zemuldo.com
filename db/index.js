let postsUtil = require('./utils/posts')
let commentsUtil = require('./utils/comments')
let userUtils = require('./utils/users')

module.exports = Object.assign(
    {},
    postsUtil,
    commentsUtil,
    userUtils
)
