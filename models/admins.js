const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    type : {
        type : String,
        enum : ["Admin"],
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
    }
});

AdminSchema.pre('save', function(next) {
    const admin = this;

    // only hash the password if it has been modified (or is new)
    if (!admin.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(admin.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            admin.password = hash;
            next();
        });
    });
});

AdminSchema.methods.comparePassword = function(adminPassword, cb) {
    bcrypt.compare(adminPassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

// Export model
module.exports = mongoose.model("Admin", AdminSchema);