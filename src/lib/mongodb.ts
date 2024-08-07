import { MongoClient } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: process.env.NODE_ENV != "development",
  tls: process.env.NODE_ENV != "development",
  // tlsAllowInvalidCertificates: process.env.NODE_ENV === "development", // Only use this for testing, not in production
  // tlsInsecure: process.env.NODE_ENV === "development",
}

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    try {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
    } catch (error) {
      console.error("Error connecting to MongoDB:", error)
      throw error
    }
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  try {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  } catch (error) {
    console.error("Error connecting to MongoDB:", error)
    throw error
  }
}

export default clientPromise