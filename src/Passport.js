require('dotenv').config();
const mongoURL = process.env.MONGO_URL;


const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const mongoose = require('mongoose');


passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});