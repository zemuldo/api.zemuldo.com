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

module.exports = router;

