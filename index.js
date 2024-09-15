const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const passport = require('passport'); // Conservez cette déclaration
const LocalStrategy = require('passport-local').Strategy;
const cors = require("cors");
const session = require('express-session');
const User = require('./models/User');
const authRoutes = require('./routes/auth');
const configurePassport=require("./config/passport");

const app = express();
connectDB();

// Configuration des middlewares
app.use(bodyParser.json());
app.use(express.json()); // Middleware pour les données JSON
app.use(express.urlencoded({ extended: true })); // Middleware pour les données URL-encodées

// Configuration de express-session
app.use(session({
    secret: process.env.SECRET, // Remplacez par une valeur par défaut si nécessaire
    resave: false,
    saveUninitialized: false,
}));
app.use(cors({
    origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // autoriser l'envoi des cookies
  optionsSuccessStatus: 204,
  allowedHeaders: 'Content-Type,Authorization',
}));

// Configuration de passport
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(passport.initialize());
app.use(passport.session()); // Assurez-vous d'appeler la fonction

configurePassport(passport);
// Routes
app.use('/', authRoutes);

const PORT = process.env.PORT; // Définissez une valeur par défaut pour le port
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});
