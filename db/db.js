import { Sequelize } from 'sequelize';

const sequelize = new Sequelize("intexsoft_courses_marina_s", "marina", "kjDH7/dd/jj", {
  dialect: "mysql",
  host: "nisnas.synology.me",
  define: {
    freezeTableName: true
  }
});

export default sequelize;