const RoleModel = require("../models/roles.model");

exports.getRoles = async (req, res) => {
  try {
    const roles = await RoleModel.getAllRoles();
    res.json(roles);
  } catch (err) {
    console.error("Get Roles Error:", err);
    res.status(500).json({ error: "Failed to fetch roles" });
  }
};
