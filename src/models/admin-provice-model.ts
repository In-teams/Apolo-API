import db from "../config/db";
import {DataTypes} from "sequelize";
import {CityModel} from "./admin-city-model";

const Province = db.define(
  "province",
  {
    id: {
      type: DataTypes.CHAR(2),
      primaryKey: true,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  { tableName: "provinces", timestamps: false }
);

Province.hasMany(CityModel, { foreignKey: "provinces_id", as: "kabupaten" });

export const ProvinceModel = Province;
