const express = require('express')
const app = express()
const path = require("path");
const mongoose = require("mongoose");
const cors = require('cors')
const methodOverride = require('method-override') 
require('dotenv/config')
const PORT = process.env.PORT || 5000

var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

mongoose.set('useCreateIndex', true);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'))



app.use('/users', usersRouter);
app.use('/posts', postsRouter);



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log(`connect tho mongoDB`);
  }
);



app.listen(PORT, () => console.log(` server running on port ${PORT}`))


module.exports = app;
