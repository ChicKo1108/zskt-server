import sequelize from "../config/db";

export const sequelize;

export const User = sequelize.import(__dirname + './UserSchema.js');

export const Class = sequelize.import(__dirname + './ClassSchema.js');

export const ClassMember = sequelize.import(__dirname + './ClassMemberSchema.js');

User.belongsToMany(Class, { through: ClassMember });
Class.belongsToMany(User, { through: ClassMember });

sequelize.sync({ alter: true });