const express = require("express");
const users = require('../../db/services/users')
const passport = require('passport')
const { Strategy } = require('passport-github')

const router = express()

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function(user, cb) {
    cb(null, user);
  });
  
  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });

passport.use(new Strategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/user/auth/github/callback"
},
    // function (accessToken, refreshToken, profile, cb) {
    //     users.findOrCreate({...profile, accessToken, refreshToken})
    // }
    function(accessToken, refreshToken, profile, cb) {
        return cb(null, profile);
    }
));

router.get('/auth/github', passport.authenticate('github'))

router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/error' }),
    function (req, res) {
        console.log("success")
        // Successful authentication, redirect home.
        res.redirect('/success');
    });
module.exports = router;