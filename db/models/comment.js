import sequelize from '../db.js';
import { DataTypes } from 'sequelize';
import User from './user.js';
import Post from './post.js';

const Comment = sequelize.define('comment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  parentId: {
    type: DataTypes.TEXT('long'),
  },
});

User.hasMany(Comment, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: 'cascade',
});
Comment.belongsTo(User);

Post.hasMany(Comment, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: 'cascade',
});
Comment.belongsTo(Post);

export default Comment;
