// src/data/mockData.js

export const categories = [
  { name: 'Deep Cleaning', icon: '🧹' },
  { name: 'Daily Cooking', icon: '🍳' },
  { name: 'Babysitting', icon: '👶' },
  { name: 'Plumbing', icon: '🚰' },
  { name: 'Electrical Repair', icon: '⚡' },
  { name: 'Carpentry', icon: '🔨' },
  { name: 'Laundry & Ironing', icon: '🧺' },
  { name: 'Pest Control', icon: '🐜' }
];

export const allRecommendedWorkers = [
  { id: 1, name: 'Rahul S.', role: 'Deep Cleaning', rating: '4.9', avatar: '👨🏽' },
  { id: 2, name: 'Priya M.', role: 'Daily Cooking', rating: '4.8', avatar: '👩🏽' },
  { id: 3, name: 'Amit K.', role: 'Plumbing', rating: '4.7', avatar: '👨🏻' },
  { id: 4, name: 'Sneha P.', role: 'Babysitting', rating: '4.9', avatar: '👩🏻' },
];

export const initialProfessionals = [
  // SAVED
  { id: 1, name: 'Rahul S.', role: 'Deep Cleaning', rating: '4.9', avatar: '👨🏽', status: 'saved', hiredCount: 3 },
  { id: 2, name: 'Sneha P.', role: 'Babysitting', rating: '4.9', avatar: '👩🏻', status: 'saved', hiredCount: 5 },
  // PAST
  { id: 3, name: 'Priya M.', role: 'Daily Cooking', rating: '4.8', avatar: '👩🏽', status: 'past', lastHired: 'Oct 12, 2026', totalSpent: '₹4,500' },
  { id: 4, name: 'Rohan B.', role: 'Carpentry', rating: '4.9', avatar: '👨🏻', status: 'past', lastHired: 'Sep 05, 2026', totalSpent: '₹1,200' },
];

export const initialBookings = [
  // ================= ACTIVE HIRES =================
  { 
    id: 'BKG-8890', 
    service: 'Deep House Cleaning', 
    date: 'Oct 24, 2026', 
    time: '10:00 AM', 
    status: 'active', 
    scheduleStatus: 'confirmed', 
    professional: 'Rahul S.', 
    avatar: '👨🏽',
    rating: '4.9',
    basePrice: 1500,
    tip: 0,
    paymentStatus: 'pending' // Still needs payment
  },
  // ================= UPCOMING / PENDING =================
  { 
    id: 'BKG-8895', 
    service: 'Kitchen Plumbing', 
    date: 'Oct 26, 2026', 
    time: '02:30 PM', 
    status: 'upcoming', 
    scheduleStatus: 'pending_client', // Pro proposed this time, you must accept
    professional: 'Amit K.', 
    avatar: '👨🏻',
    rating: '4.7',
    basePrice: 800,
    tip: 0,
    paymentStatus: 'pending'
  },
  { 
    id: 'BKG-8898', 
    service: 'Pest Control', 
    date: 'Nov 02, 2026', 
    time: '09:00 AM', 
    status: 'upcoming', 
    scheduleStatus: 'confirmed', // Date is locked in, payment needed to secure
    professional: 'Suresh L.', 
    avatar: '👨🏾',
    rating: '4.8',
    basePrice: 2000,
    tip: 0,
    paymentStatus: 'pending'
  },
  { 
    id: 'BKG-8902', 
    service: 'Carpentry Repair', 
    date: 'Nov 05, 2026', 
    time: '11:00 AM', 
    status: 'upcoming', 
    scheduleStatus: 'pending_pro', // You proposed this time, waiting on Pro
    professional: 'Rohan B.', 
    avatar: '👨🏻',
    rating: '4.9',
    basePrice: 1200,
    tip: 0,
    paymentStatus: 'pending'
  },
  // ================= COMPLETED =================
  { 
    id: 'BKG-8710', 
    service: 'Babysitting', 
    date: 'Oct 10, 2026', 
    time: '06:00 PM', 
    status: 'completed', 
    scheduleStatus: 'confirmed',
    professional: 'Sneha P.', 
    avatar: '👩🏻',
    rating: '4.9',
    basePrice: 1200,
    tip: 150, 
    paymentStatus: 'paid'
  },
  { 
    id: 'BKG-8605', 
    service: 'Electrical Repair', 
    date: 'Sep 28, 2026', 
    time: '11:00 AM', 
    status: 'completed', 
    scheduleStatus: 'confirmed',
    professional: 'Vikram D.', 
    avatar: '👨🏾',
    rating: '4.8',
    basePrice: 450,
    tip: 0, 
    paymentStatus: 'paid'
  },
  // ================= CANCELLED =================
  { 
    id: 'BKG-8550', 
    service: 'Daily Cooking', 
    date: 'Sep 15, 2026', 
    time: '08:00 AM', 
    status: 'cancelled', 
    scheduleStatus: 'confirmed',
    professional: 'Priya M.', 
    avatar: '👩🏽',
    rating: '4.8',
    basePrice: 3000,
    tip: 0, 
    paymentStatus: 'refunded'
  }
];