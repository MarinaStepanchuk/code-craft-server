import sequelize from '../db.js';
import { DataTypes } from 'sequelize';
import User from './user.js';

const Token = sequelize.define("Token", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  refreshToken: {
    type: DataTypes.TEXT('long'),
    allowNull: false
  },
});

User.hasOne(Token, {
  foreignKey: {
    allowNull: false
  }
})
Token.belongsTo(User);

export default Token;
