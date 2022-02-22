import db from "../config/db"
import {DataTypes} from "sequelize";

const Region = db.define("region", {
    pulau_id_alias: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    nama_pulau_alias: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "ms_pulau_alias",
    timestamps: false
})

export const RegionModel = Region
