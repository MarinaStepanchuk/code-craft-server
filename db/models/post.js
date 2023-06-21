import sequelize from '../db.js';
import { DataTypes } from 'sequelize';
import User from './user.js';

const Post = sequelize.define('post', {
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
  banner: {
    type: DataTypes.STRING,
  },
  viewCount: {
    type: DataTypes.INTEGER,
  },
  status: {
    type: DataTypes.ENUM('published', 'draft'),
    allowNull: false,
  },
});

User.hasMany(Post, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: 'cascade',
});
Post.belongsTo(User);

export default Post;
