const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getUserByEmailWithRole } = require("../models/sign_in.model");

exports.signIn = async (req, res) => {
  const { email, password: inputPassword } = req.body;

  try {
    const user = await getUserByEmailWithRole(email);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.user_status === "Inactive") {
      return res.status(403).json({ error: "Account inactive. Contact admin." });
    }

    const isMatch = await bcrypt.compare(inputPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 👇 include must_change_password in token payload
    const token = jwt.sign(
      {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        must_change_password: user.must_change_password
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "6h" }
    );

    res.json({
      token,
      mustChangePassword: user.must_change_password,
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        user_status: user.user_status,
      }
    });

  } catch (err) {
    console.error("Sign-in error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
