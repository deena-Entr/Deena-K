import React, { useState, useMemo } from 'react';
import { X, Check, Info, Shield, Plus, Minus, ArrowRight } from 'lucide-react';
import { EventItem, Showtime, Seat, AddOn } from '../types/ticket';
import { GLOBAL_ADD_ONS } from '../data/mockEvents';

interface SeatPickerModalProps {
  event: EventItem;
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: (
    selectedSeats: Seat[],
    selectedShowtime: Showtime,
    selectedAddOns: { addOn: AddOn; quantity: number }[]
  ) => void;
}

export const SeatPickerModal: React.FC<SeatPickerModalProps> = ({
  event,
  isOpen,
  onClose,
  onProceedToCheckout,
}) => {
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime>(
    event.showtimes[0] || {
      id: 'default',
      time: '19:30',
      screenOrHall: 'Main Stage',
      format: 'Standard',
      availableSeats: 30,
    }
  );

  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [addOnQuantities, setAddOnQuantities] = useState<Record<string, number>>({});
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);

  // Generate seat grid based on event rows & seatsPerRow
  const seatGrid: Seat[] = useMemo(() => {
    const list: Seat[] = [];
    event.rows.forEach((rowName, rIdx) => {
      // Determine tier based on row depth
      let tierId = event.tiers[event.tiers.length - 1]?.id || 'tier-std';
      if (rIdx < 2) {
        tierId = event.tiers[0]?.id || 'tier-vip';
      } else if (rIdx < 5) {
        tierId = event.tiers[1]?.id || event.tiers[0]?.id || 'tier-orch';
      }

      for (let sNum = 1; sNum <= event.seatsPerRow; sNum++) {
        const seatKey = `${rowName}-${sNum}`;
        const isOccupied = event.occupiedSeats.includes(seatKey);
        list.push({
          id: seatKey,
          row: rowName,
          number: sNum,
          tierId,
          status: isOccupied ? 'occupied' : 'available',
        });
      }
    });
    return list;
  }, [event]);

  // Derived selected seats list
  const selectedSeats = useMemo(() => {
    return seatGrid.filter((s) => selectedSeatIds.includes(s.id));
  }, [seatGrid, selectedSeatIds]);

  // Toggle seat selection
  const handleToggleSeat = (seat: Seat) => {
    if (seat.status === 'occupied') return;

    if (selectedSeatIds.includes(seat.id)) {
      setSelectedSeatIds((prev) => prev.filter((id) => id !== seat.id));
    } else {
      if (selectedSeatIds.length >= 8) {
        alert('You can select a maximum of 8 seats per booking.');
        return;
      }
      setSelectedSeatIds((prev) => [...prev, seat.id]);
    }
  };

  // Add-on quantity changer
  const handleUpdateAddOn = (addOnId: string, delta: number) => {
    setAddOnQuantities((prev) => {
      const current = prev[addOnId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [addOnId]: next };
    });
  };

  // Calculate pricing
  const ticketsSubtotal = selectedSeats.reduce((acc, seat) => {
    const tier = event.tiers.find((t) => t.id === seat.tierId);
    return acc + (tier?.price || 20);
  }, 0);

  const addOnsSubtotal = GLOBAL_ADD_ONS.reduce((acc, addOn) => {
    const qty = addOnQuantities[addOn.id] || 0;
    return acc + addOn.price * qty;
  }, 0);

  const serviceFee = selectedSeats.length > 0 ? selectedSeats.length * 3.5 : 0;
  const grandTotal = ticketsSubtotal + addOnsSubtotal + serviceFee;

  const handleCheckout = () => {
    if (selectedSeats.length === 0) return;
    const addOnsList = GLOBAL_ADD_ONS.filter((a) => (addOnQuantities[a.id] || 0) > 0).map((a) => ({
      addOn: a,
      quantity: addOnQuantities[a.id],
    }));

    onProceedToCheckout(selectedSeats, selectedShowtime, addOnsList);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span className="text-amber-400 font-semibold uppercase">{event.category}</span>
              <span>·</span>
              <span>{event.venue}</span>
              <span>·</span>
              <span>{event.date}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white font-display mt-0.5">
              {event.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Showtime Selector Bar */}
        <div className="px-4 sm:px-6 py-3 bg-neutral-900/30 border-b border-neutral-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-xs text-neutral-400 font-medium shrink-0 mr-1">Select Showtime:</span>
          {event.showtimes.map((st) => {
            const isSelected = selectedShowtime.id === st.id;
            return (
              <button
                key={st.id}
                onClick={() => setSelectedShowtime(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-400 text-neutral-950 font-semibold shadow-sm'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                <span className="font-mono tabular-nums">{st.time}</span>
                <span className="text-[10px] opacity-75">({st.format})</span>
              </button>
            );
          })}
        </div>

        {/* Main Body: Seat Grid (left/center) + Order Summary & Add-Ons (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* Seating Arena (8 cols on lg) */}
          <div className="lg:col-span-8 p-4 sm:p-6 flex flex-col items-center justify-between border-b lg:border-b-0 lg:border-r border-neutral-800 bg-neutral-950/60">
            {/* Screen / Stage Arc Banner */}
            <div className="w-full max-w-lg mb-8 text-center">
              <div className="relative h-7 flex items-center justify-center">
                {/* Curved glowing arc */}
                <div className="absolute inset-0 border-t-2 border-amber-400/80 rounded-t-[100px] shadow-[0_-8px_20px_rgba(245,158,11,0.25)]" />
                <span className="relative z-10 text-[10px] font-mono tracking-widest text-amber-300 uppercase px-3 bg-neutral-950">
                  STAGE / SCREEN
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">Acoustic Sweet Spot: Rows C – F</p>
            </div>

            {/* Interactive Grid */}
            <div className="w-full overflow-x-auto flex justify-center py-2">
              <div className="inline-block space-y-2.5">
                {event.rows.map((rowName) => {
                  const rowSeats = seatGrid.filter((s) => s.row === rowName);
                  const half = Math.ceil(event.seatsPerRow / 2);
                  const leftHalf = rowSeats.slice(0, half);
                  const rightHalf = rowSeats.slice(half);

                  return (
                    <div key={rowName} className="flex items-center gap-2 sm:gap-3">
                      {/* Row Label */}
                      <span className="w-4 text-center text-xs font-mono font-semibold text-neutral-500">
                        {rowName}
                      </span>

                      {/* Left Block */}
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {leftHalf.map((seat) => {
                          const isSelected = selectedSeatIds.includes(seat.id);
                          const isOccupied = seat.status === 'occupied';
                          const tier = event.tiers.find((t) => t.id === seat.tierId);
                          const tierColor = tier?.color || '#a3a3a3';

                          return (
                            <button
                              key={seat.id}
                              disabled={isOccupied}
                              onClick={() => handleToggleSeat(seat)}
                              onMouseEnter={() => setHoveredSeat(seat)}
                              onMouseLeave={() => setHoveredSeat(null)}
                              aria-label={`Seat ${seat.row}${seat.number}, ${tier?.name}, $${tier?.price}`}
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[10px] font-mono transition-all duration-150 relative ${
                                isOccupied
                                  ? 'bg-neutral-900 border border-neutral-800 text-neutral-600 cursor-not-allowed opacity-40'
                                  : isSelected
                                  ? 'bg-amber-400 text-neutral-950 font-bold scale-110 shadow-md shadow-amber-400/30'
                                  : 'bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:scale-105 border'
                              }`}
                              style={{
                                borderColor: isSelected
                                  ? '#fbbf24'
                                  : isOccupied
                                  ? '#262626'
                                  : tierColor,
                              }}
                            >
                              {isSelected ? (
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              ) : (
                                <span>{seat.number}</span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Center Aisle Spacer */}
                      <div className="w-4 sm:w-6 border-b border-dashed border-neutral-800" />

                      {/* Right Block */}
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {rightHalf.map((seat) => {
                          const isSelected = selectedSeatIds.includes(seat.id);
                          const isOccupied = seat.status === 'occupied';
                          const tier = event.tiers.find((t) => t.id === seat.tierId);
                          const tierColor = tier?.color || '#a3a3a3';

                          return (
                            <button
                              key={seat.id}
                              disabled={isOccupied}
                              onClick={() => handleToggleSeat(seat)}
                              onMouseEnter={() => setHoveredSeat(seat)}
                              onMouseLeave={() => setHoveredSeat(null)}
                              aria-label={`Seat ${seat.row}${seat.number}, ${tier?.name}, $${tier?.price}`}
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[10px] font-mono transition-all duration-150 relative ${
                                isOccupied
                                  ? 'bg-neutral-900 border border-neutral-800 text-neutral-600 cursor-not-allowed opacity-40'
                                  : isSelected
                                  ? 'bg-amber-400 text-neutral-950 font-bold scale-110 shadow-md shadow-amber-400/30'
                                  : 'bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:scale-105 border'
                              }`}
                              style={{
                                borderColor: isSelected
                                  ? '#fbbf24'
                                  : isOccupied
                                  ? '#262626'
                                  : tierColor,
                              }}
                            >
                              {isSelected ? (
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              ) : (
                                <span>{seat.number}</span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Row Label Right */}
                      <span className="w-4 text-center text-xs font-mono font-semibold text-neutral-500">
                        {rowName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hover Tooltip or Status Bar */}
            <div className="w-full mt-4 p-2.5 rounded-lg bg-neutral-900/50 border border-neutral-800/80 text-xs flex items-center justify-between text-neutral-300">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400 shrink-0" />
                {hoveredSeat ? (
                  <span>
                    Seat <strong className="text-white font-mono">{hoveredSeat.row}{hoveredSeat.number}</strong> ·{' '}
                    {event.tiers.find((t) => t.id === hoveredSeat.tierId)?.name} ($
                    {event.tiers.find((t) => t.id === hoveredSeat.tierId)?.price})
                  </span>
                ) : (
                  <span>Click available seats to select. Up to 8 seats per booking.</span>
                )}
              </div>
              <span className="font-mono text-neutral-400 text-[11px]">
                {selectedSeats.length} of 8 selected
              </span>
            </div>

            {/* Seat Legend */}
            <div className="w-full mt-3 pt-3 border-t border-neutral-800/80 flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-400">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-amber-400" />
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-neutral-900 border border-neutral-700" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-neutral-900 border border-neutral-800 opacity-40" />
                <span>Reserved</span>
              </div>

              {event.tiers.map((t) => (
                <div key={t.id} className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-3 rounded-full border-2"
                    style={{ borderColor: t.color }}
                  />
                  <span>
                    {t.name} (${t.price})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar: Selected Seats, Add-ons & Checkout Breakdown (4 cols on lg) */}
          <div className="lg:col-span-4 p-4 sm:p-5 flex flex-col justify-between bg-neutral-900/40">
            <div className="space-y-4">
              {/* Selected Seats Header */}
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                  Selected Seats ({selectedSeats.length})
                </h3>
                {selectedSeats.length === 0 ? (
                  <p className="text-xs text-neutral-500 mt-2 italic">
                    No seats selected yet. Click any seat on the arena map.
                  </p>
                ) : (
                  <div className="mt-2.5 flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
                    {selectedSeats.map((seat) => {
                      const tier = event.tiers.find((t) => t.id === seat.tierId);
                      return (
                        <div
                          key={seat.id}
                          className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 px-2 py-1 rounded text-xs text-neutral-200"
                        >
                          <span className="font-mono font-bold text-amber-400">
                            {seat.row}{seat.number}
                          </span>
                          <span className="text-neutral-400 text-[11px] tabular-nums">
                            ${tier?.price || 20}
                          </span>
                          <button
                            onClick={() => handleToggleSeat(seat)}
                            className="text-neutral-500 hover:text-red-400 ml-1"
                            title="Remove seat"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Recommended Experience Add-Ons */}
              <div className="pt-3 border-t border-neutral-800/80">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                    Concessions & VIP Upgrades
                  </h3>
                  <span className="text-[10px] text-amber-400 font-mono">OPTIONAL</span>
                </div>

                <div className="mt-2.5 space-y-2">
                  {GLOBAL_ADD_ONS.slice(0, 3).map((addOn) => {
                    const qty = addOnQuantities[addOn.id] || 0;
                    return (
                      <div
                        key={addOn.id}
                        className="p-2.5 rounded-lg bg-neutral-900/70 border border-neutral-800 flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-medium text-white truncate">
                            {addOn.name}
                          </div>
                          <div className="text-[11px] text-neutral-400 line-clamp-1">
                            {addOn.description}
                          </div>
                          <div className="text-xs font-mono font-semibold text-amber-400 mt-0.5 tabular-nums">
                            +${addOn.price}
                          </div>
                        </div>

                        {/* Stepper */}
                        <div className="flex items-center gap-1 bg-neutral-950 border border-neutral-800 rounded p-1 shrink-0">
                          <button
                            onClick={() => handleUpdateAddOn(addOn.id, -1)}
                            disabled={qty === 0}
                            className="w-5 h-5 flex items-center justify-center text-neutral-400 hover:text-white disabled:opacity-30"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center text-xs font-mono tabular-nums text-white">
                            {qty}
                          </span>
                          <button
                            onClick={() => handleUpdateAddOn(addOn.id, 1)}
                            className="w-5 h-5 flex items-center justify-center text-neutral-400 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Total & Proceed Button */}
            <div className="pt-4 mt-4 border-t border-neutral-800 space-y-3">
              {/* Line items */}
              <div className="space-y-1.5 text-xs text-neutral-400">
                <div className="flex justify-between">
                  <span>Tickets Subtotal</span>
                  <span className="font-mono tabular-nums text-neutral-200">${ticketsSubtotal}</span>
                </div>
                {addOnsSubtotal > 0 && (
                  <div className="flex justify-between">
                    <span>Add-ons & Upgrades</span>
                    <span className="font-mono tabular-nums text-neutral-200">${addOnsSubtotal}</span>
                  </div>
                )}
                {selectedSeats.length > 0 && (
                  <div className="flex justify-between">
                    <span>Box Office Facility Fee</span>
                    <span className="font-mono tabular-nums text-neutral-200">${serviceFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1 border-t border-neutral-800/80 text-sm font-bold text-white">
                  <span>Estimated Total</span>
                  <span className="font-mono tabular-nums text-amber-400">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                disabled={selectedSeats.length === 0}
                onClick={handleCheckout}
                className="w-full py-3 bg-amber-400 hover:bg-amber-300 disabled:bg-neutral-800 disabled:text-neutral-500 text-neutral-950 font-semibold text-sm rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 disabled:shadow-none cursor-pointer disabled:cursor-not-allowed"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
                <Shield className="w-3.5 h-3.5 text-neutral-400" />
                <span>100% Guaranteed Official Tickets · Instant E-Pass</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
