import React from 'react';
import { Calendar, MapPin, Volume2, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { EventItem } from '../types/ticket';

interface HeroBannerProps {
  featuredEvent: EventItem;
  onBookNow: (event: EventItem) => void;
  onViewDetails: (event: EventItem) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  featuredEvent,
  onBookNow,
  onViewDetails,
}) => {
  return (
    <section className="relative w-full overflow-hidden border-b border-neutral-800 bg-neutral-950">
      {/* Background Hero Image with measured scrim */}
      <div className="relative h-[480px] sm:h-[540px] lg:h-[600px] w-full">
        <img
          src={featuredEvent.image}
          alt={featuredEvent.title}
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover object-center filter brightness-[0.7] contrast-[1.05]"
        />

        {/* Ambient Gradient Scrims for WCAG 4.5:1 text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/70 to-transparent" />

        {/* Hero Content Container */}
        <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 sm:pb-16">
          <div className="max-w-3xl space-y-4">
            {/* Unboxed Text Metadata */}
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-neutral-300 font-medium tracking-wide">
              <span className="text-amber-400 font-semibold uppercase tracking-wider">Spotlight Premiere</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span>{featuredEvent.genre}</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                {featuredEvent.city}
              </span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                {featuredEvent.date}
              </span>
            </div>

            {/* Display Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight font-display max-w-2xl">
              {featuredEvent.title}
            </h1>

            {/* Tagline / Subtitle */}
            <p className="text-sm sm:text-base text-neutral-300 line-clamp-2 max-w-2xl font-normal leading-relaxed">
              {featuredEvent.tagline}
            </p>

            {/* Tech Specs & Trust callouts in clean unboxed inline text */}
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-neutral-400">
              <div className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>Dolby Atmos Spatial Audio</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Reserved Recliner Seating</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Official Box Office Guarantee</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <button
                onClick={() => onBookNow(featuredEvent)}
                className="flex items-center gap-2.5 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-sm font-semibold rounded-lg transition-all transform active:scale-95 shadow-lg shadow-amber-400/20 whitespace-nowrap"
              >
                <span>Select Seats & Book</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onViewDetails(featuredEvent)}
                className="px-5 py-3 border border-neutral-700 hover:border-neutral-500 bg-neutral-900/60 hover:bg-neutral-800/80 text-white text-sm font-medium rounded-lg transition-colors backdrop-blur-sm whitespace-nowrap"
              >
                Event Details & Cast
              </button>

              <div className="text-xs text-neutral-400 pl-2">
                Tickets from <span className="text-white font-semibold text-sm tabular-nums">${featuredEvent.tiers[featuredEvent.tiers.length - 1]?.price || 19}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
