const { Pool } = require('pg');
require('dotenv').config();

// The Pool uses environment variables by default if they are named correctly:
// PGUSER, PGHOST, PGDATABASE, PGPASSWORD, PGPORT
const pool = new Pool();

module.exports = {
  /**
   * Global query helper
   * @param {string} text - SQL query
   * @param {params} params - Array of values for parameterized queries
   */
  query: (text, params) => {
    return pool.query(text, params);
  },
};
