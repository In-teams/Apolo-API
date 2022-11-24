import db from "../config/db";
import {DataTypes} from "sequelize";
import {DistrictModel} from "./admin-district-model";

const City = db.define(
  "city",
  {
    id: {
      type: DataTypes.CHAR(4),
      primaryKey: true,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  { tableName: "cities", timestamps: false }
);

City.hasMany(DistrictModel, { foreignKey: "cities_id", as: "kecamatan" });

export const CityModel = City;
