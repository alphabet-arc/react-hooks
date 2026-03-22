const express = require("express");
const membersRouter = new express.Router();
const Admin = require("../mongoose/models/admin");
const Members = require("../mongoose/models/members");
const Teams = require("../mongoose/models/teams");
const auth = require("../middlewares/auth");
const jwt = require("jsonwebtoken");
const { helpers: { secret_token } } = require("../helper");

// 1) POST /admin/login
membersRouter.post("/admin/login", async (req, res) => {
  try {
    const { name, password } = req.body;
    const admin = await Admin.findOne({ name, password });
    if (!admin) {
      return res.status(400).send({ error: "Username or password is wrong" });
    }
    const token = jwt.sign({ _id: admin._id.toString() }, secret_token);
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

    // Check if member with same employee_id and technology_name already exists
    const existing = await Members.findOne({ employee_id, technology_name });
    if (existing) {
      return res.status(400).send({ error: "Member with same team already exists" });
    }

    // Create member first to trigger validation BEFORE auto-creating team
    const member = new Members({ employee_id, employee_name, technology_name, experience });
    await member.validate(); // throws if invalid - before we touch teams

    // Only auto-create team if member data is valid
    const teamExists = await Teams.findOne({ name: technology_name });
    if (!teamExists) {
      const newTeam = new Teams({ name: technology_name });
      await newTeam.save();
    }

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
    // Also delete all members belonging to this team
    await Members.deleteMany({ technology_name: req.params.name });
    res.status(200).send(team);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// 6) PATCH /tracker/members/update/:id
membersRouter.patch("/tracker/members/update/:id", auth, async (req, res) => {
  try {
    // Manually validate the fields being updated
    const allowedUpdates = ["employee_id", "employee_name", "technology_name", "experience"];
    const updates = Object.keys(req.body);

    // Validate employee_id if provided
    if (req.body.employee_id !== undefined) {
      const eid = Number(req.body.employee_id);
      if (eid < 100000 || eid > 3000000) {
        return res.status(400).send({ error: "Employee ID is expected between 100000 and 3000000" });
      }
    }

    // Validate employee_name if provided
    if (req.body.employee_name !== undefined) {
      const ename = req.body.employee_name;
      if (!/^[a-zA-Z ]+$/.test(ename) || ename.length <= 2) {
        return res.status(400).send({ error: "Invalid employee name" });
      }
    }

    // Validate experience if provided
    if (req.body.experience !== undefined) {
      if (Number(req.body.experience) < 0) {
        return res.status(400).send({ error: "Experience should be >= 0" });
      }
    }

    const member = await Members.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
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
