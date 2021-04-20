const express = require('express');
const auth = require('../util/middleware/auth');
const controller = require('../controllers/post');
require('../repository/mongoose');
const router = new express.Router();


router.get('/', auth, controller.getAllPosts);

router.get('/public', controller.getAllUsersPosts);

router.get('/recently/:id', auth, controller.getAllUserRecentlyPosts);

router.get('/photo/:id/:photoId',auth,controller.getPostPhotoById);

router.get('/photos/:id',auth,controller.getPostAllPhotos);

router.get('/search/:key',auth,controller.searchByDescription);

router.get('/:id', auth, controller.getPostById);

router.get('/specificUser/:id',auth,controller.getSpecificUserPost);

router.post('/', auth, controller.upload.array('photos',10),controller.createPost,controller.errorHandling);

router.patch('/:id/:index', auth,controller.upload.array('photos',10), controller.updatePost);

router.delete('/:id', auth, controller.deletePost);

router.delete('/:id/:photoId', auth, controller.deletePostPhotoById);

module.exports = router;