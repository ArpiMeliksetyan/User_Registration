const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({

    description: {
        type: String,
        required: true,
        trim: true,
    },
    public: {
        type: Boolean,
        default: false,
    },
    photos: [{
        title: String,
       content: {
            type: Buffer,
       }
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },

}, {
    timestamps: true,
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;