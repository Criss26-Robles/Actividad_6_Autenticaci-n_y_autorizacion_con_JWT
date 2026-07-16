const { Sequelize } = require("sequelize");
require('dotenv').config();
console.log(__dirname);
console.log(process.cwd());
const sequelize = new Sequelize(
process.env.DB_DATABASE, // Base de datos
process.env.DB_USER, // Usuario
process.env.DB_PASSWORD, // Contraseña
{
host: process.env.DB_HOST,
dialect: process.env.DB_DIALECT,
logging: false
}
);
module.exports = sequelize;