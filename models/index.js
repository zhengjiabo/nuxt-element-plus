'use strict';

import { readFileSync, readdirSync} from 'fs'
import { fileURLToPath } from 'url';
import { dirname, basename, join } from 'path';
import Sequelize from 'sequelize';
import process from 'process';
const baseName = basename(import.meta.url);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const configPath = '../config/config.json'
const configAbsolutePath = join(__dirname, configPath);
const env = process.env.NODE_ENV || 'development';
const config = JSON.parse(readFileSync(configAbsolutePath, 'utf-8'))[env];
const db = {};


let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const proArr = readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== baseName &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .map(async file => {
    const filePath = join(__dirname, file);
    const fileURL = new URL(`file://${filePath}`);
    const model = (await import(fileURL.href)).default(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Promise.all(proArr).then(() => {
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
})

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// try {
//   await sequelize.authenticate();
//   console.log('Connection has been established successfully.');
// } catch (error) {
//   console.error('Unable to connect to the database:', error);
// }
export { db };
