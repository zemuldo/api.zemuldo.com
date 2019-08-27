const mongoose =  require('../mongoose.js')

const Schema = mongoose.Schema;
const postBodySchema = new Schema({
    postId: { type: String, ref: 'User' , required: true},
    body: {type: String, required: true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false},

    deletedAt: {
        type: Date
    }
});

postBodySchema.index({"createdAt": 1});
postBodySchema.index({"updatedAt": 1});
postBodySchema.index({"postId": 1});

module.exports = mongoose.model('PostBody', postBodySchema);