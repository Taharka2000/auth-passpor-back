const express = require("express");
const passport = require("passport");
const User = require("../models/User");
const router = express.Router();


router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    await User.register(user, password);
    res.status(201).json({ message: "User register" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/login", (req, res, next) => {
    console.log('Login request body:', req.body);

   passport.authenticate("local",
    (err,user,info)=>{
        if(err) return next(err);
        if(!user) return res.status(400).json({message:"Ivalid credentials"});
        const token =user.generateJWT();
        res.json({message:"LOggin in succes",token})
    }
   )(req,res,next)
});


  router.get('/logout',(req,res)=>{
    req.logout();
    res.json({message:"Logged out successfully"})
  })

  router.get("/google",
    passport.authenticate("google",{scope:["profile","email"]})
  )
  router.get('/auth/google/callback',
    passport.authenticate('google', { 
      failureRedirect: '/login', 
      session: false,
      failureMessage: true
    }),
    (req, res) => {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
      try {
        const token = req.user.generateJWT();
        res.json({ token });
      } catch (error) {
        console.error('Error generating token:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  );
  
  
  module.exports = router;