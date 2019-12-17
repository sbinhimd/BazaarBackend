const express = require('express')
const app = express()
const path = require("path");
const mongoose = require("mongoose");
const cors = require('cors')
const methodOverride = require('method-override') 
require('./passport');
const passport = require('passport'); //(6-auth)
var bodyParser = require('body-parser')

require('dotenv/config')


const PORT = process.env.PORT || 5000

var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');
var authRouter = require('./routes/auth');


app.use(cors())

mongoose.set('useCreateIndex', true);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'))

// parse
app.use(bodyParser.urlencoded({
  parameterLimit: 100000,
  limit: '50mb',
  extended: true
}));

app.use(passport.initialize());


//Routes
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/auth',authRouter);


//home Route
app.get('/',async(req, res, next) =>{
 res.send("Hello To Bazaar Backend")
});

mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log(`Connected to mongoDB`);
  }
);



app.listen(PORT, () => console.log(` server running on port ${PORT}`))


module.exports = app;
