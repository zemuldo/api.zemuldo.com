const express = require("express");

const router = express()

router.get('/', (req, res)=>{
    res.send("I will be sending all posts")
})
router.get('/:postId', (req, res)=>{
    const {postId} = req.params
    res.send(`I will be sending one post with id ${postId}`)
})

router.post('/', (req, res)=>{
    res.send(`I will be publishing new posts from body ${JSON.stringify(req.body)}`)
})
router.put('/:postId', (req, res)=>{
    const {postId} = req.params
    res.send(`I will be updating one post with id ${postId}`)
})

module.exports = router;