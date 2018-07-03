const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Department } = require("./models");
const app = express();
mongoose.Promise = global.Promise;

// const bodyParser = require('body-parser')
// const jsonParser = bodyParser.json()

app.use(express.json());

router.get("/list", (req, res) => {
  Department.find()
    .then(departments => {
      res.json(departments.map(department => department.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

router.get("/list/:id", (req, res) => {
  Department.findById(req.params.id)
    .then(department => res.json(department.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    });
});

router.post("/create", (req, res) => {
  const requiredFields = [
    "position",
    "name",
    "link",
    "state",
    "requirements",
    "salary",
    "description"
  ];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` field in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  const requiredSubset = ["age", "citizenship", "degree"];
  for (let i = 0; i < requiredSubset.length; i++) {
    const field = requiredSubset[i];
    if (!(field in req.body.requirements)) {
      const message = `Missing \`${field}\` field in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Department.create({
    position: req.body.position,
    name: req.body.name,
    link: req.body.link,
    state: req.body.state,
    requirements: req.body.requirements,
    salary: req.body.salary,
    description: req.body.description
  })
    .then(post => res.status(201).json(post.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

router.put("/update/:id", (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message =
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`;
    console.error(message);
    return res.status(400).json({ message: message });
  }

  const toUpdate = {};
  const updateableFields = [
    "position",
    "name",
    "link",
    "state",
    "requirements",
    "salary",
    "description"
  ];
  const updateableSubFields = ["age", "citizenship", "degree"];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  updateableSubFields.forEach(field => {
    if (field in req.body.requirements) {
      toUpdate[field] = req.body.requirements[field];
    }
  });

  Department.findByIdAndUpdate(req.params.id, { $set: toUpdate }, { new: true })
    .then(post => res.status(204).end())
    .catch(err => res.status(500).json({ message: "Internal server error" }));
});

router.delete("/delete/:id", (req, res) => {
  Department.findByIdAndRemove(req.params.id)
    .then(() => {
      console.log(`Deleted post with ID \`${req.params.id}\``);
      res.status(204).end();
    })
    .catch(err => res.status(500).json({ message: "Internal server error" }));
});

module.exports = router;
