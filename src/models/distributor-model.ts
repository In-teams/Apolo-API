import db from "../config/db";
import {DataTypes} from "sequelize";

const Distributor = db.define(
    "distributor",
    {
        distributor_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        distributor_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "mstr_distributor",
        timestamps: false,
    }
);

const Pic = db.define(
    "distributor_pic",
    {
        distributor_id: {
            type: DataTypes.STRING(20),
            primaryKey: true,
            allowNull: false,
        },
        ass_id: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        asm_id: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
    },
    {
        tableName: "ms_dist_pic",
        timestamps: false,
    }
);

Distributor.hasOne(Pic, {foreignKey: "distributor_id", as: "pics"});

export const DistributorModel = Distributor;
export const DistributorPicModel = Pic;
