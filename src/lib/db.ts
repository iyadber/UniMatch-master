import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

interface GlobalWithMongo {
  mongo?: {
    conn: MongoClient | null;
    promise: Promise<MongoClient>;
  };
}

const globalWithMongo = global as GlobalWithMongo;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!globalWithMongo.mongo) {
    const client = new MongoClient(uri, options);
    globalWithMongo.mongo = {
      conn: null,
      promise: client.connect()
    };
  }
  clientPromise = globalWithMongo.mongo.promise;
} else {
  // In production mode, it's best to not use a global variable.
  const client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise; 