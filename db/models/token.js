import sequelize from '../db.js';
import { Sequelize } from 'sequelize';
import User from './user.js';

const Token = sequelize.define("Token", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  refreshToken: {
    type: Sequelize.TEXT('long'),
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
