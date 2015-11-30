// load all the things we need
var passport = require('passport');
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// load up the user model
var models = require('../models/model'); 
var User  = models.user; //Schema;

// load the auth variables
var configAuth = require('./auth');

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    done(null, user);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});
    
// =========================================================================
// FACEBOOK ================================================================
// =========================================================================
passport.use(new FacebookStrategy({

    // pull in our app id and secret from our auth.js file
    clientID        : configAuth.facebookAuth.clientID,
    clientSecret    : configAuth.facebookAuth.clientSecret,
    callbackURL     : configAuth.facebookAuth.callbackURL,
    profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified'],

},
    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        //console.log("========================" + JSON.stringify(profile) + "==========================");
        // asynchronous
        process.nextTick(function() {

            // find the user in the database based on their facebook id
            var username = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
            User.findOne({id : profile.id, name : username, email : profile.emails[0].value}, function(err, users){
                if (err)
                    return done(err);

                if(users == null){
                    // if there is no user found with that facebook id, create them
                    //console.log("==================User not exist===================");
                    var newUser = new User();

                    // set all of the facebook information in our user model
                    newUser.id    = profile.id; // set the users id to facebook id
                    newUser.token = token; // we will save the token that facebook provides to the user                    
                    newUser.name  = username; // look at the passport user profile to see how names are returned
                    newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                    // save our user to the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    })
                }else{
                    //console.log("=======================User exist===================");
                    return done(null, users);
                }
            })
        })
    }
))
