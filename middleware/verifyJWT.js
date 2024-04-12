const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = async (req, res, next) => {
  let clientToken;
  console.log(req.headers);
  if (req.headers && req.headers["authorization"].startsWith("Bearer ")) {
    clientToken = req.headers["authorization"].split(" ")[1];
  } else {
    return res.status(403).json({ message: "Unauthorized. Missing token." });
  }
  jwt.verify(clientToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      res.status(403).json({ message: "Unauthorized. Incorrect/Expired token"});
    } else {
      const { username } = decoded; 
      req.user = username;
      next();
    }
  });
}

module.exports = verifyJWT