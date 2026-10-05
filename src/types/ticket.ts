export type EventCategory = 'all' | 'cinema' | 'concert' | 'theatre' | 'sports';

export interface SeatTier {
  id: string;
  name: string;
  price: number;
  color: string;
  description: string;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  tierId: string;
  status: 'available' | 'occupied' | 'selected' | 'accessible';
}

export interface Showtime {
  id: string;
  time: string;
  screenOrHall: string;
  format: string; // e.g. "IMAX Laser", "Dolby Atmos", "Standard 4K"
  availableSeats: number;
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'concession' | 'merch' | 'service';
}

export interface EventItem {
  id: string;
  title: string;
  tagline: string;
  category: EventCategory;
  genre: string;
  city: string;
  venue: string;
  address: string;
  date: string;
  duration: string;
  ageGuidance: string;
  rating: number;
  reviewCount: number;
  image: string;
  featured?: boolean;
  description: string;
  highlights: string[];
  organizerOrDirector: string;
  castOrArtists: string[];
  showtimes: Showtime[];
  tiers: SeatTier[];
  rows: string[];
  seatsPerRow: number;
  occupiedSeats: string[]; // e.g. ["A-3", "B-5"]
}

export interface Booking {
  id: string;
  bookingRef: string;
  eventId: string;
  eventTitle: string;
  eventImage: string;
  venue: string;
  city: string;
  date: string;
  showtime: string;
  format: string;
  seats: {
    id: string;
    row: string;
    number: number;
    tierName: string;
    price: number;
  }[];
  addOns: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  totalAmount: number;
  serviceFee: number;
  bookedAt: string;
  status: 'confirmed' | 'cancelled';
  gate: string;
}
