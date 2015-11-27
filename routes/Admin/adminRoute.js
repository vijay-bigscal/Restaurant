var models = require('../../models/model');					//To import database models
var COUNTRY_COLLECTION = models.country;
var CITY_COLLECTION = models.city;
var RESTAURANTTYPE_COLLECTION = models.restaurantType;
var RESTAURANT_COLLECTION = models.restaurant;
var DISHTYPE_COLLECTION = models.dishType;
var MENU_COLLECTION = models.menu;
var ADMINLOGIN_COLLECTION = models.adminlogin;

var configuration = require('../../config/configuration');		//to import configuration file
var message = require('../../config/message');					//to import message file
var ObjectID = require('mongodb').ObjectID;						//to import mongodb npm module
var __ = require('underscore')._;								//to import underscore npm module
var fs = require('fs');											//to import fs module

/*
   	Method : Get
   	Purpose : To get login page
*/
exports.getLogin = function(req , res){
	res.render('login');
}

/*
   	Method : Get
   	Purpose : To get admin login page
*/
exports.getAdminLogin = function(req , res){
	res.render('Admin/login', { Error : "" });
}

/*
	Method : POST
	Purpose : to authenticate admin
*/
exports.postAdminLogin = function(req,res){
	console.log("Email : " + req.body.email + ", Password : " + req.body.password);
	ADMINLOGIN_COLLECTION.findOne({Email : req.body.email, Passwords : req.body.password}, function(err, admindata){
		if(err){
			res.send(TRY_AGAIN);
		}else{
			if(admindata != null){
				console.log("adminData not null : " + admindata);
				res.redirect('/getRestaurant');
			}else{
				console.log("adminData null : " + admindata);
				res.render("Admin/login" , { Error : "UserName or password incorrect" });
			}
		}
	})
}
/*
   	Method : Get
   	Purpose : To get list of restaurant type
*/
exports.getRestaurantTypeList = function(req , res){
	var json = {};
	RESTAURANTTYPE_COLLECTION.find({},function(err,restaurantType){
		if(restaurantType == null)
		{
			json.status = "0";
			json.result = TRY_AGAIN;
			res.send(json);
		}else{
			json.status = "1";
			json.result = restaurantType;
			res.send(json);
			//res.render('Admin/login',{ restaurantTypes : restaurantType});
		}
	})
}

/*
   	Method : Get
   	Purpose : To get restaurant type form
*/
exports.getRestaurantType = function(req , res){
	res.render('Admin/restaurantType');
}

/*
   	Method : Post
   	Purpose : To insert restaurant type data
*/
exports.insertRestaurantType = function(req , res){
	
	var restaurantType = RESTAURANTTYPE_COLLECTION({
		No : req.body.no,
		Type : req.body.types
	})
	restaurantType.save(function(err, success){
		if(err){
			res.send(TRY_AGAIN);
		}else{
			res.redirect('/getRestaurantType');
		}

	});
}

/*
   	Method : Get
   	Purpose : To get restaurant form
*/
exports.getRestaurant = function(req , res){
	RESTAURANTTYPE_COLLECTION.find({}, function(err, restaurantTypes){
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
									  		// countryList.forEach(function(data){
									  		// 	console.log("Name : " + data.CountryName);
									  		// })
						  					res.render('Admin/restaurantMenu', { restaurantTypes : restaurantTypes, 
						  					countries : countryList, cities : cityList, restaurantList : restaurantList, dishList : dishList});
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
	//console.log("City : " + cities.CityName);
}

/*
   	Method : Post
   	Purpose : To insert restaurant
*/
exports.insertRestaurant = function(req , res){
	var data = req.body;
	var restaurant = RESTAURANT_COLLECTION({
		Name : data.resname,
		Address : data.address,
		Country_Id : data.country,
		City_Id : data.city,
		RestaurantType_Id : data.restaurantType,
		Phone : data.phone,
		CallMeNow : data.callme,
		Status : data.status,
		OpeningHours : data.days,
		Logo : data.logo
	})
	restaurant.save(function(err, success){
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
   	Purpose : To get list of dish type
*/
exports.getDishTypeList = function(req , res){
	var json = {};
	DISHTYPE_COLLECTION.find({},function(err,dishType){
		if(dishType == null)
		{
			json.status = "0";
			json.result = TRY_AGAIN;
			res.send(json);
		}else{
			json.status = "1";
			json.result = dishType;
			res.send(json);
		}
	})
}

/*
   	Method : Get
   	Purpose : To get dish type form
*/
exports.getDishType = function(req , res){
	res.render('Admin/dishType');
}

/*
   	Method : Post
   	Purpose : To insert dish type
*/
exports.insertDishType = function(req , res){
	
	var dishType = DISHTYPE_COLLECTION({
		No : req.body.no,
		Type : req.body.dishtype
	})
	dishType.save(function(err, success){
		if(err){
			res.send(TRY_AGAIN);
		}else{
			res.redirect('/getDishType');
		}

	});
}
/*
   	Method : Post
   	Purpose : To insert Menu
*/
exports.insertMenu = function(req , res){
	var data = req.body;
	var menu = MENU_COLLECTION({
		DishName : data.dishname,
		Ingredients : data.ingredients,
		Details : data.details,
		Spices : data.spices,
		Price : data.price,
		DishType : data.dishtype,
		Restaurant_Id : data.restaurant,
		DishPic : data.dishFile
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
   	Purpose : To get country city form
*/
exports.getCountryCity = function(req , res){	
 	COUNTRY_COLLECTION.find({}, function(err, country){
	  	if (err) {
		    json.status = '0';
			json.result = TRY_AGAIN;
			res.send(json);	
	  	}else{
			// var len = country.length;
			// if (len != 0) {	
			// 	// restauranttypes.forEach(function(restauranttype){		
				// 	console.log("Restaurant : " + restauranttype);
				// 	res.send(restauranttype);
				// })
 				res.render('Admin/countryCity', { countryList : country});
			// }else{
			// 	res.redirect('/getCountryCity');
			// }
		}
	});
}

/*
   	Method : Post
   	Purpose : To insert Country
*/
exports.insertCountry = function(req , res){
	var data = req.body;
	var country = COUNTRY_COLLECTION({
		CountryName : data.countryname
	})
	country.save(function(err, success){
		if(err)
		{
			res.send(TRY_AGAIN);
		}else{
			res.redirect('/getRestaurant');
		}
	})
}

/*
   	Method : Post
   	Purpose : To insert City
*/
exports.insertCity = function(req , res){
	var data = req.body;
	var city = CITY_COLLECTION({
		CityName : data.cityname,
		Country_Id : data.country
	})
	city.save(function(err, success){
		if(err)
		{
			res.send(TRY_AGAIN);
		}else{
			res.redirect('/getRestaurant');
		}
	})
}