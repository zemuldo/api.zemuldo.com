const mongoose =  require('../mongoose.js')

const Schema = mongoose.Schema;
const postSchema = new Schema({
    authorId: { type: String, ref: 'User' , required: true},
    title: {type: String, required: true},
    coverPhotoUrl:{type: String, required: true},
    description: {type: String, required: true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false},

    deletedAt: {
        type: Date
    }
});

postSchema.index({"createdAt": 1});
postSchema.index({"updatedAt": 1});
postSchema.index({"postId": 1});

module.exports = mongoose.model('Post', postSchema);