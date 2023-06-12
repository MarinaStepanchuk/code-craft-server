import sequelize from '../db.js';
import { DataTypes } from 'sequelize';

const User = sequelize.define('user', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(50),
  },
  avatarUrl: {
    type: DataTypes.STRING,
  },
  bio: {
    type: DataTypes.STRING(160),
  },
  twitter: {
    type: DataTypes.STRING,
  },
  mail: {
    type: DataTypes.STRING,
  },
  instagram: {
    type: DataTypes.STRING,
  },
  isActivated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  activationLink: {
    type: DataTypes.STRING,
  },
  bookmarks: {
    type: DataTypes.STRING,
  },
});

export default User;
