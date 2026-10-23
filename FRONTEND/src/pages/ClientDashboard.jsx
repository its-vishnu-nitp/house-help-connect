import React, { useState, useEffect } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import HomeFeed from '../components/dashboard/HomeFeed';
import SettingsView from '../components/dashboard/SettingsView';
import BookingsView from '../components/dashboard/BookingsView';
import ProfessionalsView from '../components/dashboard/ProfessionalsView';
import BookingModal from '../components/dashboard/BookingModal';
import MessagesView from '../components/dashboard/MessagesView';
import SavedView from '../components/dashboard/SavedView';
import ChatWindow from '../components/dashboard/ChatWindow';
import { bookingService } from '../services/booking.service';
import { profileService } from '../services/profile.service';
import { showToast } from '../utils/toast';

const ClientDashboard = ({ user }) => {
  const [currentView, setCurrentView] = useState('home');
  const [bookings, setBookings] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null); // Active worker for Booking Modal
  const [savedIds, setSavedIds] = useState([]); // Saved HelperProfile ids (persisted server-side)
  const [chatTarget, setChatTarget] = useState(null); // { userId, name, bookingId }

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const bookingRes = await bookingService.getMyBookings();
        setBookings(bookingRes.bookings || []);
        
        // Initial load of professionals for home feed
        const workerRes = await profileService.searchWorkers('', '', 1, 6);
        setProfessionals(workerRes.workers || []);

        // Saved professionals live on the EmployerProfile — load them so
        // the heart buttons render their true persisted state.
        try {
          const profileRes = await profileService.getMyProfile();
          const saved = profileRes.profile?.savedProfessionals || [];
          setSavedIds(saved.map((s) => (typeof s === 'object' ? s._id : s)));
        } catch {
          /* saved list is non-critical for the feed */
        }
      } catch (err) {
        console.error("Failed to fetch live database records", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleSearch = async (searchTerm, city = '') => {
    setIsSearching(true);
    try {
      const workerRes = await profileService.searchWorkers(searchTerm, city, 1, 6);
      setProfessionals(workerRes.workers || []);
    } catch (err) {
      console.error("⚠️ [FRONTEND] Search failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  // Open a chat from a worker profile/card (no booking context yet)
  const handleMessageWorker = (worker) => {
    const userId = worker?.userId?._id || worker?.userId;
    if (!userId) return;
    setChatTarget({ userId, name: worker.userId?.name || 'Professional', bookingId: null });
  };

  // Open a chat from a booking card (message is linked to that booking)
  const handleMessageFromBooking = ({ userId, name, bookingId }) => {
    if (!userId) return;
    setChatTarget({ userId, name: name || 'Professional', bookingId: bookingId || null });
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
      // Surface the failure — silently swallowing it made the modal's
      // Send Request button look dead. The modal also shows the message
      // inline because this handler rethrows.
      showToast(err.response?.data?.message || 'Could not send the booking request. Please try again.', 'error');
      throw err;
    }
  };

  // Tips persist via the status endpoint (the backend stores pricing.tip);
  // previously this only mutated local state and was lost on refresh.
  const handleUpdateTip = async (id, tipAmount) => {
    try {
      const res = await bookingService.updateBookingStatus(id, { tip: tipAmount });
      if (res.booking) {
        setBookings((prev) => prev.map((b) => ((b._id === id || b.id === id) ? res.booking : b)));
      }
    } catch (err) {
      console.error("Failed to save tip", err);
    }
  };

  const handleToggleSave = async (workerProfile) => {
    try {
      const res = await profileService.toggleSaveProfessional(workerProfile._id);
      const saved = res.savedProfessionals || [];
      setSavedIds(saved.map((s) => (typeof s === 'object' ? s._id : s)));
    } catch (err) {
      console.error("Failed to toggle saved professional", err);
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
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            onMessageWorker={handleMessageWorker}
          />
        );
      case 'professionals':
        return (
          <ProfessionalsView
            onBookWorker={(worker) => setSelectedWorker(worker)}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            onMessageWorker={handleMessageWorker}
          />
        );
      case 'bookings':
        return (
          <BookingsView
            bookings={bookings}
            onUpdateTip={handleUpdateTip}
            onMessage={handleMessageFromBooking}
          />
        );
      case 'saved':
        return (
          <SavedView
            onBookWorker={(worker) => setSelectedWorker(worker)}
            onToggleSave={handleToggleSave}
            onMessageWorker={handleMessageWorker}
            onBrowse={() => setCurrentView('professionals')}
          />
        );
      case 'messages':
        return <MessagesView />;
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
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            onMessageWorker={handleMessageWorker}
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

      {/* Chat Modal (opened from bookings, profiles and saved cards) */}
      {chatTarget && (
        <ChatWindow
          otherUserId={chatTarget.userId}
          otherUserName={chatTarget.name}
          bookingId={chatTarget.bookingId}
          onClose={() => setChatTarget(null)}
        />
      )}
    </div>
  );
};

export default ClientDashboard;