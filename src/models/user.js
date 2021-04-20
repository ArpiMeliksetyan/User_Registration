const mongoose = require('mongoose');
const validator = require('validator');
const Post = require('../models/post');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email')
            }
        }

    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
    },

    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw  new Error('Age should be grater than 0');
            }
        }
    },

    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }],
    avatar: {
        type: Buffer,
    }

}, {
    timestamps: true,

});

userSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'owner',
});

userSchema.methods.generateToken = async function () {
    const user = this;
    const token = jwt.sign({_id: user.id.toString()}, process.env.SECRET_WORD,{ expiresIn: '7200s' });
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
}

userSchema.statics.findByCredentials = async function (email, password) {

    const user = await User.findOne({email});
    if (!user) {
        throw new Error('Unable to log in')
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Incorrect password');
    }

    return user;

}

/**Encoding the password before saving a user*/
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
})

/**Delete user posts when user is removed*/
userSchema.pre('remove', async function (next) {

    const user = this;
    await Post.deleteMany({owner: user._id});
    next();
})

const User = mongoose.model('User', userSchema);


module.exports = User;