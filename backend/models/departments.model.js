const sql = require("../config/db");

module.exports = {
  getAll: async () => {
    const [rows] = await sql.query(`
      SELECT department_id, name, description, created_at
      FROM departments
      ORDER BY department_id DESC
    `);
    return rows;
  },

  getById: async (id) => {
    const [rows] = await sql.query(
      `SELECT department_id, name, description, created_at FROM departments WHERE department_id = ?`,
      [id]
    );
    return rows[0];
  },

  create: async ({ name, description }) => {
    const [result] = await sql.query(
      `INSERT INTO departments (name, description) VALUES (?, ?)`,
      [name, description]
    );
    return { department_id: result.insertId };
  },

  update: async (id, { name, description }) => {
    await sql.query(
      `UPDATE departments SET name = ?, description = ? WHERE department_id = ?`,
      [name, description, id]
    );
    return { success: true };
  },

  remove: async (id) => {
    await sql.query(`DELETE FROM departments WHERE department_id = ?`, [id]);
    return { success: true };
  }
};
