import db from "../config/db.js";
import { DataTypes } from "sequelize";
import Status from './Status.js';

const Patient = db.define("patients",{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    statusId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
})

Patient.belongsTo(Status, {
    foreignKey: 'statusId',
    as: 'statusInfo',
  });
  
  Status.hasMany(Patient, {
    foreignKey: 'statusId',
    as: 'patients',
  });

try {
    await db.sync();
    console.log("The table patients was Created")
} catch (error) {
    console.error("Cannot Create Table: "+error)
}

export default Patient