const usersModel = require("../models/users.model");

exports.getMyPermissions = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  usersModel.getUserPermissions(token, (err, result) => {
    if (err) return res.status(403).json({ message: err.message || "Unauthorized" });
    res.status(200).json(result);
  });
};
