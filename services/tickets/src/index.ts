import { DatabaseConnectionError } from '@tfticketing/common';
import 'express-async-errors';
import mongo from './db/mongo';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { Stan } from 'node-nats-streaming';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-canceled-listener';

const PORT = process.env.PORT ?? 3000;

const deferCloseNatsWrapper = async (stan: Stan) => {
  new Promise<void>((resolve) => {
    stan.on('close', () => {
      console.log('NATS connection closed!');
      resolve();
      process.exit();
    });

    process.on('SIGINT', () => {
      stan.close();
      resolve();
    });
    process.on('SIGTERM', () => {
      stan.close();
      resolve();
    });
  })
}

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('Env JWT_KEY not found!');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('Env MONGO_URI not found!');
  }
  if (!process.env.NATS_URL) {
    throw new Error('Env NATS_URL not found!');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('Env NATS_CLIENT_ID not found!');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('Env MONGO_URI not found!');
  }
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL,
    );
    await deferCloseNatsWrapper(natsWrapper.client);

    await new OrderCreatedListener(natsWrapper.client).listen();
    await new OrderCancelledListener(natsWrapper.client).listen();

    await mongo.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB!')
  } catch (error) {
    console.log(error);
    throw new DatabaseConnectionError();
  }

  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

start();
