import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import { Client, Daily, Weekly, Goals, Weight, Calories, Workout, Cardio } from "./models/index.js";

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


// Function searches array with a input date, 
// returns the index of the matching element with the same date.
function matchDateIndex(searchDate, searchArray){

    const index = searchArray.findIndex((entry) => {
        const entryDate = entry.date;

        // Compare the date components - just the date ignore time
        return (
            entryDate.getDate() === searchDate.getDate() &&
            entryDate.getMonth() === searchDate.getMonth() &&
            entryDate.getFullYear() === searchDate.getFullYear()
        );
    });

    return index;
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
        const user = await Client.findById(req.user.id);

        const tempDate = new Date();
        tempDate.setMinutes(
            tempDate.getMinutes() - tempDate.getTimezoneOffset(),
        );
        const temp = tempDate.toISOString();
        const today = new Date(temp);

        console.log(today);

        const index = matchDateIndex(today, user.dailyCheckIns);
        console.log(user.dailyCheckIns);
        const dailyStats = user.dailyCheckIns[index];

        console.log(index);

        res.render("home", {
            firstName: user.firstName,
            dailyData: dailyStats
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

        const index = matchDateIndex(checkInDate, user.dailyCheckIns);

        if (index !== -1) {
            // If the entry exists, update the weight
            console.log("added to existing daily check");
            user.dailyCheckIns[index].weight = newWeight;
            user.dailyCheckIns[index].date = checkInDate;
        } else {
            // Doesnt exist, create new value
            const newDailyCheckIn = new Daily({
                date: checkInDate,
                weight: newWeight
            });
            console.log("created new daily check")
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

        const index = matchDateIndex(checkInDate, user.dailyCheckIns);

        if (index !== -1) {
            // If the entry exists, update the weight
            console.log("added to existing daily check");
            user.dailyCheckIns[index].calories = newCalorie;
            user.dailyCheckIns[index].date = checkInDate;
        } else {
            // Doesnt exist, create new value
            const newDailyCheckIn = new Daily({
                date: checkInDate,
                calories: newCalorie,
            });
            console.log("created new daily check");
            user.dailyCheckIns.push(newDailyCheckIn);
        }
        
        await user.save();
        res.redirect("/home"); // Redirect to the home page after the operation is complete
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});


app.post("/addWorkout", ensureAuthenticated, async (req, res) => {
    try {
        const { date, workout } = req.body;
        // Parse the date string into a Date object
        const checkInDate = new Date(date);

        console.log(checkInDate);

        const newWorkout = new Workout({
            workouts: workout,
            date: checkInDate
        });

        // Find the user by ID
        const user = await Client.findById(req.user.id);

        const index = matchDateIndex(checkInDate, user.dailyCheckIns);

        if (index !== -1) {
            // If the entry exists, update the weight
            console.log("added to existing daily check")
            user.dailyCheckIns[index].workouts = newWorkout;
            user.dailyCheckIns[index].date = checkInDate;
        } else {
            // Doesnt exist, create new value
            const newDailyCheckIn = new Daily({
                date: checkInDate,
                workouts: newWorkout,
            });
            console.log("created new daily check")
            user.dailyCheckIns.push(newDailyCheckIn);
        }
        
        await user.save();
        res.redirect("/home"); // Redirect to the home page after the operation is complete
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});



app.post("/addCardio", ensureAuthenticated, async (req, res) => {
    try {
        const { date, cardio } = req.body;
        // Parse the date string into a Date object
        const checkInDate = new Date(date);


        console.log(checkInDate);

        const newCardio = new Cardio({
            cardio: cardio,
            date: checkInDate
        });

        // Find the user by ID
        const user = await Client.findById(req.user.id);

        const index = matchDateIndex(checkInDate, user.dailyCheckIns);


        if (index !== -1) {
            // If the entry exists, update the weight
            console.log("added to existing daily check")
            user.dailyCheckIns[index].cardio = newCardio;
            user.dailyCheckIns[index].date = checkInDate;
        } else {
            // Doesnt exist, create new value
            const newDailyCheckIn = new Daily({
                date: checkInDate,
                cardio: newCardio,
            });
            console.log("created new daily check")
            user.dailyCheckIns.push(newDailyCheckIn);
        }
        
        await user.save();
        res.redirect("/home"); // Redirect to the home page after the operation is complete
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});




app.post("/setGoals", ensureAuthenticated, async (req, res) => {
    try {
        const { weight, calories, workouts, cardio, date } = req.body;
        const checkInDate = new Date(date);


        const newGoals = new Goals({
            weight: new Weight({
                weight: weight,
                date: checkInDate
            }),
            calories: new Calories({
                calories: calories,
                date: checkInDate
            }),
            weeklyWorkouts: new Workout({
                workouts: workouts,
                date: checkInDate
            }),
            weeklyCardio: new Cardio({
                cardio: cardio,
                date: checkInDate
            }),
        });

        const foundClient = await Client.findById(req.user.id);

        if (foundClient) {
            foundClient.goals = newGoals;
            await foundClient.save();
            res.redirect("/home");
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
