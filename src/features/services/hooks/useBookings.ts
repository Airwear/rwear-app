import { useMemo } from 'react';
import { bookingsService } from '@/src/features/services/services/bookingsService';
import { useBookingsSnapshot } from '@/src/features/services/stores/servicesBookingsStore';
import { Booking } from '@/src/features/services/types';

function sortByDate(items: Booking[]) {
  return [...items].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
}

export function useBookings() {
  const bookings = useBookingsSnapshot();

  const orderedBookings = useMemo(() => sortByDate(bookings), [bookings]);
  const activeBookings = useMemo(
    () => orderedBookings.filter((item) => item.status === 'pending' || item.status === 'confirmed'),
    [orderedBookings],
  );

  const recentBookings = useMemo(() => orderedBookings.slice(0, 3), [orderedBookings]);

  const cancelBooking = async (bookingId: string) => bookingsService.cancelBooking(bookingId);

  return {
    bookings: orderedBookings,
    activeBookings,
    recentBookings,
    hasBookings: orderedBookings.length > 0,
    cancelBooking,
  };
}
