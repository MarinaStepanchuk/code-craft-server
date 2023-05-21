import express from 'express';
import router from './router/router.js';
import sequelize from './db/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorMiddleware from './middleware/error-middleware.js'
// import User from './db/models/user.js';

const app = express();
const port = 3001;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api', router);
app.use(errorMiddleware);

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
