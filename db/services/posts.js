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

    getDraftById:  async (id)=>{
      return Draft.findById(id)
    },
    getLatest: async () => {
       const post = await Post.findOne({}).sort([['createdAt', -1]])
       const postBody = await PostBody.findOne({postId: post._id})
       return {post: post, postBody: postBody}
    },
    findById: async (id) => {
       const post = await Post.findById(id)
       const postBody = await PostBody.findOne({postId: post.id})
       return {post: post, postBody: postBody}
    },
    create: async (params) => {
        const post = new Post(params)
        const body = new PostBody({...params, postId: post._id})
        await post.save()
        await body.save()
        let draft = null
        if(params.draftId){
         draft = await Draft.remove({ _id: params.draftId })
        }
        return {post, body, draft}
    },
    createDraft: async (params) => {
        const draft = new Draft(params)
        await draft.save()
        return draft
    },
    updatePost: async (params) => {
        if(!params._id) throw Error('Update must come with _id')
        if(!params.update) throw Error('Update body must be sent')
         const post = await Post.updateOne({_id: params._id}, params.update, {new: true})
         const postBody = await PostBody.updateOne({postId: params._id}, params.update, {new: true})
         return {post, postBody}
     },
    updateDraft: async (params) => {
       if(!params._id) throw Error('Update must come with _id')
       if(!params.update) throw Error('Update body must be sent')
        const draft = await Draft.updateOne({_id: params._id}, params.update, {new: true})
        return draft
    }
}