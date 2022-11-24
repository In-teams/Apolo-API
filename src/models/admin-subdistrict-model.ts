import db from "../config/db";
import {DataTypes} from "sequelize";

const Subdistrict = db.define(
  "subdistrict",
  {
    id: {
      type: DataTypes.CHAR(10),
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
    },
  },
  { tableName: "subdistricts", timestamps: false }
);

export const SubdistrictModel = Subdistrict;
