'use strict';
const express = require("express");
const requestIp = require('request-ip');
const router = express();
router.use(requestIp.mw())

let {getFilterBlogs,getAllBlogs,getBlog,getBlogs} = require('../tools/database')

router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, Authorization, X-Requested-With, Content-Type, Accept");
    res.header("Allow-Control-Access-Method", "POST", "GET");
    next();
});
router.post(('/login'), async function (req, res) {

})

router.get(('/posts/:type/:title'), async function (req, res) {
    let query = {
        type:req.params.type,
        title:req.params.title
    }
    let state = await getBlog(query)
    res.send(state)
})
router.get(('/posts/:type'), async function (req, res) {
    let state = await getBlogs(req.params.type)
    res.send(state)
})
router.get(('/all'), async function (req, res) {
    let state = await getAllBlogs()
    res.send(state)
})
router.get(('/filter/:filterString'), async function (req, res) {
    let state = await getFilterBlogs(req.params.filterString)
    res.send(state)
})

module.exports = router;

