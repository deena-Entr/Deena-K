import React from 'react';
import { Calendar, MapPin, Star, Ticket } from 'lucide-react';
import { EventItem } from '../types/ticket';

interface EventCardProps {
  event: EventItem;
  onBook: (event: EventItem) => void;
  onViewDetails: (event: EventItem) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onBook, onViewDetails }) => {
  const lowestPrice = Math.min(...event.tiers.map((t) => t.price));
  const nextShowtime = event.showtimes[0];

  return (
    <div className="group flex flex-col bg-neutral-900/70 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-700 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-neutral-950/50">
      {/* Visual Asset Container (4:3 aspect ratio) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950">
        <img
          src={event.image}
          alt={event.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out brightness-90 group-hover:brightness-100"
          onError={(e) => {
            // Styled fallback container
            const target = e.currentTarget;
            target.style.display = 'none';
          }}
        />

        {/* Ambient subtle gradient scrim for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-black/20 pointer-events-none" />

        {/* Quiet unboxed top metadata */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] font-medium text-neutral-300 pointer-events-none">
          <span className="uppercase tracking-wider text-amber-400 font-semibold drop-shadow-sm">
            {event.category}
          </span>
          <div className="flex items-center gap-1 bg-neutral-950/80 backdrop-blur-md px-2 py-0.5 rounded text-neutral-200 border border-neutral-800/80">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="font-mono tabular-nums text-xs">{event.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Showtime teaser tag at bottom of image */}
        {nextShowtime && (
          <div className="absolute bottom-2.5 left-3 text-[11px] text-neutral-300 bg-neutral-950/85 backdrop-blur-sm px-2 py-0.5 rounded border border-neutral-800/80 flex items-center gap-1.5 font-mono tabular-nums">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Next: {nextShowtime.time} · {nextShowtime.screenOrHall}</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Unboxed Metadata line with typographic separators */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1.5 truncate">
            <span>{event.genre}</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span>{event.duration}</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span>{event.ageGuidance}</span>
          </div>

          {/* Event Title */}
          <h2
            onClick={() => onViewDetails(event)}
            className="text-base sm:text-lg font-semibold text-white group-hover:text-amber-400 transition-colors line-clamp-1 cursor-pointer font-display"
          >
            {event.title}
          </h2>

          {/* Venue & Date */}
          <div className="mt-2 space-y-1 text-xs text-neutral-400">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
              <span className="truncate">{event.venue}, {event.city}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
              <span>{event.date}</span>
            </div>
          </div>
        </div>

        {/* Purchase Action & Price Baseline */}
        <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
          <div>
            <div className="text-[11px] text-neutral-500 uppercase tracking-wider">From</div>
            <div className="text-base font-bold text-white font-mono tabular-nums">
              ${lowestPrice}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewDetails(event)}
              className="px-2.5 py-1.5 text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors whitespace-nowrap"
            >
              Details
            </button>
            <button
              onClick={() => onBook(event)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold rounded-lg transition-all active:scale-95 shadow-sm shadow-amber-400/20 whitespace-nowrap"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Book Seats</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
