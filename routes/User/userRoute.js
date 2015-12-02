var models = require('../../models/model');					//To import database models
var COUNTRY_COLLECTION = models.country;
var CITY_COLLECTION = models.city;
var RESTAURANTTYPE_COLLECTION = models.restaurantType;
var RESTAURANT_COLLECTION = models.restaurant;
var DISHTYPE_COLLECTION = models.dishType;
var MENU_COLLECTION = models.menu;
var LOGIN_COLLECTION = models.login;
var USER_COLLECTION = models.user;
var ORDER_COLLECTION = models.orders;
var REVIEW_COLLECTION = models.review;

var configuration = require('../../config/configuration');		//to import configuration file
var message = require('../../config/message');					//to import message file
var ObjectID = require('mongodb').ObjectID;						//to import mongodb npm module
var __ = require('underscore')._;								//to import underscore npm module
var fs = require('fs');											//to import fs module

/*
   	Method : Get
   	Purpose : To get user login page
*/
exports.getUserLogin = function(req , res){
	res.render('User/userLogin');
}

/*
   	Method : Post
   	Purpose : To place order
*/
exports.postOrder = function(req , res){
	if(req.session.username != null || req.session.username != "")
	{
		var data = req.body;
		var TotalPrice = req.body.PriceVal * req.body.qty;
		var Error = "";
		var flag;
		if(data.country == null){
			var Error = "Please select country !!!";
			flag = 1;
		}else if(data.city == null){
			var Error = "Please select city !!!";
			flag = 1;
		}else if(data.restaurantType == null){
			var Error = "Please select restaurant type !!!";
			flag = 1;
		}else if(data.restaurant == null){
			var Error = "Please select restaurant !!!";
			flag = 1;
		}else if(data.dishtype == null){
			var Error = "Please select dish type !!!";
			flag = 1;
		}else if(data.menu == null){
			var Error = "Please select Menu !!!";
			flag = 1;
		}else if(data.qty == ""){
			var Error = "Please enter quantity !!!";
			flag = 1;
		}else{
			flag = 0;
		}
		if(flag == 0){
			var orders = ORDER_COLLECTION({
				Name : req.session.username,
				Country_Id : data.country,
				City_Id : data.city,
				RestaurantType_Id : data.restaurantType,
				Restaurant_Id : data.restaurant,
				DishType_Id : data.dishtype,
				Menu_Id : data.menu,
				Quantity : data.qty,
				Price : data.PriceVal,
				TotalPrice : TotalPrice
			})
			orders.save(function(err, success){
				if(err)
				{
					res.send(TRY_AGAIN);
				}else{
					res.redirect('/userHome');
				}
			})
		}else{
			res.render('User/Error', {ErrorMsg : Error});
		}
	}
}

/*
   	Method : Get
   	Purpose : To get user home page
*/
exports.userHome = function(req , res){

	req.session.username = req.session.passport.user.name;
	req.session.useremail = req.session.passport.user.email;
	
	MENU_COLLECTION.find({}, function(err, menuList){
	  	if (err) {
		    json.status = '0';
			json.result = TRY_AGAIN;
			res.send(json);	
	  	}else{
  			COUNTRY_COLLECTION.find({}, function(err, countryList){
			  	if (err) {
				    json.status = '0';
					json.result = TRY_AGAIN;
					res.send(json);	
			  	}else{
					CITY_COLLECTION.find({}, function(err, cityList){
					  	if (err) {
						    json.status = '0';
							json.result = TRY_AGAIN;
							res.send(json);	
					  	}else{
					  		RESTAURANT_COLLECTION.find({}, function(err, restaurantList){
							  	if (err) {
								    json.status = '0';
									json.result = TRY_AGAIN;
									res.send(json);	
							  	}else{
							  		DISHTYPE_COLLECTION.find({}, function(err, dishList){
									  	if (err) {
										    json.status = '0';
											json.result = TRY_AGAIN;
											res.send(json);	
									  	}else{
									  		RESTAURANTTYPE_COLLECTION.find({}, function(err, restaurantTypeList){
											  	if (err) {
												    json.status = '0';
													json.result = TRY_AGAIN;
													res.send(json);	
											  	}else{
											  		res.render('User/home', { menuList : menuList, countries : countryList, cities : cityList, restaurantList : restaurantList, dishList : dishList, restaurantTypeList : restaurantTypeList});
								  				}
								  			});
						  				}
						  			});
				  				}
				  			});
						}
					});
				}
			});
		}
	});
}

/*
 METHOD : GET
 Purpose: to get Cities By CountryID
*/
exports.getCitiesByCountryID = function(req,res){
	var json = {};
	var CountryID = req.query.CountryID;
	CITY_COLLECTION.find({Country_Id : CountryID} , function(err, cities){
		if (err) {
		    json.status = '0';
			json.result = TRY_AGAIN;
			res.send(json);	
	  	}else{
			json.status = '1';
			json.result = cities;
			res.send(json);
		}
	})
}

