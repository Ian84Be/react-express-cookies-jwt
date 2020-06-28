const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET || 'yaya';

module.exports = (req, res, next) => {
	const token = req.headers.token;
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ you: "can't touch this!" });
      } else {
        req.decodedJwt = decodedToken;
        next();
      }
    });
  } else {
    res.status(401).json({ you: 'shall not pass!' });
  }
};
