import db from "../config/db"
import {DataTypes} from "sequelize";

const Program = db.define("program", {
    program_id: {
        type: DataTypes.STRING(20),
        primaryKey: true
    },
    program_name: {
        type: DataTypes.STRING,
    },
    customer_id: {
        type: DataTypes.STRING(20),
    }
}, {tableName: "mstr_program", timestamps: false})

export const ProgramModel = Program;
