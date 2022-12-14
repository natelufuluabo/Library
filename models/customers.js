const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;

const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
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
    email_address : {
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

CustomerSchema.virtual("date_of_birth_yyyy_mm_dd").get(function () {
    return DateTime.fromJSDate(this.date_of_birth).toISODate(); // format 'YYYY-MM-DD'
});

CustomerSchema.virtual("username").get(function () {
    return this.email_address;
});

CustomerSchema.pre('save', function(next) {
    const user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

CustomerSchema.methods.comparePassword = function(userPassword, cb) {
    bcrypt.compare(userPassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

// Export model
module.exports = mongoose.model("Customer", CustomerSchema);