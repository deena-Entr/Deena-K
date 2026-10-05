import { Booking } from '../types/ticket';

export function generateCalendarICS(booking: Booking): void {
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  // Approximate date parsing: e.g. "Oct 12, 2026", showtime: "20:45"
  const now = new Date();
  const dateStr = booking.date; // e.g. "Oct 12, 2026"
  const [timeH, timeM] = booking.showtime.split(':').map((s) => parseInt(s, 10) || 0);

  const parsedDate = new Date(`${dateStr} ${booking.showtime || '20:00'}`);
  const startDate = isNaN(parsedDate.getTime()) ? new Date(now.getTime() + 86400000 * 3) : parsedDate;
  const endDate = new Date(startDate.getTime() + 2.5 * 60 * 60 * 1000); // +2.5 hours

  const formatICSDate = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

  const seatsList = booking.seats.map((s) => `${s.row}${s.number} (${s.tierName})`).join(', ');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AURA Tickets//Ticket Pass//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${booking.bookingRef}@auratickets.com`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    `DTSTART:${formatICSDate(startDate)}`,
    `DTEND:${formatICSDate(endDate)}`,
    `SUMMARY:${booking.eventTitle} (Ref: ${booking.bookingRef})`,
    `DESCRIPTION:Your booking for ${booking.eventTitle} is confirmed.\\nVenue: ${booking.venue}\\nSeats: ${seatsList}\\nGate/Doors: ${booking.gate}\\nFormat: ${booking.format}`,
    `LOCATION:${booking.venue}, ${booking.city}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `ticket-${booking.bookingRef}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
