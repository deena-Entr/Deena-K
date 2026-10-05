import React from 'react';
import { X, Ticket, QrCode, Calendar, Trash2, ArrowRight } from 'lucide-react';
import { Booking } from '../types/ticket';
import { generateCalendarICS } from '../utils/calendar';

interface MyTicketsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
  onCancelBooking: (bookingId: string) => void;
  onExplore: () => void;
}

export const MyTicketsDrawer: React.FC<MyTicketsDrawerProps> = ({
  isOpen,
  onClose,
  bookings,
  onSelectBooking,
  onCancelBooking,
  onExplore,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-neutral-950 border-l border-neutral-800 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/40">
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white font-display">
                My Bookings & E-Passes
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {bookings.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-600">
                  <Ticket className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">No Tickets Booked Yet</h3>
                  <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                    Your confirmed bookings and digital mobile gate passes will appear here with live barcode scanning.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onExplore();
                  }}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>Explore Experiences</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              bookings.map((booking) => {
                const isCancelled = booking.status === 'cancelled';
                return (
                  <div
                    key={booking.id}
                    className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                      isCancelled
                        ? 'bg-neutral-900/30 border-neutral-800 opacity-60'
                        : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700 shadow-md'
                    }`}
                  >
                    {/* Event image & title stripe */}
                    <div className="relative h-20 w-full overflow-hidden bg-neutral-950">
                      <img
                        src={booking.eventImage}
                        alt={booking.eventTitle}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover filter brightness-70"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
                      <div className="absolute top-2.5 left-3 text-[10px] font-mono tracking-widest text-amber-400 font-bold bg-neutral-950/80 px-2 py-0.5 rounded border border-neutral-800">
                        {booking.bookingRef}
                      </div>

                      {isCancelled && (
                        <div className="absolute top-2.5 right-3 text-[10px] font-mono tracking-widest text-red-400 font-bold bg-neutral-950/90 px-2 py-0.5 rounded border border-red-900">
                          CANCELLED & REFUNDED
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-2.5">
                      <div>
                        <h4 className="text-sm font-bold text-white font-display line-clamp-1">
                          {booking.eventTitle}
                        </h4>
                        <div className="text-xs text-neutral-400 mt-0.5">
                          {booking.venue} · {booking.city}
                        </div>
                      </div>

                      {/* Info grid */}
                      <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-neutral-800/80 text-neutral-300">
                        <div>
                          <span className="text-[10px] text-neutral-500 uppercase block">When</span>
                          <span className="font-semibold text-white">
                            {booking.date} · {booking.showtime}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-500 uppercase block">Seats</span>
                          <span className="font-mono text-amber-400 font-medium">
                            {booking.seats.map((s) => `${s.row}${s.number}`).join(', ')}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-1 flex items-center justify-between gap-2">
                        {!isCancelled ? (
                          <>
                            <button
                              onClick={() => {
                                onSelectBooking(booking);
                                onClose();
                              }}
                              className="flex-1 py-1.5 px-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              <span>View Gate Pass</span>
                            </button>

                            <button
                              onClick={() => generateCalendarICS(booking)}
                              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors border border-neutral-800"
                              title="Add to Calendar"
                            >
                              <Calendar className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    `Are you sure you want to cancel booking ${booking.bookingRef}? Full refund will be processed.`
                                  )
                                ) {
                                  onCancelBooking(booking.id);
                                }
                              }}
                              className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors border border-neutral-800"
                              title="Cancel & Refund"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <div className="text-xs text-neutral-500 italic">
                            Cancelled on {booking.bookedAt}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-neutral-800 text-center text-xs text-neutral-500 bg-neutral-950">
            Official E-Tickets guaranteed by AURA Box Office
          </div>
        </div>
      </div>
    </div>
  );
};
