const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const router = require("./router/Router_index.js");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

//Router
app.use("/api/", router);

//health
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
