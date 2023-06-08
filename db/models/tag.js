import sequelize from '../db.js';
import { Sequelize, DataTypes } from 'sequelize';
import Post from './post.js';

const Tag = sequelize.define('Tag', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
  },
  count: {
    type: DataTypes.INTEGER,
  },
});

Post.belongsToMany(Tag, {
  through: 'post_tag',
});
Tag.belongsToMany(Post, {
  through: 'post_tag',
});

export default Tag;
