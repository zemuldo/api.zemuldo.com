'use strict';

let express = require("express");
const EventEmitter = require('events');
const requestIp = require('request-ip');
let router = express();
router.use(requestIp.mw())

let {addReview,getFilterBlogs,getAllBlogs,getBlog,addNewBlog,getBlogs,addVisitor} = require('../tools/database')

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
router.post('/analytics/visitors/new', async function (req,res) {
    let state = null
    if(req.body.status){
        if(req.body.status!=="success"){
            let unResolvedUser = {
                sessionID:'unknownuser'+new Date().toDateString(),
                "as": "Unknown",
                "city": "Unknown",
                "country": "Unknown",
                "countryCode": "Unknown",
                "isp": "Unknown",
                "lat": 'Unknown',
                "lon": 'Unknown',
                "org": "Unknown",
                "query": req.body.query,
                "region": "Unknown",
                "regionName": "Unknown",
                "status": "Unknown",
                "timezone": "Unknown",
                "zip": ""
            }
            state = await addVisitor(unResolvedUser)
            res.send(state)
        }
        else {
           state = await addVisitor(req.body)
            res.send(state)
        }
    }
})
router.post('/analytics/visitors/review',async function (req,res) {
    let state = await addReview(req.body)
    res.send(state)
})

router.get('/getIp',function (req,res) {
    res.send({ip:req.clientIp})
})

module.exports = router;

