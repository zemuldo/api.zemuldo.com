'use strict';

let express = require("express");
const EventEmitter = require('events');
const requestIp = require('request-ip');
let router = express();
router.use(requestIp.mw())

let {getAllBlogs,getBlog,addNewBlog,getBlogs,addVisitor} = require('../tools/database')

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
    let state = await getBlogs(req.params.type)
    console.log(state)
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
router.post('/analytics/visitors/new',function (req,res) {
    if(req.body.status){
        if(req.body.status!=="success"){
            let unResolvedUser = {
                "as": "AS36866 JTL",
                "city": "Nairobi",
                "country": "Kenya",
                "countryCode": "KE",
                "isp": "Jamii Telecommunications Limited",
                "lat": -1.2833,
                "lon": 36.8167,
                "org": "JTL",
                "query": req.body.query,
                "region": "30",
                "regionName": "Nairobi Province",
                "status": "success",
                "timezone": "Africa/Nairobi",
                "zip": ""
            }
            addVisitor(unResolvedUser)
        }
        else {
            addVisitor(req.body)
        }
    }
    res.send(true)
})
router.get('/getIp',function (req,res) {
    res.send({ip:req.clientIp})
})
module.exports = router;
