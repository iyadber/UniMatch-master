const { PrismaClient } = require('@prisma/client');
const { MongoClient } = require('mongodb');

async function checkDatabase() {
  console.log('🔍 Checking database connection...');
  console.log('Environment:', process.env.NODE_ENV);
  
  // Safely log MongoDB URI without exposing credentials
  const mongoUri = process.env.MONGODB_URI || '';
  const sanitizedUri = mongoUri.includes('@') 
    ? mongoUri.split('@')[0].replace(/:[^:]*@/, ':****@') + '@' + mongoUri.split('@')[1]
    : 'not set';
  console.log('MongoDB URI:', sanitizedUri);
  
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in the environment variables');
    process.exit(1);
  }

  try {
    // Use a simpler MongoDB client setup
    const client = new MongoClient(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // 30 seconds
      connectTimeoutMS: 30000
    });
    
    console.log('Attempting to connect to MongoDB Atlas...');
    await client.connect();
    console.log('✅ MongoDB Atlas connection successful');
    
    // Check if database exists and is accessible
    const db = client.db('unimatch_db');
    await db.command({ ping: 1 });
    console.log('✅ Database "unimatch_db" is accessible on Atlas');
    
    // List collections to verify database structure
    const collections = await db.listCollections().toArray();
    console.log('📊 Available collections:', collections.map(c => c.name).join(', '));
    
    await client.close();

    // Check Prisma connection and basic operations
    console.log('Testing Prisma connection and operations...');
    const prisma = new PrismaClient();
    
    try {
      // Connect to the database
      await prisma.$connect();
      console.log('✅ Prisma connection successful');
      
      // Create a test record
      console.log('Creating test record...');
      const testName = `test_${Date.now()}`;
      const testRecord = await prisma.user.create({
        data: {
          name: testName,
          email: `${testName}@test.com`,
          role: "student" // Default value already in schema, but explicitly setting it
        },
      });
      console.log('✅ Test record created successfully:', testRecord.id);
      
      // Verify the record was created
      const verifiedRecord = await prisma.user.findUnique({
        where: { id: testRecord.id },
      });
      
      if (verifiedRecord && verifiedRecord.name === testName) {
        console.log('✅ Data verification successful');
      } else {
        throw new Error('Data verification failed - record not found or data mismatch');
      }
      
      // Delete the test record
      console.log('Deleting test record...');
      await prisma.user.delete({
        where: { id: testRecord.id },
      });
      console.log('✅ Test record deleted successfully');
      
    } catch (prismaError) {
      console.error('❌ Prisma operation failed:', prismaError);
      throw prismaError; // Re-throw to be caught by the outer try/catch
    } finally {
      // Always disconnect from Prisma
      await prisma.$disconnect();
    }

    console.log('✅ Database check completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database check failed:', error);
    console.error('Error details:', {
      name: error.name,
      code: error.code,
      message: error.message,
      cause: error.cause || 'No cause provided'
    });
    
    if (error.code === 'ENOTFOUND') {
      console.error('Could not reach MongoDB Atlas. Please check your internet connection.');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('Connection to MongoDB Atlas timed out. Please check your network settings.');
    }
    process.exit(1);
  }
}

checkDatabase(); 