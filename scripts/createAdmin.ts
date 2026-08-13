// scripts/createAdmin.ts
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// ✅ تحميل الـ .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  role: String,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createAdmin() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env.local');
    process.exit(1);
  }

  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    // Delete old admin if exists
    await User.deleteOne({ email: 'admin@kairos.studio' });
    
    await User.create({
      email: 'admin@kairos.studio',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin'
    });
    
    console.log('\n✅ Admin user created successfully!');
    console.log('   Email: admin@kairos.studio');
    console.log('   Password: 123456\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

createAdmin();