module.exports = (sequelize, DataTypes) =>
  sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    realName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sno: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "学号，老师没有此信息",
    },
  });
