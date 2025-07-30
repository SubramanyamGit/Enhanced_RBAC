// models/sign_in.model.js
const sql = require("../config/db");

const getUserByEmailWithRole = async (email) => {
  const [rows] = await sql.query(`
    SELECT 
      u.user_id,
      u.full_name,
      u.email,
      u.password,
      u.user_status,
      u.must_change_password,
      r.name AS role
    FROM users u
    LEFT JOIN user_roles ur ON u.user_id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.role_id
    WHERE u.email = ?
  `, [email]);

  return rows[0]; // undefined if not found
};

module.exports = {
  getUserByEmailWithRole,
};
