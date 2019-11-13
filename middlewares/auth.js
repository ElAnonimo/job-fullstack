const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // get jwt token from header
  const token = req.header('Authorization');

  // 401 for not authorized: no token on header
  if (!token) {
    return res.status(401).json({ message: 'no jwt token, authorization denied' });
  }

  // verify token
  try {
    // jwt.verify() to decode token
		const decoded = jwt.verify(token, 'jwtSecretWord');
		console.log('decoded token from auth middleware:', decoded);

    req.user = decoded.user;
    next();
  } catch(err) {
    res.status(401).json({ message: 'jwt token is not valid' });
  }
};