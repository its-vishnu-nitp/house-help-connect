import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import HelperProfile from './models/HelperProfile.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URL || 'mongodb://localhost:27017/house-help-connect';

const dummyWorkers = [
  {
    name: 'Sunita Sharma',
    email: 'sunita.sharma@example.com',
    phoneNumber: '9820011223',
    city: 'Mumbai',
    services: ['Deep Cleaning', 'Cooking'],
    hourlyRate: 300,
    experience: 6,
    bio: 'Professional cook and deep cleaner with over 6 years of experience serving residential apartments in South Mumbai. Certified hygiene and food safety standards.',
    rating: 4.9,
    reviewsCount: 38
  },
  {
    name: 'Ramesh Verma',
    email: 'ramesh.verma@example.com',
    phoneNumber: '9811223344',
    city: 'Delhi',
    services: ['Plumbing', 'Electrician'],
    hourlyRate: 350,
    experience: 8,
    bio: 'Licensed electrician and sanitary plumber. Specialized in pipe repairs, leak detection, circuit breaker overhauls, and complete bathroom installations.',
    rating: 4.8,
    reviewsCount: 52
  },
  {
    name: 'Pooja Devi',
    email: 'pooja.devi@example.com',
    phoneNumber: '9833445566',
    city: 'Mumbai',
    services: ['Babysitting', 'Elderly Care'],
    hourlyRate: 280,
    experience: 5,
    bio: 'Gentle, patient caregiver with basic medical training and certified infant CPR. Dedicated to reliable elder companionship and attentive childcare.',
    rating: 4.95,
    reviewsCount: 29
  },
  {
    name: 'Anil Kumar',
    email: 'anil.kumar@example.com',
    phoneNumber: '9844556677',
    city: 'Patna',
    services: ['Carpentry', 'Deep Cleaning'],
    hourlyRate: 250,
    experience: 4,
    bio: 'Handyman skilled in custom wooden furniture restoration, door hinge replacements, and post-renovation intensive floor scrub downs.',
    rating: 4.7,
    reviewsCount: 19
  },
  {
    name: 'Kavita Patel',
    email: 'kavita.patel@example.com',
    phoneNumber: '9855667788',
    city: 'Mumbai',
    services: ['Cooking'],
    hourlyRate: 400,
    experience: 10,
    bio: 'Master home-chef specializing in North & South Indian, Gujarati, and Jain cuisines. Meal prep, daily lunch tiffins, and dinner catering for family gatherings.',
    rating: 5.0,
    reviewsCount: 64
  },
  {
    name: 'Deepak Joshi',
    email: 'deepak.joshi@example.com',
    phoneNumber: '9866778899',
    city: 'Delhi',
    services: ['Electrician'],
    hourlyRate: 320,
    experience: 7,
    bio: 'Experienced in residential wiring, inverter/UPS installation, smart switch setup, and rapid appliance fault diagnostics.',
    rating: 4.85,
    reviewsCount: 41
  }
];

const seedDB = async () => {
  try {
    console.log('🟡 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('🟢 MongoDB connected successfully.');

    // Remove existing dummy worker accounts by email
    const dummyEmails = dummyWorkers.map((w) => w.email);
    const existingDummyUsers = await User.find({ email: { $in: dummyEmails } });
    const existingDummyIds = existingDummyUsers.map((u) => u._id);

    if (existingDummyIds.length > 0) {
      await HelperProfile.deleteMany({ userId: { $in: existingDummyIds } });
      await User.deleteMany({ _id: { $in: existingDummyIds } });
      console.log(`🧹 Cleaned up ${existingDummyIds.length} previous dummy workers.`);
    }

    const defaultHashedPassword = await bcrypt.hash('Password@123', 10);

    for (const workerData of dummyWorkers) {
      // 1. Insert into User collection
      const newUser = await User.create({
        name: workerData.name,
        email: workerData.email,
        password: defaultHashedPassword,
        phoneNumber: workerData.phoneNumber,
        role: 'worker',
        isActive: true,
        location: {
          city: workerData.city,
          address: 'Downtown Sector'
        }
      });

      // 2. Insert corresponding HelperProfile linked by userId
      await HelperProfile.create({
        userId: newUser._id,
        services: workerData.services,
        serviceCategory: workerData.services[0],
        hourlyRate: workerData.hourlyRate,
        experience: workerData.experience,
        bio: workerData.bio,
        rating: workerData.rating,
        reviewsCount: workerData.reviewsCount,
        isAvailable: true
      });

      console.log(`✅ Seeded: ${workerData.name} (${workerData.services.join(', ')}) in ${workerData.city}`);
    }

    console.log('\n🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('🔴 Seeding failed:', err);
    process.exit(1);
  }
};

seedDB();