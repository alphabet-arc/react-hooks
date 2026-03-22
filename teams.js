const express = require("express");
const membersRouter = new express.Router();
const Admin = require("../mongoose/models/admin");
const Members = require("../mongoose/models/members");
const Teams = require("../mongoose/models/teams");
const auth = require("../middlewares/auth");
const jwt = require("jsonwebtoken");
const { helpers } = require("../../helper");

// 1) POST /admin/login
membersRouter.post("/admin/login", async (req, res) => {
  try {
    const { name, password } = req.body;
    const admin = await Admin.findOne({ name, password });
    if (!admin) {
      return res.status(400).send({ error: "Username or password is wrong" });
    }
    const token = jwt.sign({ _id: admin._id.toString() }, helpers.secret_token);
    admin.tokens = admin.tokens.concat({ token });
    await admin.save();
    res.status(200).send({ admin, token });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// 2) POST /tracker/members/add
membersRouter.post("/tracker/members/add", auth, async (req, res) => {
  try {
    const { employee_id, employee_name, technology_name, experience } = req.body;
    const existing = await Members.findOne({ employee_id, technology_name });
    if (existing) {
      return res.status(400).send({ error: "Member with same team already exists" });
    }
    const teamExists = await Teams.findOne({ name: technology_name });
    if (!teamExists) {
      const newTeam = new Teams({ name: technology_name });
      await newTeam.save();
    }
    const member = new Members({ employee_id, employee_name, technology_name, experience });
    await member.save();
    res.status(201).send(member);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// 3) GET /tracker/technologies/get
membersRouter.get("/tracker/technologies/get", auth, async (req, res) => {
  try {
    const teams = await Teams.find({});
    res.status(200).send(teams);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// 4) POST /tracker/technologies/add
membersRouter.post("/tracker/technologies/add", auth, async (req, res) => {
  try {
    const name = req.body.name || req.body.technology_name;
    const existing = await Teams.findOne({ name });
    if (existing) {
      return res.status(400).send({ error: "Team already exist" });
    }
    const team = new Teams({ name });
    await team.save();
    res.status(201).send(team);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// 5) DELETE /tracker/technologies/remove/:name
membersRouter.delete("/tracker/technologies/remove/:name", auth, async (req, res) => {
  try {
    const team = await Teams.findOneAndDelete({ name: req.params.name });
    if (!team) {
      return res.status(400).send({ error: "Couldn't delete the team" });
    }
    res.status(200).send(team);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// 6) PATCH /tracker/members/update/:id
membersRouter.patch("/tracker/members/update/:id", auth, async (req, res) => {
  try {
    const member = await Members.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!member) {
      return res.status(400).send({ error: "Member not found" });
    }
    res.status(200).send(member);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// 7) GET /tracker/members/display
membersRouter.get("/tracker/members/display", auth, async (req, res) => {
  try {
    const { tech, experience } = req.query;
    let query = {};
    if (tech) query.technology_name = tech;
    if (experience) query.experience = { $gte: Number(experience) };
    const members = await Members.find(query);
    res.status(200).send(members);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// 8) DELETE /tracker/members/delete/:id
membersRouter.delete("/tracker/members/delete/:id", auth, async (req, res) => {
  try {
    const member = await Members.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(400).send({ error: "Member not found" });
    }
    res.status(200).send(member);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

module.exports = membersRouter;
