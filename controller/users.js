const { User, getUserName, getPassword } = require('../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { logEvents } = require('../middleware/logHandler');

const handleSignUp = async (req, res, next) => {
  const { username, password, email, role } = req.body;
  try {
    const user = new User({username, password: bcrypt.hashSync(password, 5), email, role});
    await user.createUser();
    res.send(user);
  } catch(err) {
    const errToThrow = new Error();
    switch(err?.code) {
      case "23505":
        errToThrow.message = 'User/Email already exists';
        errToThrow.statusCode = 403;
        break;
      default:
        errToThrow.statusCode = 500;
        errToThrow.message = err.message;
    }
    next(errToThrow);
  }
}


const handleLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      status: 400,
      message: "Username or Password not present"
    });
  }
  try {
    const userRows = await getUserName(username);
    if (!userRows || !userRows[0]) {
      return res.status(403).json({ status: 403, message: "User Not Found"});
    } else {
      // user found, now match password
      const passRows = await getPassword(username);
      if (!passRows || !passRows[0]) {
        return res.status(403).json({ message: 'Password not found' });
      }
      const match = await bcrypt.compare(password, passRows[0].password);
      await logEvents(`user:${username}\tpass:${password}\thash:${passRows[0].password}\tmatch:${match}`, "userLogs.txt");
      if (!match) {
        return res.status(403).json({ status: 403, message: "Password didn't match" });
      }
      // password matched, now sign token & send that in cookie
      const token = jwt.sign({ user: username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h'});

      res.cookie('jwt', token, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 1000,
      });

      res.status(200).json({ status:200, message: 'Login Successful' });
    }
  } catch(err) {
    throw new Error(err.message);
  }
}



module.exports = { handleSignUp, handleLogin }