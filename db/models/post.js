import sequelize from "../db.js";
import { Sequelize } from 'sequelize';
import User from "./user.js";

const Post = sequelize.define("Post", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  text: {
    type: Sequelize.STRING,
    allowNull: false
  },
  tags: {
    type: Sequelize.STRING,
  },
  banner: {
    type: Sequelize.STRING,
  },
  viewCount: {
    type: Sequelize.INTEGER,
  },
  likeCount: {
    type: Sequelize.INTEGER,
  },
  user_id: {
    type: Sequelize.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  }
});

User.hasMany(Post, {
  foreignKey: {
    name:'user_id',
    allowNull: false
  }
})
Post.belongsTo(User, {foreignKey:'id'})
// Post.hasMany(Tag)

export default Post;