/*
 METHOD : GET
 Purpose: to logout user
*/
exports.userLogout = function(req,res){
	req.session.username = "";
	req.session.useremail = "";
	res.redirect('/');
}

/*
 METHOD : GET
 Purpose: to get RestaurantByIDs
*/
exports.getRestaurantByIDs = function(req,res){
	var json = {};
	var data = req.query;
	var CountryID = data.CountryID;
	var CityID = data.CityID;
	var RestaurantTypeID = data.RestaurantTypeID;
	var Hours = data.Hours;
	if(Hours != ""){
		RESTAURANT_COLLECTION.find({Country_Id : CountryID, City_Id : CityID, RestaurantType_Id : RestaurantTypeID, "OpeningHours.Hours_24" : Hours} , function(err, restaurants){
			if (err) {
			    json.status = '0';
				json.result = TRY_AGAIN;
				res.send(json);	
		  	}else{
				json.status = '1';
				json.result = restaurants;
				res.send(json);
			}
		})
	}else{
		RESTAURANT_COLLECTION.find({Country_Id : CountryID, City_Id : CityID, RestaurantType_Id : RestaurantTypeID} , function(err, restaurants){
			if (err) {
			    json.status = '0';
				json.result = TRY_AGAIN;
				res.send(json);	
		  	}else{
				json.status = '1';
				json.result = restaurants;
				res.send(json);
			}
		})
	}
}

/*
 METHOD : GET
 Purpose: to get MenusByRestaurantID
*/
exports.getMenusByRestaurantID = function(req,res){
	var json = {};
	var RestaurantID = req.query.RestaurantID;
	var DishTypeID = req.query.DishTypeID;
	MENU_COLLECTION.find({Restaurant_Id : RestaurantID, DishType : DishTypeID } , function(err, menus){
		if (err) {
		    json.status = '0';
			json.result = TRY_AGAIN;
			res.send(json);	
	  	}else{
			json.status = '1';
			json.result = menus;
			res.send(json);
		}
	})
}

/*
   	Method : Get
   	Purpose : To get user review
*/
exports.getReview = function(req , res){
	var username = req.session.username;
	var useremail = req.session.useremail;
	//console.log("================User name : " + username + "==========Email : " + useremail);
	var json = {};
	if(username != "" && useremail != "")
	{
		ORDER_COLLECTION.distinct("City_Id", {Name : username}, function (err, orders) {
			if(err){
				json.status = '0';
				json.result = TRY_AGAIN;
				res.send(json);	
			}else{
				if(orders != null){
					CITY_COLLECTION.find({ "_id" : { $in: orders}}, function (err, cities) {
						if(err){
							json.status = '0';
							json.result = TRY_AGAIN;
							res.send(json);	
						}else{
							console.log("Cities : " + JSON.stringify(cities))
							res.render('User/review', {city : cities})
						}
					})
				}else{
					res.render('User/Error', {ErrorMsg : "You have not placed any order !!! To post a review, please place an order first."});
				}
			}
		})
	}else{
		res.redirect("/");
	}
}

/*
 METHOD : GET
 Purpose: to get RestaurantByCityID
*/
exports.getRestaurantByCityID = function(req,res){
	var json = {};
	var CityID = req.query.CityID;
	var username = req.session.username;
	ORDER_COLLECTION.distinct("Restaurant_Id", {Name : username}, function (err, orders) {
		if(err){
			json.status = '0';
			json.result = TRY_AGAIN;
			res.send(json);	
		}else{
			if(orders != null){
				RESTAURANT_COLLECTION.find({ "_id" : { $in: orders}, "City_Id" : CityID} , function(err, restaurants){
					if (err) {
					    json.status = '0';
						json.result = TRY_AGAIN;
						res.send(json);	
				  	}else{
						json.status = '1';
						json.result = restaurants;
						res.send(json);
					}
				})
			}else{
				res.render('User/Error', {ErrorMsg : "You have not placed any order !!! To post a review, please place an order first."});
			}
		}
	})
}

/*
   	Method : Post
   	Purpose : To post a review
*/
exports.postReview = function(req , res){
	var body = req.body;
	if(req.session.username != null || req.session.username != "")
	{
		var review = REVIEW_COLLECTION({
			Name : req.session.username,
			Email : req.session.useremail,
			City_Id : body.city,
			Restaurant_Id : body.restaurant,
			Description : body.description,
			Vote : body.vote
		})
		review.save(function(err, success){
			if(err)
			{
				res.send(TRY_AGAIN);	
			}else{
				res.redirect('/userHome');
			}
		})
	}else{
		res.redirect('/');
	}
}
