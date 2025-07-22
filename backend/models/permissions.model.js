// models/permissions.model.js
const sql = require('../config/db');

module.exports = {
  getAll: async () => {
    const [rows] = await sql.query(`SELECT * FROM permissions ORDER BY permission_id DESC`);
    return rows;
  },

  getById: async (id) => {
    const [rows] = await sql.query(`SELECT * FROM permissions WHERE permission_id = ?`, [id]);
    return rows[0];
  },

  create: async ({ name, description }) => {
    const [result] = await sql.query(
      `INSERT INTO permissions (permission_name, permission_description) VALUES (?, ?)`,
      [name, description]
    );
    return { permission_id: result.insertId };
  },

  update: async (id, { name, description }) => {
    await sql.query(
      `UPDATE permissions SET permission_name = ?, permission_description = ? WHERE permission_id = ?`,
      [name, description, id]
    );
    return { success: true };
  },

  remove: async (id) => {
    await sql.query(`DELETE FROM permissions WHERE permission_id = ?`, [id]);
    return { success: true };
  },
};
