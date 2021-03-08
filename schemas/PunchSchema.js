module.exports = (sequelize, DataTypes) =>
  sequelize.define("Punch", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    lng: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "创建考勤时的纬度",
    },
    lat: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "创建考勤时的精度",
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    stop: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
      comment: "提前终止打卡",
    },
  });
