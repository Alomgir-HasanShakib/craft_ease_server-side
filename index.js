const express = require("express");
const { cors } = require("cors");

const app = express();

// app.use(cors);

const port = process.env.PORT || 500;

app.get("/", (req, res) => {
  res.send("this is server");
});

app.listen(port, () => {
  console.log("Server is running");
});
