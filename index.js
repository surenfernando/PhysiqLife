import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import mongoose from "mongoose";


const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



mongoose.connect("mongodb+srv://admin-suren:testingDB123@dbtrackercluster.qlzgzdj.mongodb.net/Users?retryWrites=true&w=majority&appName=dbTrackerCluster/");

const userSchema = {
  name : String,
  password : String,
}

const User = mongoose.model("User", userSchema);

const user1 = new User({
  name: "Alice",
  password: "password123"
});

const user2 = new User({
  name: "Bob",
  password: "securepassword"
});

const user3 = new User({
  name: "Charlie",
  password: "123456"
});


const testUsers = [user1, user2, user3];
User.insertMany(testUsers);

app.get("/", (req, res) => {
  res.render("index.ejs", { 
    content: "Waiting for data..." 
  });
});




app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${port}`);
});
