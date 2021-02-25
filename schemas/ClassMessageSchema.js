const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

module.exports = sequelize.define("ClassMessage", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    },
    ClassId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fromUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    revoke: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "撤回"
    }
});
