const express = require("express");
const users = require('../../db/services/users')
const passport = require('passport')
const { Strategy } = require('passport-github')

const router = express()

passport.use(new Strategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/user/auth/github/callback"
},

    function (accessToken, refreshToken, profile, cb) {
        users.findOrCreate({ ...profile, accessToken, refreshToken })
        return cb(null, profile);
    }
));

// router.get('/auth/github',
//     (req, res, next) => {
//         req.coo.redirectTo = req.query.redirectTo
//         next();
//     },
//     passport.authenticate('github'))

// router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/error' }),

//     function (req, res) {
//         res.redirect("/");
//     });

    router.get(`/auth/github`, (req, res, next) => {
        const { redirectTo } = req.query
        console.log(redirectTo)
        const state = JSON.stringify({redirectTo})
        const authenticator = passport.authenticate('github', { scope: [], state })
        authenticator(req, res, next)
    })

    router.get(
        `/auth/github/callback`,
        passport.authenticate('github', { failureRedirect: '/login' }),
        (req, res) => {
            try {
                const { state } = req.query
                console.log(state)
                const { redirectTo } = JSON.parse(state)
                if (typeof redirectTo === 'string' && redirectTo.includes('//')) {
                    return res.redirect(redirectTo)
                }
            } catch {
                // just redirect normally below
            }
            res.redirect('/')
        },
    )
module.exports = router;