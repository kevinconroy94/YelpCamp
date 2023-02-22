const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// this will take care of username and passwords
// so we don't need to include them in the UserSchema
UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema);
