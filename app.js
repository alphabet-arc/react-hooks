const express = require("express");
const app = express();
const membersRouter = require("./src/routers/teams");

app.use(express.json());

// Mount at root for backend API (tests call /admin/login, /tracker/... directly)
app.use("/", membersRouter);

// Also mount at /api for frontend proxy
app.use("/api", membersRouter);

module.exports = app;
