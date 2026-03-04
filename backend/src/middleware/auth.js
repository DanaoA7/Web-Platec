// import jwt from 'jsonwebtoken';

// export const verifyToken = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ error: 'No token provided' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     // standardize property used by routes; many handlers refer to req.user.id
//     req.user = decoded;
//     // keep adminId alias for backwards compatibility if needed
//     req.adminId = decoded.id;
//     next();
//   } catch (error) {
//     return res.status(401).json({ error: 'Invalid token' });
//   }
// };

// export default verifyToken;

import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  // Expecting Authorization header in format: "Bearer <token>"
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Verify token with JWT_SECRET environment variable
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded token payload to req.user
    req.user = decoded;

    // Optional alias for adminId, for backward compatibility if needed
    req.adminId = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export default verifyToken;