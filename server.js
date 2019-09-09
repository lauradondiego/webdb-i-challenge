const express = require("express");

const AccountRouter = require("./data/accounts/account-router");

const server = express();

server.use(express.json());

server.use("/accounts", AccountRouter);

server.get("/", (req, res) => {
  res.status(200).json({ api: "Accounts API is up and running!" });
});

module.exports = server;
