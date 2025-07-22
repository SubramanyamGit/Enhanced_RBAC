const sql = require("../config/db");

module.exports = {
 getAll: async () => {
  const [rows] = await sql.query(`
    SELECT r.role_id, r.name, r.created_at, r.department_id, d.name AS department_name
    FROM roles r
    LEFT JOIN departments d ON r.department_id = d.department_id  
    ORDER BY r.role_id DESC
  `);
  return rows;
},


  getById: async (id) => {
    const [rows] = await sql.query(`SELECT * FROM roles WHERE role_id = ?`, [id]);
    return rows[0];
  },

  create: async ({ name, department_id }) => {
    const [result] = await sql.query(
      `INSERT INTO roles (name, department_id) VALUES (?, ?)`,
      [name, department_id]
    );
    return { role_id: result.insertId };
  },

  update: async (id, { name, department_id }) => {
    await sql.query(
      `UPDATE roles SET name = ?, department_id = ? WHERE role_id = ?`,
      [name, department_id, id]
    );
    return { success: true };
  },

  remove: async (id) => {
    await sql.query(`DELETE FROM roles WHERE role_id = ?`, [id]);
    return { success: true };
  },
};
