const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Define the user schema
const userSchema = new mongoose.Schema({
   fullname: {
    firstname: {
        type: String,
        required: true,
        minlength: 3,
    },
    lastname:{
        type: String,
        minlength: 3,
    }
},
    email :{
        type:String,
        required: true,
        unique: true,
        minlength: 5,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false, //when you query the user, the password will not be returned by default
    },
    phone: {
        type: String,
        minlength: 10,
    },
    address: {
        type: String, 
        minlength: 5,
    },
    //updating madhav code Aug for Order flow
    
    // doubt why full name and all the things are different : Is this because of Different Addresses
     savedAddress: {
        fullName: { type: String },
        phone: { type: String },
        street: { type: String },
        city: { type: String },
        state: { type: String },
        pincode: { type: String },
      },

       favorites: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
    ],
    cart: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, default: 1, min: 1 },
        price: { type: Number, required: true }
      }
    ],
});

//Genrate a unique token for the user
userSchema.methods.generateAuthToken = async function () {

    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
    return token;
}

// Compare the password with the hashed password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

// Hash the password before saving the user to the database
userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}   


const userModel = mongoose.model('User', userSchema);

module.exports = userModel;