import express from 'express';
import router from './router/router.js';
import sequelize from './db/db.js';
import User from './db/models/user.js';

const app = express();
const port = 3001;

app.use(express.json());

app.use('/api', router);

const start = async () => {
  try {
    // await User.sync({ alter: true });
    await sequelize.sync();
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
  } catch (error) {
    console.log(error)
  } 
}

start();
