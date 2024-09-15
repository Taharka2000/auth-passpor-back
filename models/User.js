const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const jwt = require('jsonwebtoken'); // Assurez-vous d'avoir installé jsonwebtoken

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    // autres champs
    googleId:{
        type:String,
        unique:true
    }
});

UserSchema.plugin(passportLocalMongoose); // Ajoutez le plugin si vous l'utilisez

// Méthode pour générer le JWT
UserSchema.methods.generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);
    return jwt.sign({
      email: this.email,
      id: this._id,
      exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, process.env.SECRET_OR_KEY);
  }


module.exports = mongoose.model('User', UserSchema);
