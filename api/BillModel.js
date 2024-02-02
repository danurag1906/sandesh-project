import mongoose from "mongoose";

const billSchema=new mongoose.Schema({
    billno:{
        type:String,
        required:true,
        unique:true
    },
    companyname:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    }
    
},{timestamps:true})

const Bill=mongoose.model('Bill',billSchema)

export default Bill