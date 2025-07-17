const sql = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  /**
   * Handles user login: validates credentials and returns JWT.
   * Full permission and menu data is handled separately in /users/my_permissions.
   */
  signIn: (req, callback) => {
    const { email, password: inputPassword } = req.body;

    // 1. Find user by email
    const userQuery = `
      SELECT user_id, password, full_name, user_status
      FROM users 
      WHERE email = ?
    `;

    sql.query(userQuery, [email], (err, results) => {
      if (err) return callback(err);
      if (!results.length) return callback({ message: "Invalid credentials" });

      const user = results[0];

      // 2. Validate password and user status
      const isPasswordValid = bcrypt.compareSync(inputPassword, user.password);
      if (user.user_status === "Inactive") {
        return callback({ message: "Account inactive. Contact admin." });
      }
      if (!isPasswordValid) {
        return callback({ message: "Invalid credentials" });
      }

      // 3. Generate JWT token (permissions will be fetched separately)
      const token = jwt.sign(
        {
          user_id: user.user_id,
          full_name: user.full_name,
          email,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "6h" }
      );

      // 4. Return token and basic user info
      callback(null, {
        token,
        user: {
          full_name: user.full_name,
          role: user.user_role,
        },
      });
    });
  },
};
