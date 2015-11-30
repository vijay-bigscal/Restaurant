var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/******* Start Country Model *********/

var country = new Schema({
	CountryName : String
});

var Country = mongoose.model('Country' , country);
exports.country = Country;

/******* End Country Model *********/

/******* Start City Model *********/

var city = new Schema({
	CityName : String,
	Country_Id : Schema.ObjectId
});

var City = mongoose.model('City' , city);
exports.city = City;

/******* End City Model *********/

/******* Start RestaurantType Model *********/

var restaurantType = new Schema({
	No : Number,
	Type : String
});

var RestaurantType = mongoose.model('RestaurantType' , restaurantType);
exports.restaurantType = RestaurantType;

/******* End RestaurantType Model *********/

/******* Start Restaurant  Model *********/

var restaurant = new Schema({
	Name : String,
	Address : String,
	Country_Id : Schema.ObjectId,
	City_Id : Schema.ObjectId,
	RestaurantType_Id : Schema.ObjectId,
	Phone : String,
	CallMeNow : Boolean,
	Status : Number,
	OpeningHours : Array,
	Logo : String
});

var Restaurant = mongoose.model('Restaurant' , restaurant);
exports.restaurant = Restaurant;

/******* End Restaurant Model *********/

/******* Start DishType Model *********/

var dishType = new Schema({
	No : Number,
	Type : String
});

var DishType = mongoose.model('DishType' , dishType);
exports.dishType = DishType;

/******* End DishType Model *********/

/******* Start Menu  Model *********/

var menu = new Schema({
	DishName : String,
	Ingredients : String,
	Details : String,
	Spices : String,
	Price : Number,
	DishType : Schema.ObjectId,
	Restaurant_Id : Schema.ObjectId,
	DishPic : String
});

var Menu = mongoose.model('Menu' , menu);
exports.menu = Menu;

/******* End Menu Model *********/

/************ start AdminLogin model   ***************/

var adminlogin = new Schema({
	Email : String,
	Passwords : String
})

var AdminLogin = mongoose.model('AdminLogin' , adminlogin);
exports.adminlogin = AdminLogin;

/************   End AdminLogin model    ***************/

/************ start Order model   ***************/

var orders = new Schema({
	Name : String,
	Country_Id : Schema.ObjectId,
	City_Id : Schema.ObjectId,
	RestaurantType_Id : Schema.ObjectId,
	Restaurant_Id : Schema.ObjectId,
	DishType_Id : Schema.ObjectId,
	Menu_Id : Schema.ObjectId,
	Quantity : Number,
	Price : Number,
	TotalPrice : Number
})

var Orders = mongoose.model('Orders' , orders);
exports.orders = Orders;

/************   End Order model    ***************/

/************ start Review model   ***************/

var review = new Schema({
	Name : String,
	Email : String,
	City_Id : Schema.ObjectId,
	Restaurant_Id : Schema.ObjectId,
	Description : String,
	Vote : Number
})

var Review = mongoose.model('Review' , review);
exports.review = Review;

/************   End Review model    ***************/

/************   Start UserLogin model    ***************/

var userLogin = new Schema({
	id           : String,
    token        : String,
    email        : String,
    name         : String
    /* If we have to create local collection for user and also different scoial media tables, we can seperate all of them */
    // local            : {
    //     email        : String,
    //     password     : String,
    // },
    // facebook         : {
    //     id           : String,
    //     token        : String,
    //     email        : String,
    //     name         : String
    // },
    // twitter          : {
    //     id           : String,
    //     token        : String,
    //     displayName  : String,
    //     username     : String
    // },
    // google           : {
    //     id           : String,
    //     token        : String,
    //     email        : String,
    //     name         : String
    // }

});

var User = mongoose.model('User' , userLogin);
exports.user = User;

/************   End UserLogin model    ***************/