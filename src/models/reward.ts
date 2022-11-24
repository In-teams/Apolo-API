import db from "../config/db";
import {DataTypes} from "sequelize";

const Reward = db.define(
  "reward",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    product_name: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    product_weight: {
      type: DataTypes.DECIMAL(17, 2),
      defaultValue: 0.0,
    },
    product_selling_weight: {
      type: DataTypes.DECIMAL(17, 2),
      defaultValue: 0.0,
    },
    dimension: {
      type: DataTypes.STRING(100),
    },
    description: {
      type: DataTypes.STRING(2000),
    },
    status_product: {
      type: DataTypes.STRING(20),
    },
    category: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    photo: {
      type: DataTypes.STRING,
    },
    product_id_alias: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    refid: {
      type: DataTypes.STRING(50),
    },
  },
  { tableName: "ms_product", timestamps: false }
);

export const RewardModel = Reward;
