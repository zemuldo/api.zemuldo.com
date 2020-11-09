const Post = require('../models/post');
const Draft = require('../models/draft');
const PostBody = require('../models/postBody');
const isSameDate = require('../../tools/is_same_date');

module.exports = {
  get: async (params) => {
    let q = {};
    if (params.tag) q = {'tags.value': params.tag};
    return Post.find(q, [], {
      skip: parseInt(params.skip, 10),
      limit: parseInt(params.limit, 10),
      sort: {
        updatedAt: -1
      }
    });
  },
  getDrafts: async (authorId) => {
    return Draft.find({authorId});
  },

  getDraftById: async (id) => {
    return Draft.findById(id);
  },

  deleteDraft: async (id, authorId) => {
    return Draft.deleteOne({ _id: id, authorId });
  },
  getLatest: async () => {
    const post = await Post.findOne({}).sort([['createdAt', -1]]);
    const postBody = await PostBody.findOne({ postId: post._id });
    return { post: post, postBody: postBody };
  },
  findById: async (id) => {
    const post = await Post.findById(id);
    if (!post) return null;
    const postBody = await PostBody.findOne({ postId: post.id });
    return { post: post, postBody: postBody };
  },
  create: async (params) => {
    const post = new Post(params);
    const body = new PostBody({ ...params, postId: post._id });
    await post.save();
    await body.save();
    let draft = null;
    if (params.draftId) {
      draft = await Draft.remove({ _id: params.draftId });
    }
    return { post, body, draft };
  },

  deletePostById: async (id) => {
    const post = await Post.findById(id);

    if (!post) throw 'Deleting a post that doesn\'t exist.';

    const postBody = PostBody.findOne({ postId: post._id });

    return Promise.all([post.deleteOne(), postBody.deleteOne()]);

  },
  createDraft: async (params) => {
    const draft = new Draft(params);
    await draft.save();
    return draft;
  },
  updatePost: async (params) => {
    if (!params._id) throw Error('Update must come with _id');
    if (!params.update) throw Error('Update body must be sent');
    const post = await Post.updateOne({ _id: params._id }, params.update, { new: true });
    const postBody = await PostBody.updateOne({ postId: params._id }, params.update, { new: true });
    return { post, postBody };
  },
  updateDraft: async (params) => {
    if (!params._id) throw Error('Update must come with _id');
    if (!params.update) throw Error('Update body must be sent');
    const draft = await Draft.findById(params._id);

    if (draft.authorId !== params.authorId) throw Error('Unauthorized Access');

    if (!params.update.last_update) {
      const data = await draft.save();
      return { ...data._doc, rejected: true };
    }

    if (!isSameDate(params.update.last_update, draft.updatedAt)) {
      const data = await draft.save();
      return { ...data._doc, rejected: true };
    }

    draft.title = params.update.title;
    draft.body = params.update.body;
    draft.coverPhotoUrl = params.update.coverPhotoUrl;
    draft.description = params.update.description;
    draft.tags = params.update.tags;
    draft.updatedAt = Date.now();
    const data = await draft.save();
    return { ...data._doc, rejected: false };
  }
};