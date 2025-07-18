const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized. Token missing." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // user_id, email, full_name, role
    next(); // proceed to route
  } catch (err) {
    console.error("JWT verification failed:", err);
    res.status(401).json({ error: "Unauthorized. Invalid token." });
  }
};

module.exports = authenticate;
