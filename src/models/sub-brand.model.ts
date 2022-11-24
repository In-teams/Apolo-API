import {DataTypes} from "sequelize";
import db from "../config/db";

export const SubBrand = db.define(
  "sub_brand",
  {
    sub_brand_id: {
      type: DataTypes.STRING(30),
      primaryKey: true,
      allowNull: false,
    },
    sub_brand_name: {
      type: DataTypes.STRING(250),
    },
    brand_id: {
      type: DataTypes.STRING(5),
    },
  },
  { tableName: "mstr_sub_brand", timestamps: false }
);
