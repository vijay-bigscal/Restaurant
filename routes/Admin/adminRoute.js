var models = require('../../models/model');					//To import database models
var COUNTRY_COLLECTION = models.country;
var CITY_COLLECTION = models.city;
var RESTAURANTTYPE_COLLECTION = models.restaurantType;
var RESTAURANT_COLLECTION = models.restaurant;
var DISHTYPE_COLLECTION = models.dishType;
var MENU_COLLECTION = models.menu;
var ADMINLOGIN_COLLECTION = models.adminlogin;
var ORDER_COLLECTION = models.orders;
var REVIEW_COLLECTION = models.review;

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
	//When first time called admin credentials are set
	ADMINLOGIN_COLLECTION.findOne({}, function(err, admin){
		if(err){
			res.send(TRY_AGAIN);
		}else{
			if(admin == null){
				var adminLogin = ADMINLOGIN_COLLECTION({
					Email : "admin@foodcorner.com",
					Passwords : "admin"
				})
				adminLogin.save(function(err, success){
					if(err){
						res.send(TRY_AGAIN);
					}
				})
			}
			res.render('login');
		}
	})
	
}

/*
   	Method : Get
   	Purpose : To get admin login page
*/
exports.getAdminLogin = function(req , res){
	//When first time called admin credentials are set
	ADMINLOGIN_COLLECTION.findOne({}, function(err, admin){
		if(err){
			res.send(TRY_AGAIN);
		}else{
			if(admin == null){
				var adminLogin = ADMINLOGIN_COLLECTION({
					Email : "admin@foodcorner.com",
					Passwords : "admin"
				})
				adminLogin.save(function(err, success){
					if(err){
						res.send(TRY_AGAIN);
					}
				})
			}
			res.render('Admin/login', { Error : "" }); 
		}
	})
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
						  					res.render('Admin/restaurantMenu', { restaurantTypes : restaurantTypes, countries : countryList, cities : cityList, restaurantList : restaurantList, dishList : dishList});
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
		OpeningHours : [{Days : data.days}, {Hours_24 : data.hours}],
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
	var json = {};
 	COUNTRY_COLLECTION.find({}, function(err, country){
	  	if (err) {
		    json.status = '0';
			json.result = TRY_AGAIN;
			res.send(json);	
	  	}else{
			res.render('Admin/countryCity', {countryList : country});
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

/*
   	Method : Get
   	Purpose : To get orders
*/
exports.getOrders = function(req , res){
	var json = {};
	ORDER_COLLECTION.find({}, function(err, orders){
		if(err){
			json.status = '0';
			json.result = TRY_AGAIN;
			res.send(json);
		}else{
			COUNTRY_COLLECTION.find({}, function(err, countries){
				if(err){
					json.status = '0';
					json.result = TRY_AGAIN;
					res.send(json);
				}else{
					// console.log("====================Orders : " + orders + "===================");
					// console.log("====================Countries : " + countries + "===================");
					CITY_COLLECTION.find({}, function(err, cities){
						if(err){
							json.status = '0';
							json.result = TRY_AGAIN;
							res.send(json);
						}else{
							RESTAURANT_COLLECTION.find({}, function(err, restaurants){
								if(err){
									json.status = '0';
									json.result = TRY_AGAIN;
									res.send(json);
								}else{
									MENU_COLLECTION.find({}, function(err, menus){
										if(err){
											json.status = '0';
											json.result = TRY_AGAIN;
											res.send(json);
										}else{
											res.render('Admin/viewOrders', {Orders : orders, Countries : countries, Cities : cities, Restaurants : restaurants, Menus : menus});
										}
									})
								}
							})
						}
					})
				}
			})
		}
	})
}

/*
   	Method : Get
   	Purpose : To get reviews
*/
exports.getReviews = function(req , res){
	var json = {};
	REVIEW_COLLECTION.find({}, function(err, reviews){
		if(err){
			json.status = '0';
			json.result = TRY_AGAIN;
			res.send(json);
		}else{
			CITY_COLLECTION.find({}, function(err, cities){
				if(err){
					json.status = '0';
					json.result = TRY_AGAIN;
					res.send(json);
				}else{
					RESTAURANT_COLLECTION.find({}, function(err, restaurants){
						if(err){
							json.status = '0';
							json.result = TRY_AGAIN;
							res.send(json);
						}else{
							res.render('Admin/viewReviews',{Reviews : reviews, Cities : cities, Restaurants : restaurants});
						}
					})
				}
			})
		}
	})
}

