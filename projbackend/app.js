require("dotenv").config();
const express = require("express");
const client = require("./database");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//Routes
const adminAuthRoutes = require("./routes/adminAuth");
const userAuthRoutes = require("./routes/userAuth");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const dutyRoutes = require("./routes/duties");
const ambulanceRoutes = require("./routes/ambulance");

//DB Connection

client.connect().then(() => {
  console.log("DB Connected");
});

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use("/api", adminAuthRoutes);
app.use("/api", userAuthRoutes);
app.use("/api", adminRoutes);
app.use("/api", userRoutes);
app.use("/api", dutyRoutes);
app.use("/api", ambulanceRoutes);

//App Listen
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Connection Established at Port ${port}`);
});
