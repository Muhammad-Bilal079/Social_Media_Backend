const { Timestamp } = require('mongodb');
const mongoose = require("mongoose")
const { Schema } = require('mongoose');
const Postschema = new Schema({
   userId:{
    type:String,
    required:true,
   },
   desc:{
    type:String,
    max:500
   },
   img:{
    type:String,
   },
   likes:{
    type:Array,
    default:[]
   },
},
{timestamps:true}

)

module.exports = mongoose.model('Post',Postschema)