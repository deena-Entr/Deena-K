import React from 'react';
import { Ticket, MapPin, Search } from 'lucide-react';
import { EventCategory } from '../types/ticket';
import { CITIES } from '../data/mockEvents';

interface NavbarProps {
  activeCategory: EventCategory;
  onSelectCategory: (cat: EventCategory) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  onOpenMyTickets: () => void;
  ticketsCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  selectedCity,
  onSelectCity,
  onOpenMyTickets,
  ticketsCount,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onSelectCategory('all');
          }}
          className="text-lg font-bold tracking-tight text-white hover:text-neutral-200 transition-colors shrink-0"
        >
          AURA TICKETS
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-400">
          <button
            onClick={() => onSelectCategory('all')}
            className={`transition-colors hover:text-white pb-0.5 ${
              activeCategory === 'all' ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : ''
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => onSelectCategory('cinema')}
            className={`transition-colors hover:text-white pb-0.5 ${
              activeCategory === 'cinema' ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : ''
            }`}
          >
            Cinema
          </button>
          <button
            onClick={() => onSelectCategory('concert')}
            className={`transition-colors hover:text-white pb-0.5 ${
              activeCategory === 'concert' ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : ''
            }`}
          >
            Concerts
          </button>
          <button
            onClick={() => onSelectCategory('theatre')}
            className={`transition-colors hover:text-white pb-0.5 ${
              activeCategory === 'theatre' ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : ''
            }`}
          >
            Theatre
          </button>
          <button
            onClick={() => onSelectCategory('sports')}
            className={`transition-colors hover:text-white pb-0.5 ${
              activeCategory === 'sports' ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : ''
            }`}
          >
            Sports
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick city selector */}
          <div className="relative hidden sm:flex items-center text-xs text-neutral-300 bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 focus-within:border-neutral-700">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 mr-1.5 shrink-0" />
            <select
              aria-label="Select city filter"
              value={selectedCity}
              onChange={(e) => onSelectCity(e.target.value)}
              className="bg-transparent text-neutral-200 outline-none cursor-pointer pr-1"
            >
              {CITIES.map((c) => (
                <option key={c} value={c} className="bg-neutral-900 text-neutral-200">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Search */}
          <div className="relative hidden lg:block w-48 focus-within:w-64 transition-all duration-200">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search events, venues..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500/80 transition-colors"
            />
          </div>

          {/* "My Tickets" Button */}
          <button
            onClick={onOpenMyTickets}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-amber-400/20"
          >
            <Ticket className="w-3.5 h-3.5 shrink-0" />
            <span>My Tickets</span>
            {ticketsCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-neutral-950 text-amber-400 text-[10px] font-bold rounded-full tabular-nums">
                {ticketsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
