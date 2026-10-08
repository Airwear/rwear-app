import { MockBookingsSource, type BookingsDataSource } from '@/src/features/services/data/mockBookingsSource';
import { servicesNotificationsService } from '@/src/features/services/services/servicesNotificationsService';
import { servicesService } from '@/src/features/services/services/servicesService';
import {
  addBooking,
  getBookingsSnapshot,
  getNextBookingSequence,
  hydrateBookings,
  updateBookingStatus,
} from '@/src/features/services/stores/servicesBookingsStore';
import {
  Booking,
  BookingAvailabilityDay,
  BookingMode,
  BookingStatus,
  CreateBookingInput,
  Professional,
  ServiceOffering,
} from '@/src/features/services/types';

function formatBookingId(sequence: number): string {
  return `RDV-${String(sequence).padStart(4, '0')}`;
}

function statusCanBeCancelled(status: BookingStatus): boolean {
  return status === 'pending' || status === 'confirmed';
}

export class BookingsService {
  private source: BookingsDataSource;

  constructor(source: BookingsDataSource) {
    this.source = source;
  }

  async getAvailability(professionalId: string, offeringId: string, mode: BookingMode): Promise<BookingAvailabilityDay[]> {
    return this.source.getAvailability({ professionalId, offeringId, mode });
  }

  async getBookings(): Promise<Booking[]> {
    await hydrateBookings();
    return getBookingsSnapshot();
  }

  async getBookingById(id: string): Promise<Booking | null> {
    await hydrateBookings();
    return getBookingsSnapshot().find((item) => item.id === id) || null;
  }

  async createBooking(input: CreateBookingInput): Promise<Booking> {
    const professional = await servicesService.getProfessionalById(input.professionalId);
    if (!professional) {
      throw new Error('Professionnel introuvable.');
    }

    const offering = professional.offerings.find((item) => item.id === input.offeringId);
    if (!offering) {
      throw new Error('Prestation introuvable.');
    }

    const sequence = await getNextBookingSequence();
    const booking = buildBooking(sequence, professional, offering, input);
    await addBooking(booking);
    await servicesNotificationsService.onBookingConfirmed(booking);
    return booking;
  }

  async cancelBooking(id: string): Promise<Booking | null> {
    const booking = await this.getBookingById(id);
    if (!booking) {
      return null;
    }

    if (!statusCanBeCancelled(booking.status)) {
      return booking;
    }

    await updateBookingStatus(id, 'cancelled');
    const cancelledBooking = await this.getBookingById(id);
    if (cancelledBooking) {
      await servicesNotificationsService.onBookingCancelled(cancelledBooking);
    }

    return cancelledBooking;
  }
}

function buildBooking(
  sequence: number,
  professional: Professional,
  offering: ServiceOffering,
  input: CreateBookingInput,
): Booking {
  const createdAt = new Date().toISOString();
  const placeLabel = input.mode === 'cabinet'
    ? professional.location.address
    : input.mode === 'domicile'
      ? input.clientAddress || 'Adresse client'
      : 'Lien de connexion envoyé avant la séance';

  return {
    id: formatBookingId(sequence),
    professionalId: professional.id,
    professionalName: professional.fullName,
    professionalHeadline: professional.headline,
    offeringId: offering.id,
    offeringTitle: offering.title,
    durationMinutes: offering.durationMinutes,
    price: offering.fromPrice,
    mode: input.mode,
    status: 'pending',
    slotId: input.slotId,
    date: input.date,
    dateLabel: input.dateLabel,
    timeLabel: input.timeLabel,
    startsAt: input.startsAt,
    endsAt: input.endsAt,
    placeLabel,
    clientAddress: input.clientAddress,
    createdAt,
    updatedAt: createdAt,
  };
}

export const bookingsService = new BookingsService(new MockBookingsSource());
