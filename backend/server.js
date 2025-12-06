// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("Auth Backend Running"));

const PORT = process.env.PORT || 4000;
const MONGO = process.env.MONGO_URI;

mongoose
  .connect(MONGO)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () =>
      console.log(`Server listening on port ${PORT}`)
    );
  })
  .catch((err) => console.error("Mongo connection error:", err));
