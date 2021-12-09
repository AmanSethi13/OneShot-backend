const express = require("express");
const dotenv = require("dotenv");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const studentRoutes = require("./routes/student-routes");
const collegeRoutes = require("./routes/college-routes");
app.use(bodyParser.json());
app.use(cors());
app.options("*", cors());

app.use("/api/student", studentRoutes);
app.use("/api/college", collegeRoutes);

dotenv.config({ path: "./config.env" });

const PORT = process.env.PORT || 5000;
const DB =
  "mongodb+srv://amansethi:nIG0Vhjekzkveirf@cluster0.26lyh.mongodb.net/mern-new-project?retryWrites=true&w=majority";

mongoose
  .connect(
    DB,

    {
      useUnifiedTopology: true,
      useCreateIndex: true,
      useNewUrlParser: true,
    }
  )
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`server has started successfully on port ${PORT}`);
});
