import sequelize from "../db.js";
import { Sequelize } from 'sequelize';
import User from "./user.js";

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
  user_id: {
    type: Sequelize.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  }
});

User.hasMany(Token, {
  foreignKey: {
    name:'user_id',
    allowNull: false
  }
})
Token.belongsTo(User, {foreignKey:'id'})

export default Token;