const roleModel = require("../models/roles.model");
const logAudit = require("../utils/auditLoggers");

exports.getRoles = async (req, res) => {
  try {
    const roles = await roleModel.getAll();
    await logAudit({
      userId: req.user.user_id,
      actionType: "VIEW_ROLES",
      details: "Fetched all roles",
    });
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch roles" });
  }
};

exports.getRoleById = async (req, res) => {
  try {
    const role = await roleModel.getById(req.params.id);
    if (!role) return res.status(404).json({ error: "Role not found" });
    await logAudit({
      userId: req.user.user_id,
      actionType: "VIEW_ROLE",
      details: `Viewed role ID ${req.params.id}`,
    });
    res.json(role);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch role" });
  }
};

exports.createRole = async (req, res) => {
  try {
    const { name, department_id } = req.body;
    const result = await roleModel.create({ name, department_id });
    await logAudit({
      userId: req.user.user_id,
      actionType: "CREATE_ROLE",
      details: { role_id: result.role_id, name, department_id },
    });
    res.status(201).json({ message: "Role created", role_id: result.role_id });
  } catch (err) {
    res.status(500).json({ error: "Failed to create role" });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { name, department_id } = req.body;
    await roleModel.update(req.params.id, { name, department_id });
    await logAudit({
      userId: req.user.user_id,
      actionType: "UPDATE_ROLE",
      details: { role_id: req.params.id, name, department_id },
    });
    res.json({ message: "Role updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update role" });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    await roleModel.remove(req.params.id);
    await logAudit({
      userId: req.user.user_id,
      actionType: "DELETE_ROLE",
      details: `Deleted role ID ${req.params.id}`,
    });
    res.json({ message: "Role deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete role" });
  }
};
