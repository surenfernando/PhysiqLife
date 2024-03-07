import express from "express";
import axios from "axios";
import bodyParser from "body-parser";


const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});



app.get("/", (req, res) => {
  res.render("index.ejs", { 
    content: "Waiting for data..." 
  });
});




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
