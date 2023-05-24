import sequelize from '../db.js';
import { Sequelize } from 'sequelize';

const User = sequelize.define("User", {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true
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
  isActivated: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  activationLink: {
    type: Sequelize.STRING,
  }
});

export default User;
