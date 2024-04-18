// models/client.js
import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import passport from "passport";



const weightSchema = new mongoose.Schema(
    {
        weight: Number,
        date: {
            type: Date,
            required: true,
        },
    },
    { autoCreate: false },
);

const caloriesSchema = new mongoose.Schema(
    {
        calories: Number,
        date: {
            type: Date,
            required: true,
        },
    },
    { autoCreate: false },
);

const workoutSchema = new mongoose.Schema(
    {
        workouts: Number,
        date: {
            type: Date,
            required: true,
        },
    },
    { autoCreate: false },
);


const cardioSchema = new mongoose.Schema(
    {
        cardio: Number,
        date: {
            type: Date,
            required: true,
        },
    },
    { autoCreate: false },
);



const goalSchema = new mongoose.Schema(
    {
        weight: weightSchema,
        calories: caloriesSchema,
        weeklyWorkouts: workoutSchema,
        weeklyCardio: cardioSchema,
    },
    { autoCreate: false },
);


const dlyCheckInSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
        },
        weight: weightSchema,
        calories: caloriesSchema,
        workouts: workoutSchema,
        cardio: cardioSchema,
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
        workouts: workoutSchema,
        cheatmeals: {
            type: Number,
        },
        cardio: cardioSchema,
        image: {
            type: String,
            default: null,
        },
        comment: {
            type: String,
        },
        dailyCheck: dlyCheckInSchema,
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
const Weight = mongoose.model("Weight", weightSchema);
const Calories = mongoose.model("Calories", caloriesSchema);
const Workout = mongoose.model("Workout", workoutSchema);
const Cardio = mongoose.model("Cardio", cardioSchema);

export { Client, Weekly, Daily, Goals, Weight, Calories, Workout, Cardio };
