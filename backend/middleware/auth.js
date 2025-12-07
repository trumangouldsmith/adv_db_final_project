const jwt = require('jsonwebtoken');

const verifyToken = (token) => {
  try {
    const cleanToken = token.replace('Bearer ', '');
    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

const requireAuth = (context) => {
  const user = verifyToken(context.token);
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
};

const requireAdmin = (context) => {
  const user = verifyToken(context.token);
  if (!user || user.type !== 'admin') {
    throw new Error('Admin access required');
  }
  return user;
};

const isOwnerOrAdmin = (context, resourceOwnerId) => {
  const user = verifyToken(context.token);
  if (!user) {
    throw new Error('Authentication required');
  }
  
  if (user.type === 'admin') {
    return true;
  }
  
  if (user.type === 'alumni' && user.Alumni_id === resourceOwnerId) {
    return true;
  }
  
  throw new Error('Access denied');
};

module.exports = {
  verifyToken,
  requireAuth,
  requireAdmin,
  isOwnerOrAdmin
};

