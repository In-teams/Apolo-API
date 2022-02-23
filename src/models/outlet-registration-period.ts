import db from "../config/db";
import {DataTypes} from "sequelize";

const OutletRegistrationPeriod = db.define("registration_period", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    periode: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    tgl_mulai: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    tgl_selesai: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
}, {
    tableName: "ms_periode_registrasi",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
})

export const OutletRegistrationPeriodModel = OutletRegistrationPeriod
