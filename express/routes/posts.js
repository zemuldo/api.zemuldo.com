const express = require("express");
const posts = require('../../db/services/posts')

const router = express()

router.get('/', async (req, res) => {
    try {
        const list = await posts.get(req.query)
        res.send(list)
    } catch (error) {
        res.status(400).send([{ errorType: "BAD_REQUEST", errorMessage: error.toString() }])
    }

})

router.get('/drafts', async (req, res) => {
    try {
        const list = await posts.getDrafts()
        res.send(list)
    } catch (error) {
        res.status(400).send([{ errorType: "BAD_REQUEST", errorMessage: error.toString() }])
    }

})
router.post('/drafts', async (req, res) => {
    try {
        const draft = await posts.createDraft(req.body)
        res.send(draft)
    } catch (error) {
        res.status(400).send([{ errorType: "BAD_REQUEST", errorMessage: error.toString() }])
    }

})
router.put('/drafts', async (req, res) => {
    try {
        const draft = await posts.updateDraft(req.body)
        res.send(draft)
    } catch (error) {
        res.status(400).send([{ errorType: "BAD_REQUEST", errorMessage: error.toString() }])
    }

})
router.get('/latest', async (req, res) => {
    try {
        const post = await posts.getLatest()
        res.send(post)
    } catch (error) {
        res.status(400).send([{ errorType: "BAD_REQUEST", errorMessage: error.toString() }])
    }
})
router.get('/:postId', async (req, res) => {
    const { postId } = req.params
    try {
        const post = await posts.findById(postId)
        res.send(post)
    } catch (error) {
        res.status(400).send([{ errorType: "BAD_REQUEST", errorMessage: error.toString() }])
    }
})

router.post('/', async (req, res) => {
    try {
        if(!req.custom_user || !req.custom_user.id) throw Error("Please login first")
        const post = await posts.create({...req.body, authorId: req.custom_user.id})
        res.send(post)
    } catch (error) {
        res.status(400).send([{ errorType: "BAD_REQUEST", errorMessage: error.toString() }])
    }
})
router.post('/update/:postId', async (req, res) => {
    if(!req.custom_user || !req.custom_user.id) throw Error("Please login first")
    const { postId } = req.params
    try {
        posts.updatePost(req.body)
        const post = await posts.findById(postId)
        res.send(post)
    } catch(error){
        res.status(400).send([{ errorType: "BAD_REQUEST", errorMessage: error.toString() }])
    }
})

module.exports = router;