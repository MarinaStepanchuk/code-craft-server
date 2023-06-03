import sequelize from '../db.js';
import { Sequelize, DataTypes } from 'sequelize';
import User from './user.js';

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  title: {
    type: DataTypes.STRING,
  },
  content: {
    type: DataTypes.TEXT('long'),
  },
  tags: {
    type: DataTypes.JSON,
  },
  banner: {
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  viewCount: {
    type: DataTypes.INTEGER,
  },
  published: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

User.hasMany(Post, {
  foreignKey: {
    allowNull: false,
  },
});
Post.belongsTo(User);

export default Post;
