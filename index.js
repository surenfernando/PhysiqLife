import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import { Client } from "./models/index.js";

dotenv.config();

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Setting up cookie data for login saves
app.use(session({
  secret: process.env.LOVENOTE,
  resave: false,
  saveUninitialized: false
}));

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
  const result = await Client.find().select('+hash +salt');
  console.log(result);
  res.render("login");
});

app.get("/home", ensureAuthenticated, async (req, res) => {
  const result = await Client.find();
  console.log(result);
  try {
    const user = req.user; 
    res.render("home", { 
      firstName: user.firstName 
    });
  } catch (error) {
    console.error(error);
  }
});

app.get("/nav",(req, res) => {
  res.render("partials/navbar.ejs")
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
    req.login(client, function(err) {
        if (err) {
            console.error(err);
            res.redirect("/");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/home");
            });
        };
    });
  } catch (error) {
      console.error(error);
      res.render("login", { error: "Registration failed. Please try again." });
  };
});






app.post("/login", async function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const client = new Client({
      username: username,
      password: password      
  });

  req.login(client, function(err){
      if (err) {
          console.log(err);
          res.redirect("/");
      } else {
          passport.authenticate("local")(req, res, function(){
              res.redirect("/home");
          });     
      };
  });
});


app.post("/logout", function(req, res) {
  req.logout(function(err) {
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
