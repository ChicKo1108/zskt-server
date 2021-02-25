const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

module.exports = sequelize.define("Apply", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    },
    classId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isPass: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "LOADING",
        comment: "LOADING | PASS | REJECT"
    }
});
