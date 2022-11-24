import {DataTypes} from "sequelize";
import db from "../config/db";

export const Category = db.define(
  "category",
  {
    kode_category: {
      type: DataTypes.CHAR(10),
      primaryKey: true,
      allowNull: false,
    },
    nama_category: {
      type: DataTypes.STRING(100),
    },
  },
  { tableName: "mstr_category", timestamps: false }
);
