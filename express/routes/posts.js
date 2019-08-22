const express = require("express");
const posts = require('../../db/utils/posts')

const router = express()

router.get('/', async (req, res) => {
    try {
        const list = await posts.get(req.query)
        res.send(list)
    } catch (error) {
        res.status(400).send([{ errorType: "BAD_REQUEST", errorMessage: error.toString() }])
    }

})
router.get('/latest', (req, res) => {
    res.send("I will be sending the latest post")
})
router.get('/:postId', async (req, res) => {
    const { postId } = req.params
    try {
        const post = await posts.findById(postId)
        res.send(post)
    } catch (error) {
        res.status(400).send([{ errorType: "BAD_REQUEST", errorMessage: error.toString() }])
    }
    res.send(`I will be sending one post with id ${postId}`)
})

router.post('/', async (req, res) => {
    try {
        const post = await posts.create(req.body)
        res.send(post)
    } catch (error) {
        res.status(400).send([{ errorType: "BAD_REQUEST", errorMessage: error.toString() }])
    }
})
router.put('/:postId', (req, res) => {
    const { postId } = req.params
    res.send(`I will be updating one post with id ${postId}`)
})

module.exports = router;