import sequelize from "../db.js";
import { Sequelize } from 'sequelize';

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING(50),
  },
  avatarUrl: {
    type: Sequelize.STRING,
  },
  bio: {
    type: Sequelize.STRING(160),
  },
  twitter: {
    type: Sequelize.STRING,
  },
  mail: {
    type: Sequelize.STRING,
  },
  instagram: {
    type: Sequelize.STRING,
  },
});

// User.create({ email: "Jane@mail.ru", password: '12345' })

export default User;
