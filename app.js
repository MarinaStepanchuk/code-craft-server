import express from 'express';
import router from './router/router.js';
import sequelize from './db/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorMiddleware from './middleware/error-middleware.js';
import * as dotenv from 'dotenv';
import bodyParser  from 'body-parser';


dotenv.config();

const app = express();
const port = 3001;


app.use(express.json());
app.use(cookieParser());
app.use(cors(
  {
    credentials: true,
    origin: process.env.CLIENT_URL
  }
));
app.use('/api', router);
app.use(errorMiddleware);

const start = async () => {
  try {
    await sequelize.sync();
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    })
  } catch (error) {
    console.log(error);
  } 
}

start();
