module.exports = (sequelize, DataTypes) =>
  sequelize.define("Class", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    className: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    college: {
      type: DataTypes.STRING(60),
    },
    school: {
      type: DataTypes.STRING(60),
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    canSearch: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });
