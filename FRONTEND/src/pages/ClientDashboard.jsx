import React, { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import HomeFeed from '../components/dashboard/HomeFeed';
import SettingsView from '../components/dashboard/SettingsView';
import BookingsView from '../components/dashboard/BookingsView';
import ProfessionalsView from '../components/dashboard/ProfessionalsView';
import { initialBookings, initialProfessionals } from '../data/mockData';

const ClientDashboard = ({ user }) => {
  const [currentView, setCurrentView] = useState('home'); 
  const [bookings, setBookings] = useState(initialBookings);
  const [professionals, setProfessionals] = useState(initialProfessionals);

  const handleUpdateTip = (id, tipAmount) => setBookings(bookings.map(b => b.id === id ? { ...b, tip: tipAmount } : b));
  const handleAcceptDate = (id) => setBookings(bookings.map(b => b.id === id ? { ...b, scheduleStatus: 'confirmed' } : b));
  const handleProposeNewDate = (id, newDate, newTime) => setBookings(bookings.map(b => b.id === id ? { ...b, date: newDate, time: newTime, scheduleStatus: 'pending_pro' } : b));

  const renderView = () => {
    switch (currentView) {
      case 'home': return <HomeFeed user={user} />;
      case 'professionals': return <ProfessionalsView professionals={professionals} bookings={bookings} />;
      case 'bookings': return <BookingsView bookings={bookings} onUpdateTip={handleUpdateTip} onAcceptDate={handleAcceptDate} onProposeNewDate={handleProposeNewDate} />;
      case 'settings': return <SettingsView user={user} />;
      default: return <HomeFeed user={user} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      {/* Ensure padding left matches sidebar width (w-16/w-20) */}
      <div className="flex-1 w-full max-w-6xl p-6 pb-10 pl-20 mx-auto md:p-8 md:pl-28">
        {renderView()}
      </div>
    </div>
  );
};

export default ClientDashboard;