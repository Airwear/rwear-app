export type ServiceMode = 'cabinet' | 'domicile' | 'online';
export type BookingMode = ServiceMode;
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export type ServiceCategory = {
  id: string;
  name: string;
  description?: string;
};

export type ServiceSpecialty = {
  id: string;
  categoryId: string;
  name: string;
};

export type ProfessionalAvailability = {
  nextSlotLabel: string;
  acceptsNewRequests: boolean;
};

export type ProfessionalLocation = {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  distanceKm: number;
};

export type ServiceOffering = {
  id: string;
  title: string;
  durationMinutes: number;
  fromPrice: number;
  modes: ServiceMode[];
};

export type Professional = {
  id: string;
  fullName: string;
  headline: string;
  biography: string;
  rating: number;
  reviewCount: number;
  avatarUrl?: string;
  categoryIds: string[];
  specialtyIds: string[];
  location: ProfessionalLocation;
  availability: ProfessionalAvailability;
  offerings: ServiceOffering[];
};

export type FavoriteProfessional = {
  professionalId: string;
  favoritedAt: string;
};

export type ProfessionalSearchFilters = {
  query: string;
  categoryId?: string;
  specialtyId?: string;
  mode?: ServiceMode;
  maxDistanceKm?: number;
};

export type BookingSlot = {
  id: string;
  label: string;
  startsAt: string;
  endsAt: string;
  available: boolean;
};

export type BookingAvailabilityDay = {
  id: string;
  date: string;
  label: string;
  slots: BookingSlot[];
};

export type Booking = {
  id: string;
  professionalId: string;
  professionalName: string;
  professionalHeadline: string;
  offeringId: string;
  offeringTitle: string;
  durationMinutes: number;
  price: number;
  mode: BookingMode;
  status: BookingStatus;
  slotId: string;
  date: string;
  dateLabel: string;
  timeLabel: string;
  startsAt: string;
  endsAt: string;
  placeLabel: string;
  clientAddress?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateBookingInput = {
  professionalId: string;
  offeringId: string;
  mode: BookingMode;
  slotId: string;
  date: string;
  dateLabel: string;
  timeLabel: string;
  startsAt: string;
  endsAt: string;
  clientAddress?: string;
};
