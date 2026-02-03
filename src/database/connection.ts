/**
 * MongoDB connection via Mongoose.
 * Call connect() from index before starting the Discord client.
 */

import mongoose from 'mongoose';
import { config } from '../config';

let isConnected = false;

export async function connectDatabase(): Promise<void> {
  if (isConnected) {
    return;
  }
  await mongoose.connect(config.mongodbUri);
  isConnected = true;
}

export async function disconnectDatabase(): Promise<void> {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
}
