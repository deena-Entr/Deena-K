import React from 'react';
import { X, MapPin, Calendar, Clock, Star, Volume2, ShieldCheck, Ticket, Users } from 'lucide-react';
import { EventItem, Showtime } from '../types/ticket';

interface EventDetailsModalProps {
  event: EventItem;
  isOpen: boolean;
  onClose: () => void;
  onBookNow: (event: EventItem, initialShowtime?: Showtime) => void;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  event,
  isOpen,
  onClose,
  onBookNow,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Banner with image */}
        <div className="relative h-56 sm:h-72 w-full overflow-hidden shrink-0">
          <img
            src={event.image}
            alt={event.title}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center filter brightness-[0.75]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-neutral-950/80 text-neutral-300 hover:text-white border border-neutral-800 transition-colors backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title overlay */}
          <div className="absolute bottom-4 left-5 right-5 space-y-1">
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <span className="text-amber-400 font-semibold uppercase tracking-wider">
                {event.category}
              </span>
              <span>·</span>
              <span>{event.genre}</span>
              <span>·</span>
              <div className="flex items-center gap-1 text-white">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="font-mono tabular-nums font-semibold">{event.rating.toFixed(2)}</span>
                <span className="text-neutral-400 text-[11px]">({event.reviewCount} verified ratings)</span>
              </div>
            </div>
            <h2 className="text-xl sm:text-3xl font-bold text-white font-display">
              {event.title}
            </h2>
          </div>
        </div>

        {/* Content body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Key metadata row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs text-neutral-300">
            <div>
              <span className="text-[10px] text-neutral-500 uppercase block">Venue</span>
              <span className="font-medium text-white line-clamp-1">{event.venue}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 uppercase block">Duration</span>
              <span className="font-medium text-white">{event.duration}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 uppercase block">Age Rating</span>
              <span className="font-medium text-white">{event.ageGuidance}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 uppercase block">Starting At</span>
              <span className="font-mono font-bold text-amber-400 tabular-nums">
                ${Math.min(...event.tiers.map((t) => t.price))}
              </span>
            </div>
          </div>

          {/* Synopsis */}
          <div>
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Experience Synopsis
            </h3>
            <p className="text-sm text-neutral-200 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Highlights */}
          <div>
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2.5">
              Production Highlights & Technical Specs
            </h3>
            <ul className="space-y-2">
              {event.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-neutral-300">
                  <span className="text-amber-400 font-bold mt-0.5">·</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cast & Creatives */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-800/80">
            <div>
              <span className="text-[11px] text-neutral-500 uppercase block mb-1">
                Direction / Curator
              </span>
              <span className="text-xs font-medium text-white">{event.organizerOrDirector}</span>
            </div>
            <div>
              <span className="text-[11px] text-neutral-500 uppercase block mb-1">
                Featured Cast / Performers
              </span>
              <span className="text-xs font-medium text-neutral-300">
                {event.castOrArtists.join(', ')}
              </span>
            </div>
          </div>

          {/* Available Showtimes with instant book button */}
          <div className="pt-2 border-t border-neutral-800/80">
            <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-3">
              Available Sessions & Showtimes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {event.showtimes.map((st) => (
                <div
                  key={st.id}
                  className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between hover:border-neutral-700 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold font-mono text-white tabular-nums">
                        {st.time}
                      </span>
                      <span className="text-[11px] text-amber-400 font-medium">
                        {st.format}
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">
                      {st.screenOrHall} · {st.availableSeats} seats available
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onBookNow(event, st);
                    }}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-amber-400 hover:text-neutral-950 text-neutral-200 text-xs font-medium rounded transition-colors whitespace-nowrap"
                  >
                    Select Seats
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-neutral-800 bg-neutral-900/60 flex items-center justify-between">
          <div className="text-xs text-neutral-400">
            <span>Official Box Office Partner</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onBookNow(event);
            }}
            className="flex items-center gap-2 px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold rounded-lg transition-colors shadow-md shadow-amber-400/20"
          >
            <Ticket className="w-4 h-4" />
            <span>Select Seats & Book</span>
          </button>
        </div>
      </div>
    </div>
  );
};
