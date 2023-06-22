import sequelize from '../db.js';
import { DataTypes } from 'sequelize';
import User from './user.js';

const Notification = sequelize.define('notification', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  message: {
    type: DataTypes.TEXT('long'),
  },
});

User.hasMany(Notification, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: 'cascade',
});
Notification.belongsTo(User);

export default Notification;
