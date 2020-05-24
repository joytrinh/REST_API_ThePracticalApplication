const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const feedController = require('../controllers/feed')
const isAuth = require('../middleware/is-auth')

//GET /feed/posts
router.get('/posts', isAuth, feedController.getPosts)

//POST /feed/posts
router.post('/post', isAuth, [
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5})
], feedController.createPost)

router.get('/post/:postId', isAuth, feedController.getPost)

/* Editing a post essentially is like replacing it, replacing the old post with a new one, we'll keep the
old ID but that is it. Since we'll replace a resource, I'll use the put method here which we haven't used 
before because with normal browser forms, you're not able to send it, through asynchronous requests 
triggered by javascript
*/
router.put('/post/:postId', isAuth, [
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5})
], feedController.updatePost)

router.delete('/post/:postId', isAuth, feedController.deletePost)

module.exports = router