const { pool } = require('./dbPool');

module.exports = {
  async query(text, bindParams) {
    try {
      const results = await pool.query(text, bindParams);
      return results;
    } catch(err) {
      throw new Error(err.message);
    }
  }
}
