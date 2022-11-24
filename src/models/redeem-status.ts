import db from "../config/db";
import {DataTypes} from "sequelize";

const RedeemStatus = db.define(
  "redeem_status",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    status_terima: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    nama_penerima: {
      type: DataTypes.STRING(450),
    },
    tanggal_kirim: {
      type: DataTypes.DATEONLY,
    },
    tanggal_terima: {
      type: DataTypes.DATEONLY,
    },
    tanggal_proses: {
      type: DataTypes.DATEONLY,
    },
    tanggal_tolak: {
      type: DataTypes.DATEONLY,
    },
  },
  { tableName: "trx_status", timestamps: false }
);

// RedeemStatus.belongsTo(RedeemTransactionModel, {foreignKey: "kd_transaksi", as: "redemption"})

export const RedeemStatusModel = RedeemStatus;
