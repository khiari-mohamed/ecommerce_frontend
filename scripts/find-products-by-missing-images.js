/**
 * Script: find-products-by-missing-images.js
 * Purpose: For a list of missing image filenames, find which products reference them in MongoDB.
 * Usage:
 *   1. Edit the configuration section below (Mongo URI, DB, collection, image field, etc).
 *   2. Edit the missingImages array with your missing filenames.
 *   3. Run: node scripts/find-products-by-missing-images.js
 */

const { MongoClient } = require("mongodb");

// ====== CONFIGURATION ======
const MONGO_URI = "mongodb://localhost:27017"; // Change if needed
const DB_NAME = "your_db_name"; // <-- CHANGE THIS to your database name
const COLLECTION_NAME = "products"; // <-- CHANGE THIS to your collection name
const IMAGE_FIELD = "image"; // <-- CHANGE THIS to your image field (e.g. "image", "cover", "imageUrl")

// List your missing image filenames here (just the filename, not the path)
const missingImages = [
  "14WucA3VKnthyTDGrdV6.webp",
  "b9ejGJR58IGKNWQDEcdn.webp",
  "1ox0AKHiNReZz7lyFd9h.webp",
  "rQdrBmR9YvyaB6YBgmfS.webp",
  "P6CIDYHOyJpXHI9dEodv.webp",
  "f2cFTNb1JcxTEvAJ0MA2.webp",
];

// ====== SCRIPT ======
async function main() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);

  // Build regex array for $or query
  const regexQueries = missingImages.map(filename => ({
    [IMAGE_FIELD]: { $regex: filename + "$" }
  }));

  const products = await collection.find({ $or: regexQueries }).toArray();

  if (products.length === 0) {
    console.log("No products found referencing the missing images.");
  } else {
    console.log("Products referencing missing images:\n");
    missingImages.forEach(filename => {
      const found = products.filter(prod => {
        const val = prod[IMAGE_FIELD];
        return typeof val === "string" && val.endsWith(filename);
      });
      if (found.length > 0) {
        found.forEach(prod => {
          console.log(
            `Image: ${filename}  <--  Product: ${prod.name || prod.title || prod._id}`
          );
        });
      } else {
        console.log(`Image: ${filename}  <--  No product found`);
      }
    });
  }

  await client.close();
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});