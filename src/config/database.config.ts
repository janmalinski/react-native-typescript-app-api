require('dotenv').config();
import { Sequelize } from 'sequelize';


const { DB_DATABASE, DB_USER, DB_PASSWORD} = process.env;
    const db = new Sequelize( DB_DATABASE as string, DB_USER as string, DB_PASSWORD,{ 
    dialect: 'postgres',
    host: 'localhost',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
});


export default db;
