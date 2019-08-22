const mongoose =  require('../mongoose.js')

const Schema = mongoose.Schema;
const postBodySchema = new Schema({
    postId: { type: String, ref: 'User' , required: true},
    body: {type: String, required: true},
    createdAt: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false},

    deletedAt: {
        type: Date
    }
});

module.exports = mongoose.model('PostBody', postBodySchema);