import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import * as dotenv from "dotenv";


dotenv.config();
// Check if MongoDB URI is present in environment variables



const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



// mongoose.connect(process.env.MONGODB_URI);



// const userSchema = {
//   name : String,
//   password : String,
// }

// const User = mongoose.model("User", userSchema);

// const user1 = new User({
//   name: "Alice",
//   password: "password123"
// });

// const user2 = new User({
//   name: "Bob",
//   password: "securepassword"
// });

// const user3 = new User({
//   name: "Charlie",
//   password: "123456"
// });


// const testUsers = [user1, user2, user3];
// User.insertMany(testUsers);

app.get("/", async (req, res) => {
  // const result = await User.find();
  console.log(result);
  res.render("index", { 
    content: "Waiting for data..."
    // data: result
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
