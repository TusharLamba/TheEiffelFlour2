const db = require('../db/index');

// Constructor function for a user object
class User {
  constructor({
    username, email, password, role="User"
  }) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  createUser = async () => {
    try {
      const { rows } = await db.query(
        ` INSERT INTO "user" (username, password, email, role)
          VALUES($1,$2,$3,$4)`,
          [this.username, this.password, this.email, this.role]
      );
      return rows;
    } catch(err) {
      throw new Error(err.message);
    }
  }
}

const getUserName = async (uname) => {
  try {
    const { rows } = await db.query(`SELECT username FROM "user" WHERE username=$1`, [uname]);
    return rows;
  } catch(err) {
    throw new Error(err.message);
  }
}

const getPassword = async (uname) => {
  try {
    const { rows } = await db.query(`SELECT password FROM "user" WHERE username=$1`, [uname]);
    return rows;
  } catch(err) {
    throw new Error(err.message);
  }
}

module.exports = { User, getUserName, getPassword };

