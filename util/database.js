var dbLogin = require('../config')

const Pool = require("pg").Pool;
const pool = new Pool({
  user: dbLogin.dbUser,
  host: dbLogin.dbHost,
  database: dbLogin.dbDatabase,
  password: dbLogin.dbPassword,
  port: dbLogin.dbPort
});

const testVariable = 'testing'

const getPassword = (request, response) => {
  pool.query(
    'SELECT password FROM auth_table WHERE user_id = "dylan"',
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getSuppJsonIn = (request, response) => {
  pool.query(
    'SELECT json_in FROM supp_table_test WHERE name = "test_supp"',
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getSuppJsonOut = (request, response) => {
  pool.query(
    'SELECT json_out FROM supp_table_test WHERE name = "test_supp"',
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const createSupp = (request, response) => {
  const { name, json_in } = request.body;
  pool.query(
    "INSERT INTO supp_table_test (name, json_in) VALUES ($1, $2)",
    [name, json_in],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`User added with name: ${result.name}`);
    }
  );
};

module.exports = {
    getSuppJsonIn,
    getSuppJsonOut,
    createSupp,
    testVariable,
    getPassword
};
