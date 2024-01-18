import db from "../config/db.js";
import { DataTypes } from "sequelize";

const Status = db.define("statuses",{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
    status: {
        type: DataTypes.ENUM('sembuh', 'positif', 'meninggal'),
        allowNull: false,
      },
    inDateAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    outDateAt: {
        type: DataTypes.DATE,
        allowNull: true,
      }
})

try {
    await db.sync();
    console.log("The table Status was Created")
} catch (error) {
    console.error("Cannot Create Table: "+error)
}

export default Status