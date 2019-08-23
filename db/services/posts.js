const Post = require('../models/post')
const Draft = require('../models/draft')
const PostBody = require('../models/postBody')

module.exports = {
    get: async (params) => {
       return Post.find({}, [], { skip: parseInt(params.skip), limit: parseInt(params.limit) })
    },
    getDrafts:  async ()=>{
      return Draft.find({})
    },
    getLatest: async () => {
       const post = await Post.findOne({}).sort([['createdAt', -1]])
       const postBody = await PostBody.findOne({postId: post._id})
       return {post: post, postBody: postBody}
    },
    findById: async (id) => {
       const post = await Post.findById(id)
       const postBody = await PostBody.find({postId: id})
       return {post: post, postBody: postBody}
    },
    create: async (params) => {
        const post = new Post(params)
        const postBody = new PostBody({...params, postId: post._id})
        await post.save()
        await postBody.save()
        return {post: post, body:  postBody}
    },
    createDraft: async (params) => {
        const draft = new Draft(params)
        await draft.save()
        return draft
    }
}