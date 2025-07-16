const signInModel = require("../models/sign_in.model");

module.exports = {
  signIn: (req, res) => {
    signInModel.signIn(req, (err, data) => {
      if (err) return res.status(401).json({ message: err.message });
      res.status(200).json({ token: data.token, user: data.user });
    });
  },
};
