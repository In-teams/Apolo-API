import db from "../config/db"
import {DataTypes} from "sequelize";

const Distributor = db.define("distributor", {
    distributor_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    distributor_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "mstr_distributor",
    timestamps: false
})

export const DistributorModel = Distributor
