const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { errorHandler } = require("./middleware/errormiddleware");
const authHandler = require("./middleware/authmiddleware");

const wtspRouter = require("./routes/wtsp");
const usersRouter = require("./routes/userroutes");
const contactsRouter = require("./routes/contacts");
const campaignRouter = require("./routes/campaign");

const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/wtsp", wtspRouter);
app.use("/api/users", usersRouter);
app.use("/api/contacts", contactsRouter);
app.use("/api/campaign", campaignRouter);

app.get("/", (req, res) => {
  res.json({ message: "HELLLLOO" });
});

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  connectDB();
  console.log("Listening on PORT ", process.env.PORT);
});
