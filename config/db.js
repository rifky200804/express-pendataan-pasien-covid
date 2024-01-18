import Sequelize from "sequelize";
import dotenv from 'dotenv';
dotenv.config()

const { DB_DATABASE, DB_USERNAME, DB_PASSWORD, DB_HOST } = process.env;

console.log('Database Configuration:', {
    database: DB_DATABASE,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    host: DB_HOST,
});

const sequelize = new Sequelize({
    database: DB_DATABASE,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    host: DB_HOST,
    dialect: "mysql",
    logging: console.log
})

try {
    await sequelize.authenticate()
    console.log("Database Connected")
} catch (error) {
    console.error("Cannot connect to Database" + error)
}

export default sequelize