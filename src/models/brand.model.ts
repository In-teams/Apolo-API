import {DataTypes} from "sequelize";
import db from "../config/db";

export const Brand = db.define(
  "brand",
  {
    brand_id: {
      type: DataTypes.CHAR(5),
      primaryKey: true,
      allowNull: false,
    },
    brand_name: {
      type: DataTypes.STRING(20),
    },
    kode_category: {
      type: DataTypes.STRING(10),
    },
  },
  { tableName: "mstr_brand", timestamps: false }
);
