import sequelize from '../db.js';
import { DataTypes } from 'sequelize';

const Subscriptions = sequelize.define('subscriptions', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subscriber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Subscriptions;
