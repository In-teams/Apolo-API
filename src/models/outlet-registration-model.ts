import db from "../config/db";
import {DataTypes} from "sequelize";
import {OutletRegistrationPeriodModel} from "./outlet-registration-period";

const OutletRegistration = db.define(
  "registration",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    filename: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type_file: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    tgl_upload: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status_registrasi: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    validated_at: {
      type: DataTypes.DATE,
    },
    validated_by: {
      type: DataTypes.STRING,
    },
    uploaded_by: {
      type: DataTypes.STRING,
    },
  },
  { tableName: "trx_file_registrasi", timestamps: false }
);

OutletRegistration.belongsTo(OutletRegistrationPeriodModel, {
  foreignKey: "periode_id",
  as: "periode",
});

export const OutletRegistrationModel = OutletRegistration;
