const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy=require("passport-google-oauth20")
require('dotenv').config(); // Assurez-vous que dotenv est chargé
const User = mongoose.model('User'); // Assurez-vous que le modèle User est correctement défini

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_OR_KEY; // Assurez-vous que cette variable est définie dans .env

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.findById(jwt_payload.id)
            .then(user => {
                if (user) {
                    return done(null, user);
                }
                return done(null, false);
            })
            .catch(err => {
                console.error(err);
                return done(err, false);
            });
    }));
};

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:4000/auth/google/callback" , 
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    
    if (user) {
      console.log("User already exists:", user);
    } else {
      user = new User({
        googleId: profile.id,
        username: profile.displayName,
        email: profile.emails[0].value
      });
      await user.save();
      console.log("New user created:", user);
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));
passport.serializeUser((user,done)=>{
    done(null,user.id)
})
passport.deserializeUser((ise,done)=>{
    User.findById(id,(err,user)=>{
        done(err,user)
    })
})
