const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    type : {
        type : String,
        enum : ["Customer"],
        required : true
    },
    first_name : {
        type : String,
        required : true,
        maxLength: 100
    },
    family_name: { 
      type: String, 
      required: true, 
      maxLength: 100 
    },
    date_of_birth: { 
        type: Date,
        required : true 
    },
    emailAdress : {
        type : String,
        required : true
    },
    password : {
        type : String,
        minLength : 8,
        maxLength : 16,
        required : true
    },
    bookRented : {
        type : [Schema.Types.ObjectId],
        ref : "BookInstance"
    },
    favouritesBooks : {
        type : [Schema.Types.ObjectId],
        ref : "Book"
    }
});

// Export model
module.exports = mongoose.model("Customer", CustomerSchema);