const passport = require("passport")
const GoogleStrategy = require('passport-google-oauth2').Strategy;
require('dotenv').config()

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(req, user, done) {
        done(null, user);
});

passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.SECRET_KEY,
        callbackURL: `/google/callback`,
        // callbackURL: `https://memory-game-ld7k.onrender.com/google/callback`,
        passReqToCallback   : true,
        scope: ["profile", "email"],
    },
    function(request, accessToken, refreshToken, profile, done) {
            return done(null, profile);
    }
));