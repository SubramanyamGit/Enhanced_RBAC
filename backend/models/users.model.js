const sql = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

/** Groups permissions logically */
const groupPermissions = (permissions) => {
  const grouped = {
    users: [],
    roles: [],
    approvals: [],
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
  // Get permissions + menu from token
  getUserPermissions: async (token) => {
    if (!token) throw new Error("Unauthorized");

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
      throw new Error("Invalid token");
    }

    const userId = payload.user_id;

    // 1. Fetch distinct permissions from roles + JIT permissions
    const [permResults] = await sql.query(
      `
    SELECT DISTINCT p.name FROM permissions p
    JOIN role_permissions rp ON p.permission_id = rp.permission_id
    JOIN user_roles ur ON rp.role_id = ur.role_id
    WHERE ur.user_id = ?
    UNION
    SELECT DISTINCT p.name FROM permissions p
    JOIN user_permissions up ON p.permission_id = up.permission_id
    WHERE up.user_id = ? AND (up.expires_at IS NULL OR up.expires_at > NOW())
  `,
      [userId, userId]
    );

    const permissionNames = permResults.map((p) => p.name);
    const groupedPermissions = groupPermissions(permissionNames); // { users: [...], roles: [...], etc. }

    // 2. Fetch menus by permission match (we just need keys)
    const [menuResults] = await sql.query(
      `
    SELECT DISTINCT m.id, m.label, m.route, m.menu_key
    FROM menus m
    JOIN menu_permissions mp ON m.id = mp.menu_id
    WHERE mp.permission_name IN (?)
  `,
      [permissionNames]
    );

    const menu = menuResults.map((menuItem) => {
      const key = menuItem.menu_key;
      return {
        label: menuItem.label,
        key: key,
        route: menuItem.route,
        permissions: groupedPermissions[key] || [],
      };
    });

    return {
      full_name: payload.full_name,
      role: payload.role,
      permissions: groupedPermissions,
      menu,
    };
  },
  // Create user and assign role
  createUserWithRole: async (userData, roleId) => {
    const conn = await sql.getConnection();
    try {
      await conn.beginTransaction();

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const [userResult] = await conn.query(
        `INSERT INTO users (full_name, email, password, user_status)
         VALUES (?, ?, ?, ?)`,
        [
          userData.full_name,
          userData.email,
          hashedPassword,
          userData.user_status || "Active",
        ]
      );

      const userId = userResult.insertId;

      await conn.query(
        `INSERT INTO user_roles (user_id, role_id)
         VALUES (?, ?)`,
        [userId, roleId]
      );

      await conn.commit();
      return { success: true, userId };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  // Get all users with roles
  getAll: async () => {
    const [rows] = await sql.query(`
    SELECT 
      u.user_id,
      u.full_name,
      u.email,
      u.user_status,
      GROUP_CONCAT(r.name) AS roles,
      ur.role_id
    FROM users u
    LEFT JOIN user_roles ur ON u.user_id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.role_id
    GROUP BY u.user_id, ur.role_id
  `);
    return rows;
  },

  // Get one user
  getById: async (id) => {
    const [rows] = await sql.query(`SELECT * FROM users WHERE user_id = ?`, [
      id,
    ]);
    return rows[0];
  },

  // Update user
  updateUser: async (user_id, updatedData, role_id) => {
    const conn = await sql.getConnection();
    try {
      await conn.beginTransaction();

      const updates = [];
      const values = [];

      if (updatedData.full_name) {
        updates.push("full_name = ?");
        values.push(updatedData.full_name);
      }

      if (updatedData.user_status) {
        updates.push("user_status = ?");
        values.push(updatedData.user_status);
      }

      if (updatedData.password) {
        const hashed = await bcrypt.hash(updatedData.password, 10);
        updates.push("password = ?");
        values.push(hashed);
      }

      if (updates.length > 0) {
        const updateQuery = `UPDATE users SET ${updates.join(
          ", "
        )} WHERE user_id = ?`;
        await conn.query(updateQuery, [...values, user_id]);
      }

      if (role_id) {
        await conn.query(`DELETE FROM user_roles WHERE user_id = ?`, [user_id]);
        await conn.query(
          `INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)`,
          [user_id, role_id]
        );
      }

      await conn.commit();
      return { success: true };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  // Delete user and role mapping
  deleteUser: async (user_id) => {
    const conn = await sql.getConnection();
    try {
      await conn.beginTransaction();
      await conn.query(`DELETE FROM user_roles WHERE user_id = ?`, [user_id]);
      await conn.query(`DELETE FROM users WHERE user_id = ?`, [user_id]);
      await conn.commit();
      return { success: true };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },
};
