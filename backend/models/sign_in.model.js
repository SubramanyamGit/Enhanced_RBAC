const sql = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  signIn: (req, callback) => {
    const { email, password: inputPassword } = req.body;
    console.log("Running")
    const userQuery = `
      SELECT user_id, password, full_name, user_status 
      FROM users 
      WHERE email = ?
    `;

    sql.query(userQuery, [email], (err, results) => {
      console.log("Results",results)
      if (err) return callback(err);
      if (!results.length) return callback({ message: "Invalid credentials" });

      const user = results[0];
      const isPasswordValid = bcrypt.compareSync(inputPassword, user.password);
      console.log("isPasswordValid",isPasswordValid,inputPassword)
      if (user.user_status === "Inactive") {
        return callback({ message: "Account inactive. Contact admin." });
      }
      if (!isPasswordValid) {
        return callback({ message: "Invalid credentials" });
      }

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

      sql.query(permissionsQuery, [user.user_id, user.user_id], (permErr, permResults) => {
        if (permErr) return callback(permErr);

        const permissions = permResults.map(p => p.name);
        const token = jwt.sign(
          {
            user_id: user.user_id,
            full_name: user.full_name,
            email,
          },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "6h" }
        );

        callback(null, {
          token,
          user: {
            full_name: user.full_name,
            role: user.user_role,
            permissions,
          },
        });
      });
    });
  },
};
