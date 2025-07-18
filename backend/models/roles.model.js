const sql = require("../config/db");

module.exports = {
  getAllRoles: async () => {
    const [rows] = await sql.query(
      `SELECT role_id, name FROM roles ORDER BY name ASC`
    );
    return rows;
  },
};
