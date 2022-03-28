import db from "../config/db";
import {DataTypes} from "sequelize";
import {ProgramModel} from "./program";
import {OutletModel} from "./outlet-model";
import {RedeemStatusModel} from "./redeem-status";
import {RewardModel} from "./reward";

const RedeemTransaction = db.define(
    "redeem_transaction",
    {
        kd_transaksi: {
            type: DataTypes.STRING(30),
            primaryKey: true,
            allowNull: false,
        },
        tgl_transaksi: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        no_batch: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        created_by: {
            type: DataTypes.STRING,
        },
        file_id: {
            type: DataTypes.INTEGER,
        },
    },
    {
        tableName: "trx_transaksi_redeem",
        timestamps: false,
    }
);

const RedeemItem = db.define(
    "redeem_item",
    {
        idx: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nama_produk: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.DECIMAL(20, 2),
            allowNull: false,
            get() {
                // @ts-ignore
                return Number(this.getDataValue("quantity"));
            },
        },
        sales: {
            type: DataTypes.DECIMAL(20, 2),
            get() {
                // @ts-ignore
                return Number(this.getDataValue("sales"));
            },
        },
        point_satuan: {
            type: DataTypes.DECIMAL(20, 2),
            get() {
                // @ts-ignore
                return Number(this.getDataValue("point_satuan"));
            },
        },
    },
    {tableName: "trx_transaksi_redeem_barang", timestamps: false}
);

const PurchaseRequest = db.define(
    "purchase_request",
    {
        kode_pr: {
            type: DataTypes.STRING(60),
            primaryKey: true,
            allowNull: false,
        },
        tanggal: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {tableName: "trx_pr", timestamps: false}
);

const PurchaseRequestItem = db.define(
    "purchase_request_items",
    {kd_transaksi: {type: DataTypes.STRING, primaryKey: true}},
    {tableName: "trx_pr_barang", timestamps: false}
);

RedeemItem.belongsTo(RewardModel, {
    as: "product",
    foreignKey: "kd_produk",
    targetKey: "product_id",
});

RedeemTransaction.hasOne(RedeemStatusModel, {
    foreignKey: "kd_transaksi",
    as: "status_transaksi",
});
RedeemTransaction.belongsTo(ProgramModel, {
    foreignKey: "program_id",
    as: "program",
});
RedeemTransaction.belongsTo(OutletModel, {foreignKey: "no_id", as: "outlet"});
RedeemTransaction.hasMany(RedeemItem, {
    foreignKey: "kd_transaksi",
    as: "items",
});

RedeemItem.belongsTo(RedeemTransaction, {
    foreignKey: "kd_transaksi",
    as: "transaction",
});

PurchaseRequest.hasMany(PurchaseRequestItem, {
    foreignKey: "kode_pr",
    as: "items",
});

PurchaseRequestItem.belongsTo(PurchaseRequest, {
    foreignKey: "kode_pr",
    as: "purchase_request",
});

PurchaseRequestItem.belongsTo(RedeemTransaction, {
    foreignKey: "kd_transaksi",
    as: "transaction",
});

RedeemTransaction.hasOne(PurchaseRequestItem, {
    foreignKey: "kd_transaksi",
    as: "purchase_request_item",
});

export const RedeemTransactionModel = RedeemTransaction;
export const RedeemItemModel = RedeemItem;
export const PurchaseRequestModel = PurchaseRequest;
export const PurchaseRequestItemModel = PurchaseRequestItem;
