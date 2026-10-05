import React, { useState } from 'react';
import { X, Download, Calendar, Smartphone, Share2, Check, QrCode, Sparkles, MapPin, Clock } from 'lucide-react';
import { Booking } from '../types/ticket';
import { generateCalendarICS } from '../utils/calendar';

interface TicketPassModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  onCancelBooking?: (bookingId: string) => void;
}

export const TicketPassModal: React.FC<TicketPassModalProps> = ({
  booking,
  isOpen,
  onClose,
  onCancelBooking,
}) => {
  const [walletAdded, setWalletAdded] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferEmail, setTransferEmail] = useState('');
  const [transferSuccess, setTransferSuccess] = useState(false);

  if (!isOpen) return null;

  const handleAddToWallet = () => {
    setWalletAdded(true);
    setTimeout(() => setWalletAdded(false), 3500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferEmail) return;
    setTransferSuccess(true);
    setTimeout(() => {
      setTransferSuccess(false);
      setIsTransferring(false);
      setTransferEmail('');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-base font-bold text-white font-display">
              Booking Confirmed · E-Ticket Pass
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* E-Ticket Card Layout */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[80vh] space-y-6">
          {/* Tangible Ticket Pass Representation */}
          <div className="relative rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-xl print:border-black print:text-black">
            {/* Ticket Header Banner with Event Image */}
            <div className="relative h-28 w-full overflow-hidden">
              <img
                src={booking.eventImage}
                alt={booking.eventTitle}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover filter brightness-75 contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent" />
              <div className="absolute top-3 left-3 text-[11px] font-mono tracking-widest text-amber-400 font-bold bg-neutral-950/80 px-2.5 py-0.5 rounded border border-neutral-800">
                REF: {booking.bookingRef}
              </div>
            </div>

            {/* Ticket Core Content */}
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white font-display">
                  {booking.eventTitle}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span>{booking.venue}, {booking.city}</span>
                </div>
              </div>

              {/* Grid of details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-neutral-800 text-xs">
                <div>
                  <span className="block text-[10px] text-neutral-500 uppercase tracking-wider">Date</span>
                  <span className="font-semibold text-white">{booking.date}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-neutral-500 uppercase tracking-wider">Showtime</span>
                  <span className="font-semibold text-white font-mono">{booking.showtime}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-neutral-500 uppercase tracking-wider">Format</span>
                  <span className="font-semibold text-amber-400 truncate block">{booking.format}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-neutral-500 uppercase tracking-wider">Access</span>
                  <span className="font-semibold text-white">{booking.gate}</span>
                </div>
              </div>

              {/* Seat Details */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-medium">
                  Reserved Seats ({booking.seats.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {booking.seats.map((s) => (
                    <div
                      key={s.id}
                      className="px-2.5 py-1 rounded bg-neutral-950 border border-neutral-800 flex items-center gap-2 text-xs"
                    >
                      <span className="font-mono font-bold text-amber-400">
                        Row {s.row} · Seat {s.number}
                      </span>
                      <span className="text-[10px] text-neutral-400">({s.tierName})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add-ons line if present */}
              {booking.addOns.length > 0 && (
                <div className="pt-2 border-t border-neutral-800 text-xs text-neutral-400">
                  <span className="font-medium text-neutral-300">Concessions / Upgrades: </span>
                  {booking.addOns.map((a) => `${a.quantity}x ${a.name}`).join(', ')}
                </div>
              )}
            </div>

            {/* Perforated Divider Visual Effect */}
            <div className="relative flex items-center justify-between px-2 bg-neutral-900">
              <div className="w-5 h-5 -ml-4 rounded-full bg-neutral-950 border-r border-neutral-800" />
              <div className="flex-1 border-t border-dashed border-neutral-700/80 mx-2" />
              <div className="w-5 h-5 -mr-4 rounded-full bg-neutral-950 border-l border-neutral-800" />
            </div>

            {/* QR Code & Gate Barcode Scanner section */}
            <div className="p-5 bg-neutral-950/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-xs font-semibold text-white">Present at Gate Scanner</div>
                <div className="text-[11px] text-neutral-400">
                  Attendee: {booking.customer.name}
                </div>
                <div className="text-[10px] text-neutral-500 font-mono">
                  DOORS OPEN 45 MIN PRIOR TO SHOWTIME
                </div>
              </div>

              {/* Scannable SVG QR Code with scanline */}
              <div className="relative p-2.5 bg-white rounded-xl shadow-inner shrink-0 group">
                {/* SVG QR Code Simulation */}
                <svg
                  className="w-24 h-24 text-neutral-950"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                >
                  {/* Top-left position marker */}
                  <rect x="5" y="5" width="26" height="26" rx="3" />
                  <rect x="9" y="9" width="18" height="18" fill="white" />
                  <rect x="13" y="13" width="10" height="10" />

                  {/* Top-right position marker */}
                  <rect x="69" y="5" width="26" height="26" rx="3" />
                  <rect x="73" y="9" width="18" height="18" fill="white" />
                  <rect x="77" y="13" width="10" height="10" />

                  {/* Bottom-left position marker */}
                  <rect x="5" y="69" width="26" height="26" rx="3" />
                  <rect x="9" y="73" width="18" height="18" fill="white" />
                  <rect x="13" y="77" width="10" height="10" />

                  {/* QR Data Dots */}
                  <rect x="36" y="8" width="5" height="5" />
                  <rect x="46" y="8" width="5" height="5" />
                  <rect x="56" y="8" width="5" height="5" />
                  <rect x="36" y="18" width="5" height="5" />
                  <rect x="50" y="24" width="5" height="5" />
                  <rect x="8" y="38" width="5" height="5" />
                  <rect x="18" y="44" width="5" height="5" />
                  <rect x="28" y="38" width="5" height="5" />
                  <rect x="36" y="36" width="6" height="6" />
                  <rect x="46" y="36" width="6" height="6" />
                  <rect x="58" y="36" width="6" height="6" />
                  <rect x="42" y="48" width="5" height="5" />
                  <rect x="52" y="48" width="5" height="5" />
                  <rect x="62" y="48" width="5" height="5" />
                  <rect x="72" y="38" width="5" height="5" />
                  <rect x="82" y="44" width="5" height="5" />
                  <rect x="36" y="62" width="5" height="5" />
                  <rect x="48" y="62" width="5" height="5" />
                  <rect x="58" y="62" width="5" height="5" />
                  <rect x="36" y="76" width="5" height="5" />
                  <rect x="50" y="82" width="5" height="5" />
                  <rect x="64" y="76" width="5" height="5" />
                  <rect x="78" y="72" width="5" height="5" />
                  <rect x="86" y="84" width="5" height="5" />
                </svg>

                {/* Animated subtle scanning beam */}
                <div className="absolute inset-x-2 top-2 h-0.5 bg-amber-500 opacity-70 animate-[pulse_2s_ease-in-out_infinite] shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 print:hidden">
            {/* Add to Apple / Google Wallet */}
            <button
              onClick={handleAddToWallet}
              className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center justify-center gap-1.5 transition-all ${
                walletAdded
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                  : 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {walletAdded ? <Check className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
              <span className="text-[11px] text-center">
                {walletAdded ? 'Added to Wallet' : 'Add to Wallet'}
              </span>
            </button>

            {/* Export .ics Calendar */}
            <button
              onClick={() => generateCalendarICS(booking)}
              className="p-2.5 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 text-xs font-medium flex flex-col items-center justify-center gap-1.5 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span className="text-[11px]">Add to Calendar</span>
            </button>

            {/* Print / Save PDF */}
            <button
              onClick={handlePrint}
              className="p-2.5 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 text-xs font-medium flex flex-col items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="text-[11px]">Download PDF</span>
            </button>

            {/* Transfer Ticket */}
            <button
              onClick={() => setIsTransferring(!isTransferring)}
              className="p-2.5 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 text-xs font-medium flex flex-col items-center justify-center gap-1.5 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-[11px]">Transfer Pass</span>
            </button>
          </div>

          {/* Transfer Subform */}
          {isTransferring && (
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
              <h4 className="text-xs font-semibold text-white">Transfer E-Ticket to a Guest</h4>
              <p className="text-[11px] text-neutral-400">
                Enter your recipient&apos;s email address. Once accepted, their mobile pass will be activated and yours will be updated.
              </p>
              {transferSuccess ? (
                <div className="flex items-center gap-2 p-2 rounded bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300">
                  <Check className="w-4 h-4" />
                  <span>Transfer invite dispatched to {transferEmail}!</span>
                </div>
              ) : (
                <form onSubmit={handleTransfer} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={transferEmail}
                    onChange={(e) => setTransferEmail(e.target.value)}
                    placeholder="friend@example.com"
                    className="flex-1 bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs rounded transition-colors whitespace-nowrap"
                  >
                    Send Invite
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
