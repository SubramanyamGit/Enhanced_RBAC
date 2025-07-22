module.exports = (req, res, next) => {
  const role = req.user?.role;

  if (!role || role.toLowerCase() !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Admins only' });
  }

  next();
};
