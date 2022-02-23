import db from "../config/db";
import {DataTypes} from "sequelize";
import {RewardModel} from "./reward";

const RedeemItem = db.define("redeem_item", {
    idx: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nama_produk: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false
    },
    sales: {
        type: DataTypes.DECIMAL(20, 2),
    },
    point_satuan: {
        type: DataTypes.DECIMAL(20, 2),
    }
}, {tableName: "trx_transaksi_redeem_barang", timestamps: false})

RedeemItem.belongsTo(RewardModel, {as: "product", foreignKey: "kd_produk", targetKey: "product_id"})

export const RedeemItemModel = RedeemItem;
