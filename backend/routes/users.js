const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");
const authenticate = require("../middlewares/auth.middleware");
const adminOnly = require("../middlewares/adminOnly.middleware");

//Protect all routes below
router.use(authenticate);

// All user routes are admin-only
router.use(adminOnly); 

//Fetch permissions + menu for signed-in user
router.get("/my_permissions", usersController.getMyPermissions);

// CRUD
router.get("/", usersController.getUsers);
router.get("/:id", usersController.getUserById);
router.post("/", usersController.createUser);
router.patch("/:id", usersController.updateUser);
router.delete("/:id", usersController.deleteUser);

module.exports = router;
