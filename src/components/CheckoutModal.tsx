import React, { useState } from 'react';
import { X, CreditCard, Lock, ShieldCheck, CheckCircle2, Smartphone, ArrowRight } from 'lucide-react';
import { EventItem, Showtime, Seat, AddOn, Booking } from '../types/ticket';

interface CheckoutModalProps {
  event: EventItem;
  seats: Seat[];
  showtime: Showtime;
  addOns: { addOn: AddOn; quantity: number }[];
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (booking: Booking) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  event,
  seats,
  showtime,
  addOns,
  isOpen,
  onClose,
  onBookingSuccess,
}) => {
  const [customerName, setCustomerName] = useState('Elena Vance');
  const [customerEmail, setCustomerEmail] = useState('elena.vance@example.com');
  const [customerPhone, setCustomerPhone] = useState('+1 (555) 234-8901');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'quickpay'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 9012');
  const [expiry, setExpiry] = useState('11/28');
  const [cvc, setCvc] = useState('782');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState('');

  // Calculations
  const ticketsTotal = seats.reduce((acc, s) => {
    const tier = event.tiers.find((t) => t.id === s.tierId);
    return acc + (tier?.price || 25);
  }, 0);

  const addOnsTotal = addOns.reduce((acc, item) => acc + item.addOn.price * item.quantity, 0);
  const serviceFee = seats.length * 3.5;
  const grandTotal = ticketsTotal + addOnsTotal + serviceFee;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim()) {
      setFormError('Please enter your full name and valid email for e-ticket delivery.');
      return;
    }

    setFormError('');
    setIsProcessing(true);

    // Simulate swift bank authorization
    setTimeout(() => {
      setIsProcessing(false);
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const cityCode = event.city.slice(0, 3).toUpperCase();
      const bookingRef = `AUR-${cityCode}-${randomSuffix}`;

      const newBooking: Booking = {
        id: `bkg-${Date.now()}`,
        bookingRef,
        eventId: event.id,
        eventTitle: event.title,
        eventImage: event.image,
        venue: event.venue,
        city: event.city,
        date: event.date,
        showtime: showtime.time,
        format: showtime.format,
        seats: seats.map((s) => {
          const tier = event.tiers.find((t) => t.id === s.tierId);
          return {
            id: s.id,
            row: s.row,
            number: s.number,
            tierName: tier?.name || 'Standard',
            price: tier?.price || 25,
          };
        }),
        addOns: addOns.map((item) => ({
          id: item.addOn.id,
          name: item.addOn.name,
          quantity: item.quantity,
          price: item.addOn.price,
        })),
        customer: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
        },
        totalAmount: grandTotal,
        serviceFee,
        bookedAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'confirmed',
        gate: `Gate ${Math.floor(Math.random() * 4) + 1} / Entrance ${event.rows[0]}`,
      };

      onBookingSuccess(newBooking);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-bold text-white font-display">
              Secure Checkout & Ticket Issuance
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Summary Ribbon */}
        <div className="bg-neutral-900/40 p-4 border-b border-neutral-800 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-neutral-400 font-medium">{event.title}</div>
              <div className="text-neutral-300 font-mono mt-0.5">
                {event.date} · {showtime.time} ({showtime.format})
              </div>
            </div>
            <div className="text-right">
              <div className="text-neutral-400 font-medium">
                {seats.length} {seats.length === 1 ? 'Seat' : 'Seats'}:{' '}
                <span className="text-amber-400 font-mono">
                  {seats.map((s) => `${s.row}${s.number}`).join(', ')}
                </span>
              </div>
              <div className="text-white font-mono font-bold text-sm tabular-nums mt-0.5">
                ${grandTotal.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handlePay} className="p-5 sm:p-6 space-y-5">
          {formError && (
            <div className="p-3 rounded-lg bg-red-950/50 border border-red-800/80 text-xs text-red-200">
              {formError}
            </div>
          )}

          {/* Attendee Details */}
          <div>
            <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-3">
              1. Attendee & E-Pass Delivery Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  placeholder="e.g. Elena Vance"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">
                  Delivery Email (for PDF & Wallet pass)
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  placeholder="name@example.com"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] text-neutral-400 mb-1">
                  Mobile Phone (for Gate SMS Pass)
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          </div>

          {/* Payment Selection */}
          <div className="pt-2">
            <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-3">
              2. Payment Method
            </h3>

            {/* Quick 1-Click Pay toggle */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-amber-400 bg-amber-400/10 text-amber-300 font-semibold'
                    : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Credit / Debit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('quickpay')}
                className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'quickpay'
                    ? 'border-amber-400 bg-amber-400/10 text-amber-300 font-semibold'
                    : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Apple / Google Pay</span>
              </button>
            </div>

            {paymentMethod === 'card' ? (
              <div className="space-y-3 bg-neutral-900/60 p-3.5 rounded-lg border border-neutral-800">
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                    placeholder="4242 4242 4242 4242"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">CVC / Security Code</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                      placeholder="•••"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-neutral-900/60 p-4 rounded-lg border border-neutral-800 text-center space-y-2">
                <p className="text-xs text-neutral-300">
                  Ready to authenticate with biometric device pass (Face ID / Fingerprint).
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-neutral-950 border border-neutral-700 text-xs font-semibold text-white font-mono">
                  Apple Pay / Google Wallet Express
                </div>
              </div>
            )}
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-sm rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                  <span>Authorizing & Minting E-Tickets...</span>
                </>
              ) : (
                <>
                  <span>Authorize & Confirm Booking (${grandTotal.toFixed(2)})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500 mt-2.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>TLS 256-Bit Encrypted · Instant SMS & Wallet Dispatch</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
