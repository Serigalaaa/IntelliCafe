import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI

let clientPromise: Promise<MongoClient> | null = null

if (uri) {
  const options = {}
  let client: MongoClient

  if (process.env.NODE_ENV === "development") {
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
  } else {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }
} else {
  console.log("[IntelliCafe] MongoDB not configured - using sample data")
}

export default clientPromise
