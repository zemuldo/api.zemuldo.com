const mongoose =  require('../mongoose.js')

const Schema = mongoose.Schema;
const userSchema = new Schema({
    joined: { type: Date, default: Date.now },
    lastActive: { type: Date, default: Date.now },

    disabled: { type: Boolean, default: false},
    deleted: { type: Boolean, default: false},

    deletedAt: {
        type: Date
    }
}, { strict: false });

module.exports = mongoose.model('User', userSchema);