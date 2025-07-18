const express = require("express");
const router = express.Router();
const RolesController = require("../controllers/roles.controller");
const authenticate = require("../middlewares/auth.middleware");

router.get("/", authenticate, RolesController.getRoles);

module.exports = router;
