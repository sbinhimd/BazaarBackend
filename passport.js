const passport    = require('passport');
const passportJWT = require("passport-jwt");
const LocalStrategy = require('passport-local').Strategy
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy   = passportJWT.Strategy;

const User = require('./model/user')

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false,
    // passReqToCallback: true
  },
  (email, password, done) => {
    User.findOne({
      email: email
    }, function (err, user) {

      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message : "Password or email is NOT correct" });
      }

      user.verifyPassword(password, user.password, (err, match)=>{

        if(err) { return done(null, false, {message : "somethings wrong"}) }

        if(!match) { return done(null, false, {message : "Password or email is NOT correct"})}

        return done(null, user);
      })

    });
  }
));

passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : 'secret'
    },
    function (jwtPayload, cb) {

        //find the user in db if needed
        return User.findById(jwtPayload.id)
            .then(user => {
                return cb(null, user);
            })
            .catch(err => {
                return cb(err);
            });
    }
));