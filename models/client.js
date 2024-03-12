// models/client.js
import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    // required: true
  },
  middleNames: {
    type: [String],
    default: [],
  },
  lastName: {
    type: String,
    required: true,
  },
  preferredName: {
    type: String,
    default: function () {
      return this.firstName; // Defaults to firstName if not provided
    },
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: null,
  },
});

const Client = mongoose.model("Client", clientSchema);

const client1 = new Client({
  firstName: "John",
  middleNames: ["Doe"],
  lastName: "Smith",
  preferredName: "John",
  age: 30,
  email: "john@example.com",
  password: "password123",
  image: "https://example.com/john.jpg",
});

const client2 = new Client({
  firstName: "Alice",
  middleNames: [],
  lastName: "Johnson",
  preferredName: "Alice",
  age: 25,
  email: "alice@example.com",
  password: "securepass",
  image: "https://example.com/alice.jpg",
});

const client3 = new Client({
  firstName: "Michael",
  middleNames: ["David", "James"],
  lastName: "Brown",
  preferredName: "Mike",
  age: 35,
  email: "mike@example.com",
  password: "strongpassword",
  image: null, // No image provided
});

const Sample = [client1, client2, client3];

// Client.insertMany(Sample);

export { Client };
