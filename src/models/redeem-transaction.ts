import db from "../config/db"
import {DataTypes} from "sequelize";
import {ProgramModel} from "./program";
import {OutletModel} from "./outlet-model";
import {RedeemItemModel} from "./redeem-items";
import {RedeemStatusModel} from "./redeem-status";

const RedeemTransaction = db.define("redeem_transaction", {
    kd_transaksi: {
        type: DataTypes.STRING(30),
        primaryKey: true,
        allowNull: false
    },
    tgl_transaksi: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    no_batch: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    created_by: {
        type: DataTypes.STRING,
    },
    file_id: {
        type: DataTypes.INTEGER,
    }
}, {
    tableName: "trx_transaksi_redeem",
    timestamps: false
})

RedeemTransaction.hasOne(RedeemStatusModel, {foreignKey: "kd_transaksi", as: "status_transaksi"})
RedeemTransaction.belongsTo(ProgramModel, {foreignKey: "program_id", as: "program"})
RedeemTransaction.belongsTo(OutletModel, {foreignKey: "no_id", as: "outlet"})
RedeemTransaction.hasMany(RedeemItemModel, {foreignKey: "kd_transaksi", as: "items"})

export const RedeemTransactionModel = RedeemTransaction;
