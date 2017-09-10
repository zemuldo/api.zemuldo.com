'use strict';

let express = require("express");
const EventEmitter = require('events');

let {getAllBlogs,getBlog,addNewBlog,getBlogs} = require('../tools/database')
let router = express();

router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, Authorization, X-Requested-With, Content-Type, Accept");
    res.header("Allow-Control-Access-Method", "POST", "GET");
    next();
});

router.post(('/login'), async function (req, res) {

})
router.post(('/newBlog'), async function (req, res) {
    let state = await addNewBlog(req.body)
    res.send(state)
})

router.get(('/posts/:type/:title'), async function (req, res) {
    let query = {
        type:req.params.type,
        title:req.params.title
    }
    console.log(query)
    let state = await getBlog(query)
    res.send(state)
})
router.get(('/posts/:type'), async function (req, res) {
    console.log("------------------------------------"+req.params.type)
    let state = await getBlogs(req.params.type)
    console.log(state)
    res.send(state)
})
router.get(('/all'), async function (req, res) {
    let state = await getAllBlogs()
    res.send(state)
})
module.exports = router;