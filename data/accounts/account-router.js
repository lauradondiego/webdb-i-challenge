const router = require("express").Router();
const express = require("express");
const db = require("../dbConfig");
router.use(express.json());

router.get("/", (req, res) => {
  db("accounts")
    .select("id", "name", "budget")
    .then(accounts => {
      res.status(200).json(accounts);
    })
    .catch(err => {
      res.json(err);
    });
});
// working and returning all accounts in database

router.post("/", (req, res) => {
  const postAccount = req.body;
  db("accounts")
    .insert(postAccount, "id")
    .then(([id]) => {
      db("accounts")
        .where({ id })
        .then(post => {
          res.status(200).json(post);
        });
    })
    .catch(err => {
      res.json(err);
    });
});
// working and posting new account to database

router.put("/:id", (req, res) => {
  const changes = req.body;
  db("accounts")
    .where("id", req.params.id)
    .update(changes)
    .then(count => {
      res.status(200).json({ message: `updated ${count} account info` });
    })
    .catch(err => {
      res.json(err);
    });
});

router.delete("/:id", (req, res) => {
  db("accounts")
    .where({ id: req.params.id })
    .del()
    .then(count => {
      res.status(200).json({ message: `deleted ${count} account info` });
    })
    .catch(err => {
      res.json(err);
    });
});

module.exports = router;
