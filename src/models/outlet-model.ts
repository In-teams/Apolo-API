import db from "../config/db";
import {DataTypes} from "sequelize";
import {DistributorModel} from "./distributor-model";
import {SalesCityModel} from "./sales-city-model";
import {RegionModel} from "./region-model";
import {OutletRegistrationModel} from "./outlet-registration-model";
import {CityModel} from "./admin-city-model";
import {DistrictModel} from "./admin-district-model";
import {SubdistrictModel} from "./admin-subdistrict-model";
import {ProvinceModel} from "./admin-provice-model";

const Outlet = db.define(
  "outlet",
  {
    outlet_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    outlet_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nama_konsumen: {
      type: DataTypes.STRING,
    },
    ektp: {
      type: DataTypes.STRING,
    },
    tanggal_lahir: {
      type: DataTypes.DATEONLY,
    },
    gender: {
      type: DataTypes.CHAR,
    },
    alamat1: {
      type: DataTypes.STRING(500),
    },
    alamat2: {
      type: DataTypes.STRING(500),
    },
    alamat3: {
      type: DataTypes.STRING(500),
    },
    alamat4: {
      type: DataTypes.STRING(500),
    },
    rtrw: {
      type: DataTypes.STRING(10),
    },
    // kelurahan: {
    //     type: DataTypes.STRING(100)
    // },
    // kecamatan: {
    //     type: DataTypes.STRING(100)
    // },
    // kabupaten: {
    //     type: DataTypes.STRING(100)
    // },
    // propinsi: {
    //     type: DataTypes.STRING(100)
    // },
    kota: {
      type: DataTypes.STRING(100),
    },
    kodepos: {
      type: DataTypes.STRING(10),
    },
    telepon1: {
      type: DataTypes.STRING(100),
    },
    telepon2: {
      type: DataTypes.STRING(100),
    },
    no_wa: {
      type: DataTypes.STRING(100),
    },
    namawali1: {
      type: DataTypes.STRING(50),
    },
    teleponwali1: {
      type: DataTypes.STRING(50),
    },
    namawali2: {
      type: DataTypes.STRING(50),
    },
    teleponwali2: {
      type: DataTypes.STRING(50),
    },
    email: {
      type: DataTypes.STRING(50),
    },
    formulir: {
      type: DataTypes.STRING(50),
    },
    scan: {
      type: DataTypes.STRING(50),
    },
    formulir_upload: {
      type: DataTypes.STRING(50),
    },
    valid: {
      type: DataTypes.STRING(5),
      defaultValue: "No",
    },
    valid2: {
      type: DataTypes.STRING(5),
      defaultValue: "No",
    },
    npwp: {
      type: DataTypes.STRING(100),
    },
    cluster: {
      type: DataTypes.STRING(20),
    },
    cluster2: {
      type: DataTypes.STRING(20),
    },
    nomor_rekening: {
      type: DataTypes.STRING(30),
    },
    nama_rekening: {
      type: DataTypes.STRING(100),
    },
    nama_bank: {
      type: DataTypes.STRING(50),
    },
    cabang_bank: {
      type: DataTypes.STRING(50),
    },
    kota_bank: {
      type: DataTypes.STRING(50),
    },
    program: {
      type: DataTypes.STRING(20),
    },
    register_at: {
      type: DataTypes.DATE,
    },
    nama_ektp: {
      type: DataTypes.STRING(50),
    },
    nama_npwp: {
      type: DataTypes.STRING(50),
    },
    jenis_badan: {
      type: DataTypes.STRING(20),
    },
  },
  {
    tableName: "mstr_outlet",
    timestamps: false,
  }
);

Outlet.belongsTo(DistributorModel, {
  foreignKey: "distributor_id",
  as: "distributor",
});
Outlet.belongsTo(SalesCityModel, {
  foreignKey: "city_id_alias",
  as: "sales_city",
});
Outlet.belongsTo(RegionModel, { foreignKey: "region_id", as: "region" });
Outlet.hasMany(OutletRegistrationModel, {
  foreignKey: "outlet_id",
  as: "registrations",
});
Outlet.belongsTo(ProvinceModel, { foreignKey: "propinsi", as: "province" });
Outlet.belongsTo(CityModel, { foreignKey: "kabupaten", as: "city" });
Outlet.belongsTo(DistrictModel, { foreignKey: "kecamatan", as: "district" });
Outlet.belongsTo(SubdistrictModel, {
  foreignKey: "kelurahan",
  as: "subdistrict",
});

export const OutletModel = Outlet;
