import db from "../config/db";
import {DataTypes} from "sequelize";

const HeadRegion = db.define(
    "head_region",
    {
        head_region_id: {
            type: DataTypes.STRING(10),
            primaryKey: true,
            allowNull: false,
        },
        head_region_name: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
    },
    {
        tableName: "ms_head_region",
        timestamps: false,
    }
);

const Region = db.define(
    "region",
    {
        pulau_id_alias: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        nama_pulau_alias: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "ms_pulau_alias",
        timestamps: false,
    }
);

Region.belongsTo(HeadRegion, {
    foreignKey: "head_region_id",
    as: "head_region",
});

export const RegionModel = Region;
export const HeadRegionModel = HeadRegion;
