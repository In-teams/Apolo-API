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

const DistPic = db.define(
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

const Pic = db.define(
  "distributor_pic",
  {
    kode_pic: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
    },
    nama_pic: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    level_pic: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
  },
  {
    tableName: "ms_pic",
    timestamps: false,
  }
);

DistPic.belongsTo(Pic, {
  foreignKey: "asm_id",
  as: "asm",
  scope: { level_pic: "ASM" },
});

DistPic.belongsTo(Pic, {
    foreignKey: "ass_id",
    as: "ass",
    scope: { level_pic: "ASS" },
});

Distributor.hasOne(DistPic, { foreignKey: "distributor_id", as: "pics" });

export const DistributorModel = Distributor;
export const DistributorPicModel = DistPic;
export const PicModel = Pic;
