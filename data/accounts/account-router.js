const router = require("express").Router();
const express = require("express");
const db = require("../dbConfig");
router.use(express.json());

router.get("/", (req, res) => {
  db("accounts") // same as saying (db.select('*').from('accounts'))
    .select("id", "name", "budget")

    .then(accounts => {
      res.status(200).json(accounts);
    })
    .catch(err => {
      res.json(err);
    });
});
// working and returning all accounts in database

router.get("/:id", (req, res) => {
  const { id } = req.params;
  db("accounts")
    .where({ id })
    .then(accounts => {
      // we must check the length to find our if our user exists
      if (accounts.length) {
        res.json(accounts);
      } else {
        res
          .status(404)
          .json({ message: "Could not find account with given id." });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Failed to get accoount" });
    });
});
// getting account by ID

router.post("/", validateAccountPost, (req, res) => {
  const postAccount = req.body;
  db("accounts")
    .insert(postAccount, "id")
    .then(([id]) => {
      db("accounts")
        .where({ id })
        // .where({ id: id[0] }) you can do this if you take the brackets out of the
        // then statement around ID
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
// working and updating by ID - returns a number of accounts changed

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
// working and deleting by ID - returns a number of accounts deleted

// Custom Middleware
function validateAccountPost(req, res, next) {
  if (Object.keys(req.body) < 1) {
    res.status(400).json({ message: "missing account data" });
  } else if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" });
  } else if (!req.body.budget) {
    res.status(400).json({ message: "missing required budget field" });
  }
  next();
}
module.exports = router;
