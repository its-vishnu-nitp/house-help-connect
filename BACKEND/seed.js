/**
 * seed.js — demo data for House Help Connect.
 *
 * Creates 12 workers + 4 clients (all passwords: Password@123) plus a few
 * demo bookings so every flow is visible immediately:
 *   - one COMPLETED + PAID booking with a Payment record and a Review
 *   - one CONFIRMED, unpaid booking (shows the "Pay Now" flow)
 *   - one PENDING booking request (shows up in the worker's inbox)
 *
 * Re-runnable: every document tied to a seeded email is deleted first
 * (users, profiles, bookings, payments, reviews, notifications), so
 * running it twice never duplicates data.
 *
 * IMPORTANT for search visibility: a worker only appears in
 * GET /api/profiles/search when ALL of these hold —
 *   User.role === 'worker', User.isActive === true,
 *   User.isAadhaarVerified === true (seeded workers are created verified),
 *   HelperProfile exists with isAvailable === true, and its `services`
 *   contain the searched text (category names below match the app's
 *   canonical categories in FRONTEND/src/data/mockData.js exactly, so
 *   dashboard category clicks actually match).
 */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import HelperProfile from './models/HelperProfile.js';
import EmployerProfile from './models/EmployerProfile.js';
import Booking from './models/Booking.js';
import Payment from './models/Payment.js';
import Review from './models/Review.js';
import Notification from './models/Notification.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URL || 'mongodb://localhost:27017/house-help-connect';
const SEED_PASSWORD = 'Password@123';

const dummyWorkers = [
  {
    name: 'Sunita Sharma', email: 'sunita.sharma@example.com', phoneNumber: '9820011223',
    city: 'Mumbai', services: ['Deep Cleaning', 'Daily Cooking'], hourlyRate: 300, experience: 6,
    bio: 'Professional cook and deep cleaner with 6+ years of experience in South Mumbai apartments. Certified in hygiene and food-safety standards; known for spotless kitchens and on-time tiffins.',
    rating: 4.9, totalReviews: 38,
  },
  {
    name: 'Ramesh Verma', email: 'ramesh.verma@example.com', phoneNumber: '9811223344',
    city: 'Delhi', services: ['Plumbing', 'Electrical Repair'], hourlyRate: 350, experience: 8,
    bio: 'Licensed plumber and electrician. Specialises in leak detection, pipe repairs, circuit-breaker overhauls and complete bathroom fittings. Same-day visits across Delhi NCR.',
    rating: 4.8, totalReviews: 52,
  },
  {
    name: 'Pooja Devi', email: 'pooja.devi@example.com', phoneNumber: '9833445566',
    city: 'Mumbai', services: ['Babysitting'], hourlyRate: 280, experience: 5,
    bio: 'Gentle, patient babysitter with infant-CPR training and 5 years of experience with children aged 6 months to 8 years. Happy to help with meals, playtime and school pickups.',
    rating: 4.9, totalReviews: 29,
  },
  {
    name: 'Anil Kumar', email: 'anil.kumar@example.com', phoneNumber: '9844556677',
    city: 'Patna', services: ['Carpentry', 'Deep Cleaning'], hourlyRate: 250, experience: 4,
    bio: 'Carpenter skilled in furniture repair, door and hinge work, and modular kitchen fixes. Also offers post-renovation deep cleaning for new homes in Patna.',
    rating: 4.7, totalReviews: 19,
  },
  {
    name: 'Kavita Patel', email: 'kavita.patel@example.com', phoneNumber: '9855667788',
    city: 'Mumbai', services: ['Daily Cooking'], hourlyRate: 400, experience: 10,
    bio: 'Master home chef with 10 years of experience in North Indian, South Indian, Gujarati and Jain kitchens. Daily meals, tiffins and small family-event catering.',
    rating: 5.0, totalReviews: 64,
  },
  {
    name: 'Deepak Joshi', email: 'deepak.joshi@example.com', phoneNumber: '9866778899',
    city: 'Delhi', services: ['Electrical Repair'], hourlyRate: 320, experience: 7,
    bio: 'Residential electrician experienced in wiring, inverter/UPS installation, smart switches and quick appliance fault diagnosis. Safety-first, transparent pricing.',
    rating: 4.8, totalReviews: 41,
  },
  {
    name: 'Meena Iyer', email: 'meena.iyer@example.com', phoneNumber: '9877001122',
    city: 'Bengaluru', services: ['Deep Cleaning', 'Laundry & Ironing'], hourlyRate: 275, experience: 5,
    bio: 'Detail-obsessed home cleaner for apartments and villas in Bengaluru. Weekly deep-clean plans, laundry and ironing bundles, and move-in/move-out cleans.',
    rating: 4.8, totalReviews: 33,
  },
  {
    name: 'Arjun Singh', email: 'arjun.singh@example.com', phoneNumber: '9812345670',
    city: 'Delhi', services: ['Plumbing'], hourlyRate: 300, experience: 6,
    bio: 'Plumber for emergency leaks, tap and flush repairs, water-tank cleaning and RO fittings. Carries all standard tools and spares; 30-day workmanship warranty.',
    rating: 4.6, totalReviews: 27,
  },
  {
    name: 'Lakshmi Reddy', email: 'lakshmi.reddy@example.com', phoneNumber: '9849012345',
    city: 'Hyderabad', services: ['Babysitting', 'Daily Cooking'], hourlyRate: 260, experience: 7,
    bio: 'Warm, experienced nanny and home cook in Hyderabad. Loving childcare for toddlers plus wholesome South Indian meals; fluent in Telugu, Hindi and English.',
    rating: 4.9, totalReviews: 45,
  },
  {
    name: 'Mohammed Faiz', email: 'mohammed.faiz@example.com', phoneNumber: '9822334455',
    city: 'Pune', services: ['Pest Control', 'Deep Cleaning'], hourlyRate: 450, experience: 9,
    bio: 'Certified pest-control specialist — cockroach, termite and mosquito treatments with child- and pet-safe chemicals. Government-licensed, with free re-service in 45 days.',
    rating: 4.7, totalReviews: 58,
  },
  {
    name: 'Sita Kumari', email: 'sita.kumari@example.com', phoneNumber: '9835011223',
    city: 'Patna', services: ['Laundry & Ironing', 'Deep Cleaning'], hourlyRate: 200, experience: 3,
    bio: 'Reliable laundry and ironing service with same-day turnaround in Patna. Careful with delicates and formals; weekly home-cleaning slots also available.',
    rating: 4.5, totalReviews: 14,
  },
  {
    name: 'Vikram Chauhan', email: 'vikram.chauhan@example.com', phoneNumber: '9811099887',
    city: 'Delhi', services: ['Carpentry'], hourlyRate: 380, experience: 11,
    bio: 'Master carpenter with 11 years of experience — custom wardrobes, modular repairs, door alignment and furniture polishing. Free site visit for jobs above ₹2,000.',
    rating: 4.9, totalReviews: 47,
  },
];

