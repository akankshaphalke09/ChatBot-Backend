import mongoose from "mongoose";
import { Schema } from "mongoose";

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
});
console.log("User model loaded");
const UserModel = mongoose.model('User', UserSchema,"users");
export { UserModel };