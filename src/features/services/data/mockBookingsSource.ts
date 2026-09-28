import { BookingAvailabilityDay, BookingMode, BookingSlot } from '@/src/features/services/types';

export interface BookingAvailabilityQuery {
  professionalId: string;
  offeringId: string;
  mode: BookingMode;
}

export interface BookingsDataSource {
  getAvailability(query: BookingAvailabilityQuery): Promise<BookingAvailabilityDay[]>;
}

const MODE_TIMESETS: Record<BookingMode, string[]> = {
  cabinet: ['09:00', '10:30', '14:00', '16:30'],
  domicile: ['08:30', '11:00', '15:30'],
  online: ['12:00', '17:00', '19:30'],
};

const MODE_DISABLED_INDEXES: Record<BookingMode, number[]> = {
  cabinet: [1],
  domicile: [2],
  online: [0],
};

function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function buildDayLabel(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });
}

function buildSlot(
  day: Date,
  time: string,
  durationMinutes: number,
  available: boolean,
  key: string,
): BookingSlot {
  const [hours, minutes] = time.split(':').map(Number);
  const startAt = new Date(day);
  startAt.setHours(hours, minutes, 0, 0);
  const endAt = new Date(startAt.getTime() + durationMinutes * 60_000);

  return {
    id: key,
    label: time,
    startsAt: startAt.toISOString(),
    endsAt: endAt.toISOString(),
    available,
  };
}

export class MockBookingsSource implements BookingsDataSource {
  async getAvailability(query: BookingAvailabilityQuery): Promise<BookingAvailabilityDay[]> {
    const base = startOfDay(new Date());
    const timeSet = MODE_TIMESETS[query.mode];
    const disabledIndexes = MODE_DISABLED_INDEXES[query.mode];
    const seed = `${query.professionalId}-${query.offeringId}-${query.mode}`.length;

    return Array.from({ length: 4 }).map((_, dayIndex) => {
      const date = new Date(base);
      date.setDate(base.getDate() + dayIndex + 1);

      const slots = timeSet.map((time, slotIndex) => {
        const durationMinutes = query.offeringId === 'off-2' ? 60 : query.offeringId === 'off-1' ? 45 : 50;
        const forcedUnavailable = disabledIndexes.includes((slotIndex + dayIndex + seed) % timeSet.length);
        return buildSlot(
          date,
          time,
          durationMinutes,
          !forcedUnavailable,
          `${query.professionalId}-${query.offeringId}-${query.mode}-${dayIndex}-${slotIndex}`,
        );
      });

      return {
        id: `${query.professionalId}-${query.offeringId}-${query.mode}-day-${dayIndex}`,
        date: date.toISOString(),
        label: buildDayLabel(date),
        slots,
      };
    });
  }
}
