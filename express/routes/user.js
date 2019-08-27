const express = require("express");
const users = require('../../db/services/users')
const passport = require('passport')
const { Strategy } = require('passport-github')
const jwt = require('jsonwebtoken');

require('dotenv')

const jwtKey = process.env.JWT_KEY

const router = express()

passport.use(new Strategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/user/auth/github/callback"
},

    function (accessToken, refreshToken, profile, cb) {
        users.findOrCreate({ 
            ...profile, 
            accessToken, 
            refreshToken, 
            oAuthId: profile.id, 
            oAuthData: profile,
            profilePhotoUrl: profile.photos[0]? profile.photos[0].value: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
         })
        return cb(null, profile);
    }
));
router.get('/', async (req, res) =>{
    try {
        const user = await users.fineById(req.custom_user.id)
        res.send(user || {})
    }catch(_){
        res.status(401).send({error: "User not logged in"})
    }
})

router.get(`/auth/github`, (req, res, next) => {
    const { redirectTo } = req.query
    const state = JSON.stringify({ redirectTo })
    const authenticator = passport.authenticate('github', { scope: [], state, session: true })
    authenticator(req, res, next)
}, (req, res, next) =>{
    next()
})

router.get(
    `/auth/github/callback`,
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res, next) => {
        const token = jwt.sign({id: req.user.id}, jwtKey, {expiresIn: 60 * 60 * 24 * 1000})
        req.logIn(req.user, function(err) {
            if (err) { return next(err); }
            try {
                const { state } = req.query
                const { redirectTo } = JSON.parse(state)
                if (typeof redirectTo === 'string' && redirectTo.includes('//')) {
                    return res.redirect(`${redirectTo}?token=${token}`)
                }
                else return res.redirect(`${process.env.FRONTEND_URL}?token=${token}`)
            } catch {
                res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`)
            }
            res.redirect('/')
          });
        
    },
)
module.exports = router;