// middleware/adminMiddleware.js
const admin = (req, res, next) => {
  if (req.user && req.user.role === true) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = admin;