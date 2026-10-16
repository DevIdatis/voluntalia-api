// require('dotenv').config();

// /**
//  * Settings required to connect to Sequelizer. 
//  * At present, all settings point to the same configuration.
//  */
// module.exports = {
//   development: {
//     url: process.env.DATABASE_URL,
//     dialect: 'postgres',
//   },
//   test: {
//     url: process.env.DATABASE_URL,
//     dialect: 'postgres',
//   },
//   production: {
//     url: process.env.DATABASE_URL,
//     dialect: 'postgres',
//     dialectOptions: { ssl: { rejectUnauthorized: false } },
//   },
// };
const path = require('path');
// Cargar las variables de entorno del archivo .env
require('dotenv').config({ path: path.resolve(__dirname, '../../.env')});

// Verificar que las variables de entorno necesarias estén presentes
const required = ['PGDATABASE', 'PGUSER', 'PGPASSWORD'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  throw new Error(`Faltan variables de entorno ${missing.join(', ')}`);
}

/**
 * Configuración de la base de datos para Sequelize.
 * Todos los valores salen de las variables PG* del .env.
 */
const baseConfig = {
  database: process.env.PGDATABASE,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT) || 5432,
  dialect: 'postgres',
  dialectOptions: {
    // deshabilita SSL en local
    ssl: false,
  },
  // Retry agresivo
  retry: {
    max: 15,
    backoffBase: 1000,
    backoffExponent: 1.2,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: console.log,
};

module.exports = {
  development: { ...baseConfig },
  test: { ...baseConfig },
  production: {
    ...baseConfig,
    dialectOptions: { ssl: { rejectUnauthorized: false} },
  } 
};
