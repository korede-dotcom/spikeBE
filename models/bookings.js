const mongoose = require("mongoose")

const BookingsSchema = new mongoose.Schema({
    serviceType:{
       type:String
    },
    bedRoom:{
       type:String
    },   
    bathRoom:{
        type:String,
    },
    kitchen:{
        type:String,
    },
    homeStatus:{
        type: String,
        required: true,
        enum: ["slightly Dirty","Pretty Dirty" ,"Very Dirty"],
        default:"slightly Dirty"
    },
    extra:[String],
    cleaningDate:{
        type:String
    },
    often: {
        enum: ["one time","Weekly" ,"Bi Weekly","yearly"]
    },
    name: {
        type:String,
   
    },
    lastName: {
        type:String,
   
    },
    email: {
        type:String,
   
    },
    address: {
        type:String,
   
    },
    city: {
        type:String,
   
    },
    state: {
        type:String,
   
    },
    zipcode: {
        type:String,
   
    },
    phone: {
        type:String,
   
    },
    comment: {
        type:String,
   
    },
  
},
    {
        timestamps: true,
        strictPopulate: false
    }

)


module.exports = mongoose.model("Bookings",BookingsSchema)