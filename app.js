const express = require("express");
const app = express();
const membersRouter = require("./routers/teams");

app.use(express.json());
app.use("/", membersRouter);

module.exports = app;
