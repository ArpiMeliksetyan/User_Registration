const Post = require('../models/post');
const multer = require('multer');


const getAllPosts = async (req, res) => {
    const match = {};
    const sort = {};

    if (req.query.public) {
        match.public = req.query.public === 'true';
    }

    if (req.query.sortBy) {
        const splited = req.query.sortBy.split(':');
        sort[splited[0]] = splited[1] === 'desc' ? -1 : 1;
    }

    try {
        await req.user.populate({
            path: 'posts',
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort,
            },

            match,
        }).execPopulate();
        res.send(req.user.posts)
    } catch (e) {
        console.log(e)
        res.status(500).send();
    }
};

const getAllUsersPosts = async (req, res) => {
    try {
        const posts = await Post.find({});
        res.send(posts);
    } catch (e) {
        res.status(500).send();
    }
};

const getAllUserRecentlyPosts = async (req, res) => {
    let obj = [];
    const day = req.params.id;
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    try {
        const posts = await Post.find({});

        for (let key in posts) {
            let createDate = posts[key].createdAt;

            createDate = JSON.stringify(createDate).split('T')[0];

            let differenceInTime = new Date(today) - new Date(createDate);

            let differenceInDays = differenceInTime / (1000 * 3600 * 24);
            if (differenceInDays <= day) {
                obj.push(posts[key]);
            }
        }
        res.send(obj);
    } catch (e) {
        res.status(500).send();
    }
};

const getPostById = async (req, res) => {

    const _id = req.params.id;
    try {
        const post = await Post.findOne({_id, owner: req.user._id})

        if (!post) {
            return res.status(404).send();
        }
        res.send(post)
    } catch (e) {
        res.status(500).send();
    }
};

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


const errorHandling = (error, req, res, next) => {
    res.status(400).send({error: error.message});
};

const createPost = async (req, res) => {
    let photo = req.files.map((el) => {
        return {
            title: el.originalname,
            content: el.buffer,
        }
    });

    const post = new Post({
        description: req.body.description,
        public: req.body.public,
        photos: photo,
        owner: req.user._id,
    });
    try {
        await post.save();
        res.status(201).send(post);
    } catch (e) {
        res.status(400).send();
    }
};

const updatePost = async (req, res) => {
    let photo = req.files.map((el) => {
            return {
                title: el.originalname,
                content: el.buffer,
            }
        }
    );

    let index = req.params.index;
    let updatedFields = {
        description: req.body.description,
        public: req.body.public,
        photos: photo,
    };

    let updated = {};
    for (let key in updatedFields) {
        if (updatedFields[key]) {
            updated[key] = updatedFields[key]
        }
    }
    try {
        const post = await Post.findOne({_id: req.params.id, owner: req.user._id});
        if (!post) {
            return res.status(404).send();
        }

        Object.keys(updated).forEach(el => {
            if (updated.hasOwnProperty('photos')) {
                post[el][index].title = photo[0].title;
                post[el][index].buffer = photo[0].buffer;
            }
            post[el] = updated[el];

        });

        await post.save();
        res.send(post);

    } catch (e) {
        res.status(400).send();
    }

};

const searchByDescription = async (req, res) => {

    try {
        const post = await Post.find({owner: req.user._id});
        if (!post) {
            return res.status(404).send();
        }
        const posts = post.filter(el => {
            return el.description.includes(req.params.key);
        })
        res.status(200).send(posts);
    } catch (err) {
        res.status(500).send();
    }
}

const deletePostPhotoById = async (req, res) => {
    try {
        const post = await Post.findOne({_id: req.params.id, owner: req.user._id});
        const photos = post.photos;
        let deleted;
        let index;
        for (let i = 0; i < photos.length; i++) {
            if (photos[i]._id == req.params.photoId) {
                deleted = photos[i];
                index = i;
            }
        }
        if (!deleted) {
            return res.status(404).send();
        }
        photos.splice(index, 1);
        await post.save();
        res.status(200).send(post)
    } catch (err) {
        res.status(400).send();
    }
};

const getPostPhotoById = async (req, res) => {
    try {
        const post = await Post.findOne({_id: req.params.id, owner: req.user._id});

        const photos = post.photos;
        let photo;
        for (let i = 0; i < photos.length; i++) {
            if (photos[i]._id == req.params.photoId) {
                photo = photos[i];
            }
        }
        if (!photo) {
            return res.status(404).send();
        }

        res.status(200).send(photo)
    } catch (err) {
        res.status(500).send();
    }
};

const getPostAllPhotos = async (req, res) => {
    try {
        const post = await Post.findOne({_id: req.params.id, owner: req.user._id});
        if (!post) {
            res.status(404).send();
        }
        res.status(200).send(post.photos)
    } catch (err) {
        res.status(500).send();
    }
};

const getSpecificUserPost = async (req, res) => {

    try {
        const post = await Post.find({ owner: req.params.id});
        if (!post) {
            res.status(404).send();
        }
        res.status(200).send(post)

    } catch (err) {
        res.status(500).send();
    }
}

const deletePost = async (req, res) => {

    try {
        const post = await Post.findOneAndDelete({_id: req.params.id, owner: req.user._id});
        if (!post) {
            return res.status(404).send();
        }
        res.send(post)
    } catch (e) {
        res.status(500).send();
    }
};


module.exports = {
    getAllPosts, getPostById, createPost, updatePost, deletePost, upload, errorHandling, deletePostPhotoById,
    getPostPhotoById, getAllUsersPosts, getAllUserRecentlyPosts, searchByDescription, getPostAllPhotos, getSpecificUserPost
}
