//models/user.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')
const UserSchema = new Schema({
    email: {
        type: String,
        require: true,
        unique: true
    }
})
UserSchema.plugin(passportLocalMongoose)//사용자이름과 암호필드 추가과정

module.exports = mongoose.model('User', UserSchema)