import sequelize from '../db.js';
import { DataTypes } from 'sequelize';
import User from './user.js';
import Post from './post.js';

const Like = sequelize.define('like', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
});

User.hasMany(Like, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: 'cascade',
});
Like.belongsTo(User);

Post.hasMany(Like, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: 'cascade',
});
Like.belongsTo(Post);

export default Like;
