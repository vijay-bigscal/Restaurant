
 /* Module dependencies. */

var express = require('express');
var http = require('http');
var https = require('https');
var path = require('path');
var util = require('util');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({extended : false});
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var mongoose = require('mongoose');
var passport = require('passport');

var database = require('./config/database'); 	// Get  database configuration file
var configuration = require('./config/configuration'); 	// Get configuration file
var passportconfig = require('./config/passport'); 	// Get  passport configuration file
var fs = require("fs"); //For file read write

/*
* To prevent crashes of app while getting uncaught exception
*/
process.on('uncaughtException', function (error) {
  	console.log(error.stack);
});


/**
 * Configure Mongo Database
 */
mongoose.connect(database.url);
var db = mongoose.connection;

db.on('error', function () {
  debug('MongoDB Connection Error. Please make sure MongoDB is running.'.red.bold);
  process.exit(0);
});

db.once('open', function (callback) {
		console.log("Database Conncection Established");
});

/*-------------------  Routes Files ------------------*/
var adminRoute = require('./routes/Admin/adminRoute');
var userRoute = require('./routes/User/userRoute');

/*
* Create Express server.
*/					

var app = express();
var server = app.listen(configuration.PORT);

console.log('Express server listening on port ' + configuration.PORT);

// all environments
app.set('port', process.env.PORT || configuration.PORT);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(passport.session());
// app.use(bodyParser());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));

app.use(cookieParser('secret'));
app.use(session({secret:'abcdef'}));
app.use(express.static(path.join(__dirname, 'public')));

/*-------------------  Admin Routes Files ------------------*/
app.get('/',adminRoute.getLogin);
app.get('/getAdminLogin',adminRoute.getAdminLogin);
app.post('/postAdminLogin',urlencodedParser, adminRoute.postAdminLogin);

app.get('/getRestaurantTypeList',adminRoute.getRestaurantTypeList); //To get list of restaurant type
app.get('/getRestaurantType',adminRoute.getRestaurantType); //To get insert form for restaurant type
app.post('/insertRestaurantType',urlencodedParser, adminRoute.insertRestaurantType); //to insert restaurant type

app.get('/getRestaurant',adminRoute.getRestaurant);
app.post('/insertRestaurant',urlencodedParser, adminRoute.insertRestaurant);
app.post('/insertMenu',urlencodedParser, adminRoute.insertMenu);

app.get('/getDishTypeList',adminRoute.getDishTypeList); //To get list of dish type
app.get('/getDishType',adminRoute.getDishType); //To get insert form for dish type
app.post('/insertDishType',urlencodedParser, adminRoute.insertDishType); //to insert dish type

app.get('/getCountryCity',adminRoute.getCountryCity); 
app.post('/insertCountry',urlencodedParser, adminRoute.insertCountry);
app.post('/insertCity',urlencodedParser, adminRoute.insertCity);

app.get('/getOrders',adminRoute.getOrders);
app.get('/getReviews',adminRoute.getReviews);

/*-------------------  User Routes Files ------------------*/
app.get('/getUserLogin',userRoute.getUserLogin);
app.get('/userHome',userRoute.userHome); //To get Home page
app.post('/postOrder',urlencodedParser, userRoute.postOrder);
app.get('/getCitiesByCountryID',userRoute.getCitiesByCountryID);
app.get('/getRestaurantByIDs',userRoute.getRestaurantByIDs);
app.get('/getMenusByRestaurantID',userRoute.getMenusByRestaurantID);
app.get('/getRestaurantByCityID', userRoute.getRestaurantByCityID);
app.get('/getReview',userRoute.getReview);
app.post('/postReview',urlencodedParser ,userRoute.postReview);
app.get('/userLogout',userRoute.userLogout);

/*-------------------  Route For Facebook Authentication And Login ------------------*/
app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
    // handle the callback after facebook has authenticated the user
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect : '/userHome',
        failureRedirect : '/getUserLogin'
	})
);