const mongoose =  require('../mongoose.js')

const Schema = mongoose.Schema;
const draftSchema = new Schema({
    authorId: { type: String, ref: 'User' , required: true},
    title: {type: String, required: true},
    coverPhotoUrl:{type: String, required: true},
    description: {type: String, required: true},
    body: {type: String, required: true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false},

    deletedAt: {
        type: Date
    }
});

draftSchema.index({"createdAt": 1});
draftSchema.index({"updatedAt": 1});
draftSchema.index({"postId": 1});

module.exports = mongoose.model('Draft', draftSchema);