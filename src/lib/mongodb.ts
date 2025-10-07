import 'dotenv/config';

import { MongoClient } from 'mongodb';

import type { MongoClient as MongoClientType } from 'mongodb';

const uri: string = process.env.MONGODB_URI || '';
const options = {};

let client: MongoClientType;
let clientPromise: Promise<MongoClientType>;

if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
