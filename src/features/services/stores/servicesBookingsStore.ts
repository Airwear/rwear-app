import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useSyncExternalStore } from 'react';
import { Booking } from '@/src/features/services/types';

const BOOKINGS_KEY = '@servicesBookings';
const BOOKINGS_COUNTER_KEY = '@servicesBookingsCounter';

type Listener = () => void;

let bookings: Booking[] = [];
let hydrated = false;
let hydrationPromise: Promise<void> | null = null;
const listeners = new Set<Listener>();

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

async function persistBookings(nextBookings: Booking[]) {
  bookings = nextBookings;
  try {
    await AsyncStorage.setItem(BOOKINGS_KEY, JSON.stringify(nextBookings));
  } catch {
    // Keep in-memory state usable even if persistence fails.
  }
  notify();
}

export async function hydrateBookings(): Promise<void> {
  if (hydrated) {
    return;
  }

  if (!hydrationPromise) {
    hydrationPromise = AsyncStorage.getItem(BOOKINGS_KEY)
      .then((raw) => {
        bookings = raw ? (JSON.parse(raw) as Booking[]) : [];
      })
      .catch(() => {
        bookings = [];
      })
      .finally(() => {
        hydrated = true;
        hydrationPromise = null;
        notify();
      });
  }

  await hydrationPromise;
}

export function subscribeToBookings(listener: Listener) {
  listeners.add(listener);
  void hydrateBookings();
  return () => {
    listeners.delete(listener);
  };
}

export function getBookingsSnapshot(): Booking[] {
  return bookings;
}

export async function getNextBookingSequence(): Promise<number> {
  const raw = await AsyncStorage.getItem(BOOKINGS_COUNTER_KEY);
  const current = Number(raw || '0');
  const next = current + 1;
  await AsyncStorage.setItem(BOOKINGS_COUNTER_KEY, String(next));
  return next;
}

export async function addBooking(booking: Booking): Promise<void> {
  await hydrateBookings();
  await persistBookings([booking, ...bookings]);
}

export async function updateBookingStatus(bookingId: string, status: Booking['status']): Promise<void> {
  await hydrateBookings();
  const next = bookings.map((item) => (item.id === bookingId ? { ...item, status, updatedAt: new Date().toISOString() } : item));
  await persistBookings(next);
}

export function useBookingsSnapshot(): Booking[] {
  const snapshot = useSyncExternalStore(subscribeToBookings, getBookingsSnapshot, getBookingsSnapshot);

  useEffect(() => {
    void hydrateBookings();
  }, []);

  return snapshot;
}
