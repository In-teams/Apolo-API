import db from "../config/db"
import {DataTypes} from "sequelize";
import {SubdistrictModel} from "./admin-subdistrict-model";

const District = db.define("district", {
    id: {
        type: DataTypes.CHAR(7),
        primaryKey: true,
        allowNull: false
    },

    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {tableName: "districts", timestamps: false})

District.hasMany(SubdistrictModel, {foreignKey: "districts_id", as: "kelurahan"})

export const DistrictModel = District;
