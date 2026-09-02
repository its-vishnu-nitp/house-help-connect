import React, { useState, useEffect } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import HomeFeed from '../components/dashboard/HomeFeed';
import SettingsView from '../components/dashboard/SettingsView';
import BookingsView from '../components/dashboard/BookingsView';
import ProfessionalsView from '../components/dashboard/ProfessionalsView';
import BookingModal from '../components/dashboard/BookingModal';
import { bookingService } from '../services/booking.service';
import { profileService } from '../services/profile.service';

const ClientDashboard = ({ user }) => {
  const [currentView, setCurrentView] = useState('home');
  const [bookings, setBookings] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null); // Active worker for Booking Modal

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const bookingRes = await bookingService.getMyBookings();
        setBookings(bookingRes.bookings || []);
        
        // Initial load of professionals for home feed
        const workerRes = await profileService.searchWorkers('', '', 1, 6);
        setProfessionals(workerRes.workers || []);
      } catch (err) {
        console.error("Failed to fetch live database records", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleSearch = async (searchTerm) => {
    setIsSearching(true);
    try {
      console.log(`🖥️ [FRONTEND] Searching for: "${searchTerm}"`);
      const workerRes = await profileService.searchWorkers(searchTerm, '', 1, 6);
      setProfessionals(workerRes.workers || []);
    } catch (err) {
      console.error("⚠️ [FRONTEND] Search failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCreateBooking = async (bookingData) => {
    try {
      const res = await bookingService.createBooking(bookingData);
      if (res.booking) {
        setBookings((prev) => [res.booking, ...prev]);
      }
      setSelectedWorker(null);
      setCurrentView('bookings'); // Navigate directly to bookings tab to see the pending job
    } catch (err) {
      console.error("Failed to submit booking request", err);
    }
  };

  const handleUpdateTip = async (id, tipAmount) => {
    setBookings(bookings.map(b => (b._id === id || b.id === id) ? { ...b, tip: tipAmount } : b));
  };

  const handleAcceptDate = async (id) => {
    try {
      await bookingService.updateBookingStatus(id, { scheduleStatus: 'confirmed' });
      setBookings(bookings.map(b => (b._id === id || b.id === id) ? { ...b, scheduleStatus: 'confirmed' } : b));
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleProposeNewDate = async (id, newDate, newTime) => {
    try {
      await bookingService.updateBookingStatus(id, { date: newDate, time: newTime, scheduleStatus: 'pending_pro' });
      setBookings(bookings.map(b => (b._id === id || b.id === id) ? { ...b, date: newDate, time: newTime, scheduleStatus: 'pending_pro' } : b));
    } catch (err) {
      console.error("Failed to propose new date", err);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'home': 
        return (
          <HomeFeed 
            user={user} 
            onSearch={handleSearch} 
            professionals={professionals} 
            isSearching={isSearching}
            onBookWorker={(worker) => setSelectedWorker(worker)}
          />
        );
      case 'professionals': 
        return (
          <ProfessionalsView 
            onBookWorker={(worker) => setSelectedWorker(worker)} 
          />
        );
      case 'bookings': 
        return (
          <BookingsView 
            bookings={bookings} 
            onUpdateTip={handleUpdateTip} 
            onAcceptDate={handleAcceptDate} 
            onProposeNewDate={handleProposeNewDate} 
          />
        );
      case 'settings': 
        return <SettingsView user={user} />;
      default: 
        return (
          <HomeFeed 
            user={user} 
            onSearch={handleSearch} 
            professionals={professionals} 
            isSearching={isSearching} 
            onBookWorker={(worker) => setSelectedWorker(worker)}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen font-sans bg-surface">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      
      <div className="flex-1 w-full ml-20 md:ml-24">
        <main className="w-full p-6 pb-12 mx-auto transition-all duration-300 max-w-7xl md:p-10 pt-28 md:pt-32">
          {loading ? (
            <div className="flex items-center justify-center min-h-[50vh]">
              <p className="text-lg font-semibold text-ink-muted animate-pulse">Loading live database records...</p>
            </div>
          ) : (
            renderView()
          )}
        </main>
      </div>

      {/* One-Time Request Modal */}
      {selectedWorker && (
        <BookingModal 
          worker={selectedWorker}
          onClose={() => setSelectedWorker(null)}
          onSubmit={handleCreateBooking}
        />
      )}
    </div>
  );
};

export default ClientDashboard;