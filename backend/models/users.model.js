const sql = require("../config/db");
const jwt = require("jsonwebtoken");

const groupPermissions = (permissions) => {
  const grouped = {
    users: [],
    roles: [],
    approvals: [],
    // Extend with more groups as needed
  };
  permissions.forEach((perm) => {
    if (perm.includes("user")) grouped.users.push(perm);
    else if (perm.includes("role")) grouped.roles.push(perm);
    else if (perm.includes("approve")) grouped.approvals.push(perm);
    else {
      if (!grouped.misc) grouped.misc = [];
      grouped.misc.push(perm);
    }
  });
  return grouped;
};

module.exports = {
  getUserPermissions: (token, callback) => {
    if (!token) return callback({ message: "Unauthorized" });

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
      return callback({ message: "Invalid token" });
    }

    const userId = payload.user_id;

    // 1. Get permissions from roles + JIT
    const permissionsQuery = `
      SELECT DISTINCT p.name FROM permissions p
      JOIN role_permissions rp ON p.permission_id = rp.permission_id
      JOIN user_roles ur ON rp.role_id = ur.role_id
      WHERE ur.user_id = ?
      UNION
      SELECT DISTINCT p.name FROM permissions p
      JOIN user_permissions up ON p.permission_id = up.permission_id
      WHERE up.user_id = ? AND (up.expires_at IS NULL OR up.expires_at > NOW())
    `;

    sql.query(permissionsQuery, [userId, userId], (permErr, permResults) => {
      if (permErr) return callback(permErr);

      const permissionNames = permResults.map((p) => p.name);
      const groupedPermissions = groupPermissions(permissionNames);

      // 2. Get menu for those permissions
      const menuQuery = `
        SELECT m.id, m.label, m.route, m.menu_key, mp.permission_name
        FROM menus m
        JOIN menu_permissions mp ON m.id = mp.menu_id
        WHERE mp.permission_name IN (?)
      `;

      sql.query(menuQuery, [permissionNames], (menuErr, menuResults) => {
        if (menuErr) return callback(menuErr);

        const menuMap = {};
        menuResults.forEach((row) => {
          if (!menuMap[row.id]) {
            menuMap[row.id] = {
              label: row.label,
              key: row.menu_key,
              route: row.route,
              permissions: [],
            };
          }
          menuMap[row.id].permissions.push(row.permission_name);
        });

        const menu = Object.values(menuMap);

        callback(null, {
          full_name: payload.full_name,
          role: payload.role,
          permissions: groupedPermissions,
          menu,
        });
      });
    });
  },
};
