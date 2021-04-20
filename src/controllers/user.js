const User = require('../models/user');
const multer = require('multer');
const sharp = require('sharp');


const signUp = async (req, res) => {
    const user = new User(req.body);
    try {
        const token = await user.generateToken();
        await user.save();
        res.status(201).send({user, token});
    } catch (e) {
        res.status(400).send();
    }
};

const getInfo = async (req, res) => {
    res.send(req.user);
}

const getUserByEmail = async (req, res) => {
    try {
        const user = await User.findOne({email: (req.params.email).toLowerCase()});

        if (!user) {
            res.status(404).send();
        }
        res.status(200).send(user)
    } catch {
        res.status(500).send();
    }
}

const getProfilePic = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) {
            throw  new Error();
        }
        res.set('Content-Type', 'image/png');
        res.send(user.avatar);

    } catch (error) {
        res.status(404).send();
    }
}

const signIn = async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateToken();
        res.send({user, token});
    } catch (err) {
        res.status(400).send();
    }
}

const signOut = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.send();

    } catch (err) {
        res.status(500).send();
    }
}

const signOutAllDevices = async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();

    } catch (err) {
        res.status(500).send();
    }
}

const upload = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
            cb(new Error('File should be in form of jpg,png or jpeg'));
        }
        cb(undefined, true);
    }
});

const uploadAvatar = async (req, res) => {
    const buffer = await sharp(req.file.buffer).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
};

const updateUserInfo = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowed = ['name', 'age', 'email', 'password'];
    const isValidOperation = updates.every(update => {
        return allowed.includes(update)
    });
    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid update fields'})
    }
    try {
        updates.forEach(update => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user)
    } catch (e) {
        res.status(500).send();
    }

};

const errorHandling = (error, req, res, next) => {
    res.status(400).send({error: error.message});
}

const deleteUserAvatar = async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
};

const deleteUserById = async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    } catch (e) {
        res.status(500).send();
    }
};


module.exports = {
    signUp, getInfo, getProfilePic, signIn, signOut, signOutAllDevices, upload,
    uploadAvatar, updateUserInfo, deleteUserAvatar, deleteUserById, errorHandling,getUserByEmail
}