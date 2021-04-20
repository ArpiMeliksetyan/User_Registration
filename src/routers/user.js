const express = require('express');
const auth = require('../util/middleware/auth');
const controller = require('../controllers/user');
const router = new express.Router();


router.post('/',controller.signUp );

router.get('/me', auth, controller.getInfo);

router.get('/:id/avatar',controller.getProfilePic);

router.get('/search/:email',controller.getUserByEmail);

router.post('/login',controller.signIn);

router.post('/logout', auth, controller.signOut);

router.post('/logoutAll', auth,controller.signOutAllDevices);

router.post('/me/avatar', auth, controller.upload.single('avatar'),controller.uploadAvatar,controller.errorHandling);

router.patch('/me', auth, controller.updateUserInfo);

router.delete('/me/avatar', auth, controller.upload.single('avatar'),controller.deleteUserAvatar);

router.delete('/me', auth, controller.deleteUserById);

module.exports = router;