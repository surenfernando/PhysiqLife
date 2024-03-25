// models/client.js
import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import passport from "passport";

const dlyCheckInSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    weight: {
        type: String,
    },
    calories: {
        type: String,
    },
});

const wklyCheckInSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    workouts: {
        type: String,
    },
    cardio: {
        type: String,
    },
    image: {
        type: String,
        default: null,
    },
    comment: {
        type: String,
    },
});

const clientSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    middleNames: {
        type: [String],
        default: [],
    },
    lastName: {
        type: String,
    },
    preferredName: {
        type: String,
        default: function () {
            return this.firstName; // Defaults to firstName if not provided
        },
    },
    DoB: {
        type: Date,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String,
        default: null,
    },

    dailyCheckIns: {
        type: [dlyCheckInSchema],
    },

    weeklyCheckIns: {
        type: [wklyCheckInSchema],
    },
});

clientSchema.plugin(passportLocalMongoose);
const Client = mongoose.model("Client", clientSchema);
const Daily = mongoose.model("Daily", dlyCheckInSchema);
const Weekly = mongoose.model("Weekly", wklyCheckInSchema);

export { Client, Weekly, Daily };