const dummyClients = [
  { name: 'Aarav Mehta', email: 'aarav.mehta@example.com', phoneNumber: '9810012345', city: 'Mumbai', familySize: 4 },
  { name: 'Priya Nair', email: 'priya.nair@example.com', phoneNumber: '9847011223', city: 'Bengaluru', familySize: 3 },
  { name: 'Rohan Gupta', email: 'rohan.gupta@example.com', phoneNumber: '9811044556', city: 'Delhi', familySize: 5 },
  { name: 'Sneha Kulkarni', email: 'sneha.kulkarni@example.com', phoneNumber: '9822055667', city: 'Pune', familySize: 2 },
];

const daysFromNow = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
};

const seedDB = async () => {
  try {
    console.log('🟡 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('🟢 MongoDB connected successfully.');

    const allSeedEmails = [...dummyWorkers, ...dummyClients].map((u) => u.email);

    // --- Clean previous seed run (idempotent re-seeding) ---
    const existing = await User.find({ email: { $in: allSeedEmails } }).select('_id');
    const existingIds = existing.map((u) => u._id);
    if (existingIds.length > 0) {
      const oldBookings = await Booking.find({
        $or: [{ client: { $in: existingIds } }, { professional: { $in: existingIds } }],
      }).select('_id');
      const oldBookingIds = oldBookings.map((b) => b._id);
      await Payment.deleteMany({ booking: { $in: oldBookingIds } });
      await Review.deleteMany({ booking: { $in: oldBookingIds } });
      await Booking.deleteMany({ _id: { $in: oldBookingIds } });
      await Notification.deleteMany({ recipient: { $in: existingIds } });
      await HelperProfile.deleteMany({ userId: { $in: existingIds } });
      await EmployerProfile.deleteMany({ userId: { $in: existingIds } });
      await User.deleteMany({ _id: { $in: existingIds } });
      console.log(`🧹 Cleaned up ${existingIds.length} previously seeded users and their data.`);
    }

    const hashedPassword = await bcrypt.hash(SEED_PASSWORD, 10);
    const workerUsers = {};
    const clientUsers = {};

    // --- Workers ---
    for (const w of dummyWorkers) {
      const user = await User.create({
        name: w.name,
        email: w.email,
        password: hashedPassword,
        phoneNumber: w.phoneNumber,
        role: 'worker',
        bio: w.bio,
        isActive: true,
        // Seeded pros are demo-verified: public search only returns
        // Aadhaar-verified workers, so without this the demo would be empty.
        isAadhaarVerified: true,
        location: { city: w.city, address: 'Demo address — seeded profile' },
      });

      await HelperProfile.create({
        userId: user._id,
        services: w.services,
        serviceCategory: w.services[0],
        hourlyRate: w.hourlyRate,
        experience: w.experience,
        bio: w.bio,
        rating: w.rating,
        totalReviews: w.totalReviews,
        isAvailable: true,
      });

      workerUsers[w.email] = user;
      console.log(`✅ Worker: ${w.name} (${w.services.join(', ')}) — ${w.city}`);
    }

    // --- Clients ---
    for (const c of dummyClients) {
      const user = await User.create({
        name: c.name,
        email: c.email,
        password: hashedPassword,
        phoneNumber: c.phoneNumber,
        role: 'client',
        isActive: true,
        location: { city: c.city, address: 'Demo address — seeded profile' },
      });

      await EmployerProfile.create({ userId: user._id, familySize: c.familySize });
      clientUsers[c.email] = user;
      console.log(`✅ Client: ${c.name} — ${c.city}`);
    }

    // --- Demo bookings ---
    const aarav = clientUsers['aarav.mehta@example.com'];
    const priya = clientUsers['priya.nair@example.com'];
    const sunita = workerUsers['sunita.sharma@example.com'];
    const meena = workerUsers['meena.iyer@example.com'];
    const ramesh = workerUsers['ramesh.verma@example.com'];

    // 1) Completed + PAID, with Payment + Review (shows receipt & rating flow)
    const paidBooking = await Booking.create({
      bookingId: 'BKG-9001',
      client: aarav._id,
      professional: sunita._id,
      service: 'Deep Cleaning',
      date: daysFromNow(-3),
      time: '10:00',
      notes: 'Full 3BHK deep clean before guests arrive.',
      status: 'completed',
      scheduleStatus: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'UPI',
      paidAt: daysFromNow(-3),
      transactionId: 'TXN_SEED9001DEMO',
      pricing: { basePrice: 600, tip: 100 },
    });
    await Payment.create({
      booking: paidBooking._id,
      client: aarav._id,
      professional: sunita._id,
      transactionId: 'TXN_SEED9001DEMO',
      amount: 700,
      status: 'success',
      paymentMethod: 'UPI',
    });
    await Review.create({
      booking: paidBooking._id,
      reviewer: aarav._id,
      reviewee: sunita._id,
      rating: 5,
      comment: 'Absolutely sparkling work — the kitchen looks brand new. Punctual and very professional!',
    });

    // 2) Confirmed, UNPAID (client sees the Pay Now flow)
    await Booking.create({
      bookingId: 'BKG-9002',
      client: aarav._id,
      professional: meena._id,
      service: 'Deep Cleaning',
      date: daysFromNow(2),
      time: '09:00',
      notes: 'Weekly deep clean, 2BHK.',
      status: 'upcoming',
      scheduleStatus: 'confirmed',
      paymentStatus: 'pending',
      pricing: { basePrice: 550, tip: 0 },
    });

    // 3) Pending request (worker sees it in their inbox; client sees "Awaiting Approval")
    await Booking.create({
      bookingId: 'BKG-9003',
      client: priya._id,
      professional: ramesh._id,
      service: 'Plumbing',
      date: daysFromNow(1),
      time: '17:30',
      notes: 'Kitchen sink leakage under the cabinet.',
      status: 'upcoming',
      scheduleStatus: 'pending_pro',
      paymentStatus: 'pending',
      pricing: { basePrice: 700, tip: 0 },
    });

    console.log('✅ Demo bookings created (1 paid+completed+reviewed, 1 confirmed/unpaid, 1 pending).');
    console.log(`\n🎉 Seeding completed! All demo users log in with password: ${SEED_PASSWORD}`);
    process.exit(0);
  } catch (err) {
    console.error('🔴 Seeding failed:', err);
    process.exit(1);
  }
};

seedDB();
