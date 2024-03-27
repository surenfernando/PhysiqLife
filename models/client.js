// models/client.js
import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import passport from "passport";

const goalSchema = new mongoose.Schema(
    {
        weight: Number,
        calories: Number,
        weeklyWorkouts: Number,
        weeklyCardio: Number,
    },
    { autoCreate: false },
);

const dlyCheckInSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
        },
        weight: {
            type: Number,
        },
        calories: {
            type: Number,
        },
        comment: {
            type: String,
        },
    },
    { autoCreate: false },
);

const wklyCheckInSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
        },
        workouts: {
            type: Number,
        },
        cheatmeals: {
            type: Number,
        },
        cardio: {
            type: Number,
        },
        image: {
            type: String,
            default: null,
        },
        comment: {
            type: String,
        },
    },
    { autoCreate: false },
);

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
    goals: goalSchema,
});

clientSchema.plugin(passportLocalMongoose);
const Client = mongoose.model("Client", clientSchema);
const Daily = mongoose.model("Daily", dlyCheckInSchema);
const Weekly = mongoose.model("Weekly", wklyCheckInSchema);
const Goals = mongoose.model("Goals", goalSchema);

export { Client, Weekly, Daily, Goals };
