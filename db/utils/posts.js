const Post = require('../models/post')
const PostBody = require('../models/postBody')
const Q = require('q')

module.exports = {
    get: async (params) => {
       return Post.find({}, [], { skip: parseInt(params.skip), limit: parseInt(params.limit) })
    },
    create: async (params) => {
        const post = new Post(params)
        const postBody = new PostBody({...params, postId: post._id})
        await post.save()
        await postBody.save()
        return {post: post, body:  postBody}
    }
}