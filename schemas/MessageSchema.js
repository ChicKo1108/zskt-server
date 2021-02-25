const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

module.exports = sequelize.define("Message", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    },
    fromUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    toUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    revoke: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "撤回"
    }
});
