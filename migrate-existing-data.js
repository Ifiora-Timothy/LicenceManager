// Migration script to add createdBy field to existing data
// Run this once after deploying the new schema

const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

console.log("url, ",MONGODB_URI)
async function migrateData() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    // Get the first user to assign existing data to
    const firstUser = await db.collection('users').findOne({});
    if (!firstUser) {
      console.log('No users found. Please create a user first.');
      return;
    }
    
    console.log(`Assigning existing data to user: ${firstUser.email}`);
    
    // Update products
    const productsResult = await db.collection('products').updateMany(
      { createdBy: { $exists: false } },
      { $set: { createdBy: firstUser._id } }
    );
    console.log(`Updated ${productsResult.modifiedCount} products`);
    
    // Update consumers
    const consumersResult = await db.collection('consumers').updateMany(
      { createdBy: { $exists: false } },
      { $set: { createdBy: firstUser._id } }
    );
    console.log(`Updated ${consumersResult.modifiedCount} consumers`);
    
    // Update licenses
    const licensesResult = await db.collection('licenses').updateMany(
      { createdBy: { $exists: false } },
      { $set: { createdBy: firstUser._id } }
    );
    console.log(`Updated ${licensesResult.modifiedCount} licenses`);
    
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.close();
  }
}

// Run the migration
migrateData();
