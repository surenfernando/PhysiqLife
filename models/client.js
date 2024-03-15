// models/client.js
import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import passport from "passport";


const clientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  middleNames: {
    type: [String],
    default: [],
  },
  lastName: {
    type: String
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
});

clientSchema.plugin(passportLocalMongoose);
const Client = mongoose.model("Client", clientSchema);




// Client.insertMany(Sample);

export { Client };
