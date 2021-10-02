import { DatabaseConnectionError } from '@tfticketing/common';
import 'express-async-errors';
import mongo from './db/mongo';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const PORT = process.env.PORT ?? 3000;
const NATS_SERVICE_URI = `http://nats-service:4222`;

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('Env JWT_KEY not found!');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('Env MONGO_URI not found!');
  }
  try {
    await natsWrapper.connect('ticketing', 'TEMP-RANDOM-ID', NATS_SERVICE_URI);
    await mongo.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB!')
  } catch (error) {
    console.log(error);
    throw new DatabaseConnectionError();
  }

  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

start();