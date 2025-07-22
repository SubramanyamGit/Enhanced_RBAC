// controllers/permissions.controller.js
const permissionModel = require('../models/permissions.model');
const logAudit = require('../utils/auditLoggers');

exports.getPermissions = async (req, res) => {
  try {
    const permissions = await permissionModel.getAll();
    await logAudit({
      userId: req.user.user_id,
      actionType: 'VIEW_PERMISSIONS',
      details: 'Fetched all permissions',
    });
    res.json(permissions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch permissions' });
  }
};

exports.getPermissionById = async (req, res) => {
  try {
    const permission = await permissionModel.getById(req.params.id);
    if (!permission) return res.status(404).json({ error: 'Permission not found' });
    await logAudit({
      userId: req.user.user_id,
      actionType: 'VIEW_PERMISSION',
      details: `Viewed permission ID ${req.params.id}`,
    });
    res.json(permission);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch permission' });
  }
};

exports.createPermission = async (req, res) => {
  try {
    const { name, description } = req.body;
    const result = await permissionModel.create({ name, description });
    await logAudit({
      userId: req.user.user_id,
      actionType: 'CREATE_PERMISSION',
      details: { permission_id: result.permission_id, name },
    });
    res.status(201).json({ message: 'Permission created', permission_id: result.permission_id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create permission' });
  }
};

exports.updatePermission = async (req, res) => {
  try {
    const { name, description } = req.body;
    await permissionModel.update(req.params.id, { name, description });
    await logAudit({
      userId: req.user.user_id,
      actionType: 'UPDATE_PERMISSION',
      details: { permission_id: req.params.id, name },
    });
    res.json({ message: 'Permission updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update permission' });
  }
};

exports.deletePermission = async (req, res) => {
  try {
    await permissionModel.remove(req.params.id);
    await logAudit({
      userId: req.user.user_id,
      actionType: 'DELETE_PERMISSION',
      details: `Deleted permission ID ${req.params.id}`,
    });
    res.json({ message: 'Permission deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete permission' });
  }
};
