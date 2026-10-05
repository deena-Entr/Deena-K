import React from 'react';
import { Search, Filter, CalendarDays, MapPin } from 'lucide-react';
import { EventCategory } from '../types/ticket';
import { CITIES } from '../data/mockEvents';

interface FilterBarProps {
  activeCategory: EventCategory;
  onSelectCategory: (cat: EventCategory) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  selectedDateFilter: string;
  onSelectDateFilter: (filter: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  resultsCount: number;
}

const CATEGORIES: { id: EventCategory; label: string }[] = [
  { id: 'all', label: 'All Experiences' },
  { id: 'cinema', label: 'Cinema & IMAX' },
  { id: 'concert', label: 'Live Music' },
  { id: 'theatre', label: 'Theatre & Stage' },
  { id: 'sports', label: 'Sports & Racing' },
];

const DATE_OPTIONS = [
  { id: 'all', label: 'All Dates' },
  { id: 'tonight', label: 'Tonight' },
  { id: 'weekend', label: 'This Weekend' },
  { id: 'upcoming', label: 'Next 30 Days' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  activeCategory,
  onSelectCategory,
  selectedCity,
  onSelectCity,
  selectedDateFilter,
  onSelectDateFilter,
  searchQuery,
  onSearchChange,
  resultsCount,
}) => {
  return (
    <div className="w-full bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/80 sticky top-16 z-30 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        {/* Top Filter Row: Category Segmented Bar + Results count */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Functional Segmented Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-neutral-800 text-white shadow-sm ring-1 ring-neutral-700 font-semibold'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Quick Selectors: Date + City (on mobile/tablet) + Results Indicator */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {/* Date filter dropdown */}
            <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1 text-neutral-300">
              <CalendarDays className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />
              <select
                aria-label="Filter by date range"
                value={selectedDateFilter}
                onChange={(e) => onSelectDateFilter(e.target.value)}
                className="bg-transparent text-neutral-200 outline-none cursor-pointer pr-1"
              >
                {DATE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-neutral-900 text-neutral-200">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* City filter (visible on mobile / small screens) */}
            <div className="flex sm:hidden items-center bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1 text-neutral-300">
              <MapPin className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />
              <select
                aria-label="Filter by city"
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

            {/* Results count tabular text */}
            <span className="text-neutral-500 hidden sm:inline-block">·</span>
            <span className="text-neutral-400 tabular-nums font-mono text-[11px]">
              {resultsCount} {resultsCount === 1 ? 'experience' : 'experiences'} found
            </span>
          </div>
        </div>

        {/* Mobile Search Input (visible only below lg breakpoint) */}
        <div className="lg:hidden relative w-full">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by event title, artist, genre..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-8 pr-3 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500/80 transition-colors"
          />
        </div>
      </div>
    </div>
  );
};
