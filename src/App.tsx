/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { FilterBar } from './components/FilterBar';
import { EventCard } from './components/EventCard';
import { SeatPickerModal } from './components/SeatPickerModal';
import { CheckoutModal } from './components/CheckoutModal';
import { TicketPassModal } from './components/TicketPassModal';
import { MyTicketsDrawer } from './components/MyTicketsDrawer';
import { EventDetailsModal } from './components/EventDetailsModal';
import { MOCK_EVENTS } from './data/mockEvents';
import { EventItem, EventCategory, Showtime, Seat, AddOn, Booking } from './types/ticket';
import { ShieldCheck, Smartphone, Clock, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

const INITIAL_DEMO_BOOKING: Booking = {
  id: 'bkg-demo-1',
  bookingRef: 'AUR-NYC-8821',
  eventId: 'event-aurora-symphony',
  eventTitle: 'The Solstice Philharmonic: Zimmer & Richter',
  eventImage: MOCK_EVENTS[1].image,
  venue: 'Carnegie Grand Symphony Hall',
  city: 'New York',
  date: 'Oct 18, 2026',
  showtime: '21:00',
  format: 'Live Acoustic & Lights',
  seats: [
    { id: 'D-7', row: 'D', number: 7, tierName: 'Royal Box & Prime Stalls', price: 145 },
    { id: 'D-8', row: 'D', number: 8, tierName: 'Royal Box & Prime Stalls', price: 145 },
  ],
  addOns: [
    { id: 'combo_artisan', name: 'Truffle Popcorn & Reserve Beverage', quantity: 2, price: 18 },
  ],
  customer: {
    name: 'Elena Vance',
    email: 'elena.vance@example.com',
    phone: '+1 (555) 234-8901',
  },
  totalAmount: 333.0,
  serviceFee: 7.0,
  bookedAt: 'Oct 04, 2026, 09:15 PM',
  status: 'confirmed',
  gate: 'Gate 2 / Parquet Entrance',
};

export default function App() {
  // Navigation & Filter States
  const [activeCategory, setActiveCategory] = useState<EventCategory>('all');
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Bookings Store (Persisted in localStorage)
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem('aura_bookings_data');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load bookings from localStorage', e);
    }
    return [INITIAL_DEMO_BOOKING];
  });

  useEffect(() => {
    try {
      localStorage.setItem('aura_bookings_data', JSON.stringify(bookings));
    } catch (e) {
      console.error('Failed to save bookings to localStorage', e);
    }
  }, [bookings]);

  // Modal States
  const [seatPickerEvent, setSeatPickerEvent] = useState<EventItem | null>(null);
  const [checkoutData, setCheckoutData] = useState<{
    event: EventItem;
    seats: Seat[];
    showtime: Showtime;
    addOns: { addOn: AddOn; quantity: number }[];
  } | null>(null);
  const [activeTicketPass, setActiveTicketPass] = useState<Booking | null>(null);
  const [detailsEvent, setDetailsEvent] = useState<EventItem | null>(null);
  const [isMyTicketsOpen, setIsMyTicketsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return MOCK_EVENTS.filter((event) => {
      // Category check
      if (activeCategory !== 'all' && event.category !== activeCategory) {
        return false;
      }
      // City check
      if (selectedCity !== 'All Cities' && event.city !== selectedCity) {
        return false;
      }
      // Date filter check
      if (selectedDateFilter === 'tonight' && !event.date.includes('Oct 12')) {
        return false;
      }
      if (selectedDateFilter === 'weekend' && !['Oct 18', 'Oct 24'].some((d) => event.date.includes(d))) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(q);
        const matchesVenue = event.venue.toLowerCase().includes(q);
        const matchesGenre = event.genre.toLowerCase().includes(q);
        const matchesCity = event.city.toLowerCase().includes(q);
        const matchesArtist = event.castOrArtists.some((a) => a.toLowerCase().includes(q));
        if (!matchesTitle && !matchesVenue && !matchesGenre && !matchesCity && !matchesArtist) {
          return false;
        }
      }
      return true;
    });
  }, [activeCategory, selectedCity, selectedDateFilter, searchQuery]);

  // Handlers
  const handleOpenSeatPicker = (event: EventItem) => {
    setSeatPickerEvent(event);
  };

  const handleOpenEventDetails = (event: EventItem) => {
    setDetailsEvent(event);
  };

  const handleProceedToCheckout = (
    seats: Seat[],
    showtime: Showtime,
    addOns: { addOn: AddOn; quantity: number }[]
  ) => {
    if (!seatPickerEvent) return;
    setCheckoutData({
      event: seatPickerEvent,
      seats,
      showtime,
      addOns,
    });
    setSeatPickerEvent(null);
  };

  const handleBookingConfirmed = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    setCheckoutData(null);
    setActiveTicketPass(newBooking);
    showToast(`Order Confirmed! E-Pass Ref: ${newBooking.bookingRef}`);
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );
    showToast('Booking cancelled. Full refund initiated.');
  };

  const featuredHeroEvent = MOCK_EVENTS[0];

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 flex items-center gap-2.5 px-4 py-3 bg-neutral-900 border border-amber-400/80 rounded-xl shadow-2xl text-xs text-white animate-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Contract Navigation */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        onOpenMyTickets={() => setIsMyTicketsOpen(true)}
        ticketsCount={bookings.filter((b) => b.status === 'confirmed').length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1">
        {/* Editorial Hero Campaign Focal Point */}
        <HeroBanner
          featuredEvent={featuredHeroEvent}
          onBookNow={handleOpenSeatPicker}
          onViewDetails={handleOpenEventDetails}
        />

        {/* Filter Controls Bar */}
        <FilterBar
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          selectedCity={selectedCity}
          onSelectCity={setSelectedCity}
          selectedDateFilter={selectedDateFilter}
          onSelectDateFilter={setSelectedDateFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          resultsCount={filteredEvents.length}
        />

        {/* Featured Events Showcase Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-1">
                Curated Schedule
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
                {activeCategory === 'all'
                  ? 'Upcoming Premieres & Live Performances'
                  : `${activeCategory.toUpperCase()} Experiences`}
              </h2>
            </div>
            <div className="text-xs text-neutral-400">
              Direct box-office ticketing · Real-time seat reservation
            </div>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-neutral-800 rounded-2xl bg-neutral-900/30 space-y-3">
              <p className="text-neutral-400 text-sm">
                No experiences match your current filters.
              </p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSelectedCity('All Cities');
                  setSelectedDateFilter('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white rounded-lg transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onBook={handleOpenSeatPicker}
                  onViewDetails={handleOpenEventDetails}
                />
              ))}
            </div>
          )}
        </section>

        {/* Box Office Guarantee & Craftsmanship Section */}
        <section className="border-t border-neutral-800/80 bg-neutral-900/40 py-14 sm:py-18">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-10">
              <div className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-1">
                The AURA Standard
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
                Engineered for Frictionless Gate Access
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-2">
                Every ticket is an authenticated, tamper-proof direct reservation with zero markups or fraudulent third-party reselling.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-neutral-950/80 border border-neutral-800/80 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white font-display">
                  100% Guaranteed Official Seats
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Direct API synchronization with auditorium hall seating networks. Your chosen row and seat are locked immediately upon selection.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-neutral-950/80 border border-neutral-800/80 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white font-display">
                  Native Apple & Google Wallet Passes
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  One-tap pass download with dynamic NFC and high-contrast scannable QR matrix that operates completely offline at entrance turnstiles.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-neutral-950/80 border border-neutral-800/80 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white font-display">
                  Flexible Calendar & Cancellation Terms
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Easily export .ics event reminders directly to your device and request automated refunds or guest ticket transfers up to 2 hours before curtain call.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 bg-neutral-950 py-10 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-neutral-300 tracking-tight font-display">AURA TICKETS</span>
            <span>·</span>
            <span>Premier Live Arts & Cinema Box Office</span>
          </div>

          <div className="flex items-center gap-5 text-neutral-400">
            <span>New York</span>
            <span>London</span>
            <span>Paris</span>
            <span>Tokyo</span>
          </div>

          <div className="text-neutral-500 text-[11px]">
            © {new Date().getFullYear()} AURA Entertainment ticketing systems. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      {seatPickerEvent && (
        <SeatPickerModal
          event={seatPickerEvent}
          isOpen={!!seatPickerEvent}
          onClose={() => setSeatPickerEvent(null)}
          onProceedToCheckout={handleProceedToCheckout}
        />
      )}

      {checkoutData && (
        <CheckoutModal
          event={checkoutData.event}
          seats={checkoutData.seats}
          showtime={checkoutData.showtime}
          addOns={checkoutData.addOns}
          isOpen={!!checkoutData}
          onClose={() => setCheckoutData(null)}
          onBookingSuccess={handleBookingConfirmed}
        />
      )}

      {activeTicketPass && (
        <TicketPassModal
          booking={activeTicketPass}
          isOpen={!!activeTicketPass}
          onClose={() => setActiveTicketPass(null)}
          onCancelBooking={handleCancelBooking}
        />
      )}

      {detailsEvent && (
        <EventDetailsModal
          event={detailsEvent}
          isOpen={!!detailsEvent}
          onClose={() => setDetailsEvent(null)}
          onBookNow={(event, st) => {
            setDetailsEvent(null);
            handleOpenSeatPicker(event);
          }}
        />
      )}

      <MyTicketsDrawer
        isOpen={isMyTicketsOpen}
        onClose={() => setIsMyTicketsOpen(false)}
        bookings={bookings}
        onSelectBooking={(b) => setActiveTicketPass(b)}
        onCancelBooking={handleCancelBooking}
        onExplore={() => {
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
