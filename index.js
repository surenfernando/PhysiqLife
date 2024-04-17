import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import { Client, Daily, Weekly, Goals, Weight, Calories } from "./models/index.js";

dotenv.config();

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Setting up cookie data for login saves
app.use(
    session({
        secret: process.env.LOVENOTE,
        resave: false,
        saveUninitialized: false,
    }),
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGODB_URI);

passport.use(Client.createStrategy());
passport.serializeUser(Client.serializeUser());
passport.deserializeUser(Client.deserializeUser());

// Middleware to check if user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
}

app.get("/", async (req, res) => {
    const result = await Client.find().select("+hash +salt");
    if (req.isAuthenticated()) {
        // If user is authenticated, redirect to "/home"
        return res.redirect("/home");
    } else {
        // If user is not authenticated, redirect to "/login"
        res.render("login");
    }
});

app.get("/home", ensureAuthenticated, async (req, res) => {
    try {
        //Get today date
        const checkInDate = new Date();
        // Find the user by ID
        const user = await Client.findById(req.user.id);
        // console.log(user);

        res.render("home", {
            firstName: user.firstName,
        });

    } catch (error) {
        console.error(error);
    }
});

app.get("/nav", (req, res) => {
    res.render("home", {
        firstName: "Suren Fernando",
    });
});

app.get("/checkin", (req, res) => {
    res.render("checkIns", {
        firstName: "Suren Fernando",
    });
});

// POST ROUTES
app.post("/addWeight", ensureAuthenticated, async (req, res) => {
    try {
        const { date, weight } = req.body;
        // Parse the date string into a Date object
        const checkInDate = new Date(date);

        console.log(checkInDate);
        const newWeight = new Weight({
            weight: weight,
            date: checkInDate
        });

        // Find the user by ID
        const user = await Client.findById(req.user.id);

        const index = user.dailyCheckIns.findIndex((entry) => {
            const entryDate = entry.date;

            // Compare the date components - just the date ignore time
            return (
                entryDate.getDate() === checkInDate.getDate() &&
                entryDate.getMonth() === checkInDate.getMonth() &&
                entryDate.getFullYear() === checkInDate.getFullYear()
            );
        });

        if (index !== -1) {
            // If the entry exists, update the weight
            user.dailyCheckIns[index].weight = newWeight;
            user.dailyCheckIns[index].date = checkInDate;
        } else {
            // Doesnt exist, create new value
            const newDailyCheckIn = new Daily({
                date: checkInDate,
                weight: newWeight
            });
            user.dailyCheckIns.push(newDailyCheckIn);
        }
        
        await user.save();
        res.redirect("/home"); // Redirect to the home page after the operation is complete
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.post("/addCalories", ensureAuthenticated, async (req, res) => {
    try {
        const { date, calories } = req.body;
        // Parse the date string into a Date object
        const checkInDate = new Date(date);

        console.log(checkInDate);

        const newCalorie = new Calories({
            calories: calories,
            date: checkInDate
        });

        // Find the user by ID
        const user = await Client.findById(req.user.id);

        const index = user.dailyCheckIns.findIndex((entry) => {
            const entryDate = entry.date;

            // Compare the date components - just the date ignore time
            return (
                entryDate.getDate() === checkInDate.getDate() &&
                entryDate.getMonth() === checkInDate.getMonth() &&
                entryDate.getFullYear() === checkInDate.getFullYear()
            );
        });

        if (index !== -1) {
            // If the entry exists, update the weight
            user.dailyCheckIns[index].calories = newCalorie;
            user.dailyCheckIns[index].date = checkInDate;
        } else {
            // Doesnt exist, create new value
            const newDailyCheckIn = new Daily({
                date: checkInDate,
                calories: newCalorie,
            });
            user.dailyCheckIns.push(newDailyCheckIn);
        }
        
        await user.save();
        res.redirect("/home"); // Redirect to the home page after the operation is complete
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.post("/setGoal", ensureAuthenticated, async (req, res) => {
    try {
        const { weight, calories, workouts, cardio } = req.body;

        const newGoals = new Goals({
            weight: weight,
            calories: calories,
            weeklyWorkouts: workouts,
            weeklyCardio: cardio,
        });

        //Look for client object
        const clientId = req.user.id;
        const foundClient = await Client.findById(clientId);

        if (foundClient) {
            foundClient.goals = newGoals;
            await foundClient.save();
            res.redirect("/checkin");
        }
    } catch (err) {
        console.log(err);
    }
});

app.post("/dailyCheck", ensureAuthenticated, async (req, res) => {
    try {
        const { date, weight, calories } = req.body;

        // Create a new daily check-in object using the Daily
        const newDailyCheckIn = new Daily({
            date: new Date(date), // Convert date string to Date object
            weight,
            calories,
        });

        //Look for client object
        const clientId = req.user.id;
        const foundClient = await Client.findById(clientId);

        console.log("Check here");

        if (foundClient) {
            foundClient.dailyCheckIns.push(newDailyCheckIn);
            await foundClient.save();
            res.redirect("/checkin");
        }
    } catch (err) {
        console.log(err);
    }
});

app.post("/weeklyCheck", ensureAuthenticated, async (req, res) => {
    try {
        const { date, workouts, cardio, comment } = req.body;

        // Create a new weekly check-in object using the Weekly
        const newDailyCheckIn = new Weekly({
            date: new Date(date), // Convert date string to Date object
            workouts,
            cardio,
            comment,
        });

        //Look for client object
        const clientId = req.user.id;
        const foundClient = await Client.findById(clientId);

        if (foundClient) {
            foundClient.weeklyCheckIns.push(newDailyCheckIn);
            await foundClient.save();
            res.redirect("/checkin");
        }
    } catch (err) {
        console.log(err);
    }
});

app.post("/signup", async (req, res) => {
    const dobString = req.body.DoB;
    const dob = new Date(dobString);

    //Contruct Client object using form data
    const newClient = new Client({
        firstName: req.body.firstName,
        middleNames: [],
        lastName: req.body.lastName,
        preferredName: req.body.firstName,
        DoB: dob,
        username: req.body.username,
        image: null,
    });

    try {
        // Register the user
        const client = await Client.register(newClient, req.body.password);
        // Authenticate the user
        req.login(client, function (err) {
            if (err) {
                console.error(err);
                res.redirect("/");
            } else {
                passport.authenticate("local")(req, res, function () {
                    res.redirect("/home");
                });
            }
        });
    } catch (error) {
        console.error(error);
        res.render("login", {
            error: "Registration failed. Please try again.",
        });
    }
});

app.post("/guest", async function (req, res) {
    req.body.username = "guest@gmail.com";
    req.body.password = "jackie";

    const username = req.body.username;
    const password = req.body.password;

    const guest = new Client({
        username: username,
        password: password,
    });

    req.login(guest, function (err) {
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            passport.authenticate("local", {
                failureRedirect: "/",
            })(req, res, function () {
                res.redirect("/home");
            });
        }
    });
});

app.post("/login", async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    const client = new Client({
        username: username,
        password: password,
    });

    req.login(client, function (err) {
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            passport.authenticate("local", {
                failureRedirect: "/",
            })(req, res, function () {
                res.redirect("/home");
            });
        }
    });
});

app.post("/logout", function (req, res) {
    req.logout(function (err) {
        if (err) {
            console.log(err);
        }
        res.redirect("/");
    });
});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
    console.log(port);
}

app.listen(port, () => {
    console.log(`Server is running. All a GO!!`);
});
