var models = require('../../models/model');					//To import database models
var COUNTRY_COLLECTION = models.country;
var CITY_COLLECTION = models.city;
var RESTAURANTTYPE_COLLECTION = models.restaurantType;
var RESTAURANT_COLLECTION = models.restaurant;
var DISHTYPE_COLLECTION = models.dishType;
var MENU_COLLECTION = models.menu;
var LOGIN_COLLECTION = models.login;
var USER_COLLECTION = models.user;
var ORDER_COLLECTION = models.order;

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
	var data = req.body;
	var TotalPrice = req.body.price * req.body.qty;
	console.log("Total Price : " + TotalPrice);
	var order = ORDER_COLLECTION({
		Name : "",
		Country_Id : data.country,
		City_Id : data.city,
		RestaurantType_Id : data.restaurantType,
		Restaurant_Id : data.restaurant,
		DishType_Id : data.dishtype,
		Menu_Id : data.menu,
		Quantity : data.qty,
		Price : data.price,
		TotalPrice : data.TotalPrice
	})
	menu.save(function(err, success){
		if(err)
		{
			res.send(TRY_AGAIN);
		}else{
			res.redirect('/getRestaurant');
		}
	})
}
/*
   	Method : Get
   	Purpose : To get user home page
*/
exports.userHome = function(req , res){
	
	USER_COLLECTION.findOne({email : req.param('email')}, function(err, user){
		req.session.username = user.name;
		req.session.email = req.param('email');
	})
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
											  		// countryList.forEach(function(data){
											  		// 	console.log("Name : " + data.CountryName);
											  		// })
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
 Purpose: to get RestaurantByIDs
*/
exports.getRestaurantByIDs = function(req,res){
	var json = {};
	var CountryID = req.query.CountryID;
	var CityID = req.query.CityID;
	var RestaurantTypeID = req.query.RestaurantTypeID;
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