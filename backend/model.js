const { default: mongoose } = require("mongoose");

mongoose.connect("mongodb://localhost:27017/")

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    publicKey: String,
    privateKey: String ,
})

const userModel = mongoose.model("users", userSchema)


module.exports = {
    userModel
}