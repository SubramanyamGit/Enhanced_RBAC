// routes/permissions.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/permissions.controller');
const authenticate = require('../middlewares/auth.middleware');
const adminOnly = require('../middlewares/adminOnly.middleware');

router.use(authenticate);
router.use(adminOnly);

router.get('/', controller.getPermissions);
router.get('/:id', controller.getPermissionById);
router.post('/', controller.createPermission);
router.patch('/:id', controller.updatePermission);
router.delete('/:id', controller.deletePermission);

module.exports = router;
