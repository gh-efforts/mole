const Sequelize = require('sequelize');

const host = process.env.MOLE_DB_HOST;
const port = process.env.MOLE_DB_PORT;
const database = process.env.MOLE_DB_DATA;
const username = process.env.MOLE_DB_USER;
const passwowrd = process.env.MOLE_DB_PASS;
const url = `postgres://${username}:${passwowrd}@${host}:${port}/${database}`;

module.exports = new Sequelize(url, {
  dialect: 'postgres',
  protocol: 'postgres',
  // logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});
