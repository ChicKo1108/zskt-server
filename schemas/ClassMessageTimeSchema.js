const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

module.exports = sequelize.define("ClassMessageTime", {
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
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    lastViewTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
    }
});
