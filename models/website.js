import { DataTypes } from "sequelize";
import { DB } from "../config/connections.js";

const website = DB.define( 
  "website",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255), 
      allowNull: false,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER, 
      allowNull: false,
    },
    code: {
      type: DataTypes.INTEGER, 
      allowNull: false,
    },
    latency: {
      type: DataTypes.FLOAT, 
      allowNull: false,
    },
    last_checked: {
      type: DataTypes.DATE, 
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false, 
  }
);

export default website;