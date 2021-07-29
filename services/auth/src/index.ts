import 'express-async-errors';
import mongo from '../db/mongo';
import { app } from './app';
import { DatabaseConnectionError } from './errors';
import { getEnv } from './util/envs';

const PORT = process.env.PORT ?? 3000;
const DB_NAME = 'auth';
const MONGO_DB_URL = process.env.MONGO_DB_URL ?? `mongodb://auth-mongo-service:27017/${DB_NAME}`

const start = async () => {
  if (!getEnv('JWT_KEY')) {
    throw new Error('Env JWT_KEY not found!');
  }

  try {
    await mongo.connect(MONGO_DB_URL);
    console.log('Connected to MongoDB!')
  } catch (error) {
    console.log(error);
    throw new DatabaseConnectionError();
  }

  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

start();