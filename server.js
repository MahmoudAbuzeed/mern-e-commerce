require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const v1 = require("./src/routes/v1");

const app = express();

const PORT = process.env.PORT || 5000;

// ----------- Server Config -----------//
app.listen(PORT, () => {
  console.log(`Server run on port ${PORT} `);
});

// ----------- Database Config -----------//

mongoose.connect(process.env.MONGO_DB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("Connected to database");
});
mongoose.connection.on("error", (err) => {
  console.log(`Failed to connect to the database : ${err}`);
});

// ----------- Middlewares -----------//

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ----------- Routes -----------//
app.use("/api/v1", v1);

// ----------- ERRORS -----------//
app.use((req, res, next) => {
  //404 Not Found
  const err = new Error("Not Found");
  err.status = 404;
  naxt(err);
});
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const error = err.message || "Error processing your request";
  res.status(status).send({
    err,
  });
});
