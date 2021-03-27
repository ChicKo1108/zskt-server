module.exports = (sequelize, DataTypes) =>
  sequelize.define("PunchResult", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    punchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isLeave: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
    }
  });
