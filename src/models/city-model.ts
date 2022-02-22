import db from "../config/db"
import {DataTypes} from "sequelize";

const City = db.define("city", {
    city_id_alias: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    city_name_alias: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "ms_city_alias",
    timestamps: false
})

export const CityModel = City
