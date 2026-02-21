const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // 1. Get token from header (Format: Bearer <token>)
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret_change_me');

    // 3. Attach user data (id and role) to the request object
    req.user = decoded;

    // 4. Move to the next function (the controller)
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

module.exports = { authenticateToken, isAdmin };
